import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getAdminCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';
import * as os from 'os';
import { revalidatePath } from 'next/cache';

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

// GET /api/server-admin/maintenance — Fetch system health
export async function GET() {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        // Fetch maintenance mode flag
        const dbRes = await query<{ value: string }>(`SELECT value FROM site_settings WHERE key = 'maintenance_mode'`);
        const maintenance_mode = dbRes.rows[0]?.value === 'true' || dbRes.rows[0]?.value === '"true"';

        const cpuLoad = os.loadavg(); // [1m, 5m, 15m] array
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;

        // Approximate CPU percentage for 1-minute load vs core count
        const cores = os.cpus().length;
        const cpuPercent = Math.min(100, Math.round((cpuLoad[0] / cores) * 100));

        return apiSuccess({
            cpu_percent: cpuPercent,
            memory_used_gb: (usedMem / 1024 / 1024 / 1024).toFixed(2),
            memory_total_gb: (totalMem / 1024 / 1024 / 1024).toFixed(2),
            memory_percent: Math.round((usedMem / totalMem) * 100),
            maintenance_mode
        });

    } catch (error) {
        logger.error('[Maintenance Stats GET]', error);
        return apiError('Internal server error', 500);
    }
}

// POST /api/server-admin/maintenance — Execute operation
export async function POST(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const body = await req.json();
        const { action } = body;

        const ip = getIp(req);
        const geo = await resolveGeo(ip);
        const ua = req.headers.get('user-agent');

        if (action === 'toggle_maintenance') {
            const { enabled } = body;
            await query(
                `INSERT INTO site_settings (key, value) VALUES ('maintenance_mode', $1)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
                [enabled ? 'true' : 'false']
            );
            await query(
                `INSERT INTO audit_logs (admin_id, action, target_type, changes, ip_address, user_agent, location)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [user.id, 'maintenance_mode_toggled', 'system', JSON.stringify({ enabled }), ip, ua, geo]
            );
            return apiSuccess({ message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}.` });
        }

        if (action === 'clear_cache') {
            try {
                // Clear entire app router cache
                revalidatePath('/', 'layout');
                await query(
                    `INSERT INTO audit_logs (admin_id, action, target_type, ip_address, user_agent, location)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [user.id, 'cache_cleared', 'system', ip, ua, geo]
                );
                return apiSuccess({ message: 'Application cache cleared successfully.' });
            } catch {
                return apiError('Failed to clear cache.', 500);
            }
        }

        if (action === 'reindex_db') {
            try {
                // Safe reindex operation for PostgreSQL
                await query(`REINDEX SCHEMA public`);
                await query(
                    `INSERT INTO audit_logs (admin_id, action, target_type, ip_address, user_agent, location)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [user.id, 'database_reindexed', 'database', ip, ua, geo]
                );
                return apiSuccess({ message: 'Database re-indexed successfully.' });
            } catch (err) {
                logger.error('DB Reindex failed', err);
                return apiError('Database re-indexing failed.', 500);
            }
        }

        return apiError('Invalid action', 400);
    } catch (error) {
        logger.error('[Maintenance Action POST]', error);
        return apiError('Internal server error', 500);
    }
}
