import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getAdminCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';
import { randomUUID } from 'crypto';

function getIp(req: NextRequest) {
    return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
}

async function resolveGeo(ip: string) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') return null;
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
        const data = await res.json();
        if (data.status === 'success') {
            return `${data.city}, ${data.country}`;
        }
    } catch { }
    return null;
}

type Webhook = {
    id: string;
    name: string;
    url: string;
    events: string[];
    is_active: boolean;
};

async function getWebhooks(): Promise<Webhook[]> {
    const res = await query<{ value: string }>(`SELECT value FROM site_settings WHERE key = 'webhooks_config'`);
    if (res.rows.length === 0) return [];
    try {
        return JSON.parse(res.rows[0].value) as Webhook[];
    } catch {
        return [];
    }
}

async function saveWebhooks(webhooks: Webhook[]) {
    await query(
        `INSERT INTO site_settings (key, value) VALUES ('webhooks_config', $1)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [JSON.stringify(webhooks)]
    );
}

export async function GET() {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const webhooks = await getWebhooks();
        return apiSuccess(webhooks);
    } catch (error) {
        logger.error('[Webhooks GET]', error);
        return apiError('Internal server error', 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const body = await req.json();
        const { id, name, url, events, is_active } = body;

        let webhooks = await getWebhooks();
        let action = 'webhook_updated';

        if (id) {
            const idx = webhooks.findIndex(w => w.id === id);
            if (idx === -1) return apiError('Webhook not found', 404);
            webhooks[idx] = { id, name, url, events, is_active };
        } else {
            action = 'webhook_created';
            webhooks.push({
                id: randomUUID(),
                name,
                url,
                events: events || [],
                is_active: is_active ?? true
            });
        }

        await saveWebhooks(webhooks);

        const ip = getIp(req);
        const geo = await resolveGeo(ip);
        const ua = req.headers.get('user-agent');

        await query(
            `INSERT INTO audit_logs (admin_id, action, target_type, changes, ip_address, user_agent, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user.id, action, 'system', JSON.stringify({ name, url, events }), ip, ua, geo]
        );

        return apiSuccess({ message: `Webhook saved.` });
    } catch (error) {
        logger.error('[Webhooks POST]', error);
        return apiError('Internal server error', 500);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const body = await req.json();
        const { id } = body;

        let webhooks = await getWebhooks();
        const initialLength = webhooks.length;
        const target = webhooks.find(w => w.id === id);

        webhooks = webhooks.filter(w => w.id !== id);

        if (webhooks.length === initialLength) {
            return apiError('Webhook not found', 404);
        }

        await saveWebhooks(webhooks);

        const ip = getIp(req);
        const geo = await resolveGeo(ip);
        const ua = req.headers.get('user-agent');

        await query(
            `INSERT INTO audit_logs (admin_id, action, target_type, changes, ip_address, user_agent, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user.id, 'webhook_deleted', 'system', JSON.stringify({ name: target?.name, url: target?.url }), ip, ua, geo]
        );

        return apiSuccess({ message: `Webhook deleted.` });
    } catch (error) {
        logger.error('[Webhooks DELETE]', error);
        return apiError('Internal server error', 500);
    }
}
