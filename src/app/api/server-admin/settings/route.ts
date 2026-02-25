import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';
import { logger } from '@/lib/logger';
import { resolveGeo } from '@/lib/login-logger';

// Default settings if table is empty or missing
const DEFAULTS: Record<string, string> = {
    site_name: 'LowKey',
    site_tagline: 'The quiet internet.',
    site_description: '',
    registration_enabled: 'true',
    maintenance_mode: 'false',
    default_user_role: 'user',
    max_post_length: '2000',
    allow_incognito_posts: 'true',
    require_email_verification: 'false',
    announcement: '',
    business_address: '',
    business_hours: '',
    show_business_info: 'false',
    social_links: '{}',
};

export async function GET() {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        try {
            const rows = await query<{ key: string; value: unknown }>(
                `SELECT key, value FROM site_settings ORDER BY key`
            );
            const settings: Record<string, string> = { ...DEFAULTS };
            for (const row of rows.rows) {
                // value is JSONB. It should be returned as parsed by pg.
                settings[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
            }
            return apiSuccess(settings);
        } catch {
            return apiSuccess(DEFAULTS);
        }
    } catch (error) {
        logger.error('[Admin Settings GET]', error);
        return apiError('Internal server error', 500);
    }
}

export async function PATCH(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || null;
    const ua = req.headers.get('user-agent') || null;

    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const body = await req.json();

        // Settings changed tracking
        const changedKeys = Object.keys(body);

        for (const [key, value] of Object.entries(body)) {
            // Must stringify the value so that Postgres accepts it as valid JSONB,
            // even if it's just a regular string like "LowKey" -> "\"LowKey\""
            // Wait: pg library parameterizes $2. If we pass JSON.stringify(value), it's a valid JSON string.
            // If the user already passed a JSON string (like social_links="{}"), we should just test if it's already JSON.
            let jsonbValue = '';
            try {
                // if it's already valid JSON, parse and stringify again (validates it)
                if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                    JSON.parse(value);
                    jsonbValue = value;
                } else {
                    jsonbValue = JSON.stringify(value);
                }
            } catch {
                jsonbValue = JSON.stringify(value);
            }

            await query(
                `INSERT INTO site_settings (key, value, updated_by, updated_at)
                 VALUES ($1, $2::jsonb, $3, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_by = $3, updated_at = NOW()`,
                [key, jsonbValue, ctx.user.id]
            );
        }

        // Detailed Audit Logging
        try {
            const geo = await resolveGeo(ip);
            const metadata: Record<string, unknown> = {
                keys_updated: changedKeys,
                success: true
            };
            if (geo) metadata.geo = geo;

            await query(
                `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata)
                 VALUES ($1, 'settings_update', $2::inet, $3, $4::jsonb)`,
                [ctx.user.id, ip || null, ua || null, JSON.stringify(metadata)]
            );
        } catch (logErr) {
            logger.error('[Admin Settings Audit Log Error]', logErr);
        }

        return apiSuccess({ message: 'Settings saved' });
    } catch (error) {
        logger.error('[Admin Settings PATCH]', error);

        // Log failure
        try {
            const ctx = await requireAdmin();
            if (ctx) {
                const geo = await resolveGeo(ip);
                await query(
                    `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata)
                     VALUES ($1, 'settings_update_failure', $2::inet, $3, $4::jsonb)`,
                    [ctx.user.id, ip || null, ua || null, JSON.stringify({ success: false, error: String(error), geo })]
                );
            }
        } catch { }

        return apiError('Internal server error', 500);
    }
}
