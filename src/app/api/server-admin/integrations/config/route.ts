import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getAdminCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// Reusable function to grab IP safely
function getIp(req: NextRequest) {
    return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
}

// Reusable function to grab Geo safely
async function resolveGeo(ip: string) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') return null;
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
        const data = await res.json();
        if (data.status === 'success') {
            return `${data.city}, ${data.country}`;
        }
    } catch { } // ignore
    return null;
}

const MASK = '********';

export async function GET() {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const res = await query<{ key: string, value: string }>(
            `SELECT key, value FROM site_settings WHERE key IN ('aws_s3_config', 'smtp_config')`
        );

        let aws = { enabled: false, region: '', bucket: '', access_key: '', secret_key: '' };
        let smtp = { enabled: false, host: '', port: '', username: '', password: '', from_email: '' };

        res.rows.forEach(row => {
            try {
                const parsed = JSON.parse(row.value);
                if (row.key === 'aws_s3_config') aws = { ...aws, ...parsed };
                if (row.key === 'smtp_config') smtp = { ...smtp, ...parsed };
            } catch { }
        });

        // Mask secrets
        if (aws.secret_key) aws.secret_key = MASK;
        if (smtp.password) smtp.password = MASK;

        return apiSuccess({ aws, smtp });
    } catch (error) {
        logger.error('[Integrations Config GET]', error);
        return apiError('Internal server error', 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const body = await req.json();
        const { type, config } = body; // type is 'aws' or 'smtp'

        if (type !== 'aws' && type !== 'smtp') {
            return apiError('Invalid config type', 400);
        }

        const key = type === 'aws' ? 'aws_s3_config' : 'smtp_config';

        // Fetch existing to preserve masked secrets
        const existingRes = await query<{ value: string }>(`SELECT value FROM site_settings WHERE key = $1`, [key]);
        let existing = {};
        if (existingRes.rows.length > 0) {
            try { existing = JSON.parse(existingRes.rows[0].value); } catch { }
        }

        // If the incoming config has MASK, replace it with the real existing value
        const newConfig = { ...config };
        if (type === 'aws' && newConfig.secret_key === MASK) {
            newConfig.secret_key = (existing as any).secret_key || '';
        }
        if (type === 'smtp' && newConfig.password === MASK) {
            newConfig.password = (existing as any).password || '';
        }

        await query(
            `INSERT INTO site_settings (key, value) VALUES ($1, $2)
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
            [key, JSON.stringify(newConfig)]
        );

        const ip = getIp(req);
        const geo = await resolveGeo(ip);
        const ua = req.headers.get('user-agent');

        await query(
            `INSERT INTO audit_logs (admin_id, action, target_type, changes, ip_address, user_agent, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user.id, 'integration_configured', type, JSON.stringify({ type, action: 'updated' }), ip, ua, geo]
        );

        return apiSuccess({ message: `${type.toUpperCase()} configuration saved.` });
    } catch (error) {
        logger.error('[Integrations Config POST]', error);
        return apiError('Internal server error', 500);
    }
}
