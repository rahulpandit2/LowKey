import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/settings
export async function GET() {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        try {
            const rows = await query<{ key: string; value: string; updated_at: string }>(
                `SELECT key, value, updated_at FROM site_settings ORDER BY key`
            );
            const settings: Record<string, string> = {};
            for (const row of rows.rows) {
                settings[row.key] = row.value;
            }
            return apiSuccess(settings);
        } catch {
            // Table doesn't exist — return defaults
            return apiSuccess({
                site_name: 'LowKey',
                site_tagline: 'The quiet internet.',
                registration_enabled: 'true',
                maintenance_mode: 'false',
                default_user_role: 'user',
                max_post_length: '2000',
                allow_incognito_posts: 'true',
                require_email_verification: 'false',
                announcement: '',
            });
        }
    } catch (error) {
        logger.error('[Admin Settings GET]', error);
        return apiError('Internal server error', 500);
    }
}

// PATCH /api/server-admin/settings
export async function PATCH(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const body = await req.json();

        try {
            for (const [key, value] of Object.entries(body)) {
                await query(
                    `INSERT INTO site_settings (key, value, updated_by, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3, updated_at = NOW()`,
                    [key, String(value), ctx.user.id]
                );
            }
        } catch {
            // Create table and retry
            await query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL DEFAULT '',
          updated_by UUID REFERENCES users(id),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
            for (const [key, value] of Object.entries(body)) {
                await query(
                    `INSERT INTO site_settings (key, value, updated_by, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3, updated_at = NOW()`,
                    [key, String(value), ctx.user.id]
                );
            }
        }

        // Log — adminId is admin_users.id FK
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, reason)
       VALUES ($1, 'update', 'site_settings', 'Site settings updated')`,
            [ctx.adminId]
        );

        return apiSuccess({ message: 'Settings saved' });
    } catch (error) {
        logger.error('[Admin Settings PATCH]', error);
        return apiError('Internal server error', 500);
    }
}
