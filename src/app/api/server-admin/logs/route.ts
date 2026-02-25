import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/logs?page=1&tab=login_attempts|admin_actions|all
export async function GET(req: NextRequest) {
    try {
        const admin = await requireAdmin();
        if (!admin) return apiError('Forbidden', 403);

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const tab = searchParams.get('tab') || 'login_attempts';
        const limit = 50;
        const offset = (page - 1) * limit;

        if (tab === 'login_attempts') {
            // From audit_logs where action is login_success or login_failure
            const [logs, countRow] = await Promise.all([
                query<{
                    id: string; action: string; ip_address: string | null;
                    user_agent: string | null; metadata: Record<string, unknown> | null;
                    created_at: string; actor: string;
                }>(
                    `SELECT
                       al.id,
                       al.action AS action_type,
                       al.ip_address::text AS ip_address,
                       al.user_agent,
                       al.metadata,
                       al.created_at,
                       COALESCE(u.username, al.metadata->>'identifier', 'anonymous') AS actor
                     FROM audit_logs al
                     LEFT JOIN users u ON u.id = al.user_id
                     WHERE al.action IN ('login_success', 'login_failure')
                     ORDER BY al.created_at DESC
                     LIMIT $1 OFFSET $2`,
                    [limit, offset]
                ),
                getOne<{ count: string }>(
                    `SELECT COUNT(*)::text AS count FROM audit_logs WHERE action IN ('login_success', 'login_failure')`,
                    []
                ),
            ]);

            const total = parseInt(countRow?.count || '0');
            return apiSuccess({
                logs: logs.rows.map(r => ({
                    ...r,
                    target_type: null,
                    target_id: null,
                    reason: null,
                })),
                total,
                page,
                pages: Math.ceil(total / limit),
            });
        }

        if (tab === 'admin_actions') {
            const [logs, countRow] = await Promise.all([
                query<{
                    id: string; action_type: string; target_type: string | null;
                    target_id: string | null; reason: string | null;
                    ip_address: string | null; user_agent: string | null;
                    created_at: string; actor: string;
                }>(
                    `SELECT
                       aa.id,
                       aa.action_type,
                       aa.target_type,
                       aa.target_id::text AS target_id,
                       aa.reason,
                       aa.ip_address::text AS ip_address,
                       aa.user_agent,
                       aa.created_at,
                       u.username AS actor
                     FROM admin_actions aa
                     JOIN admin_users au ON au.id = aa.admin_id
                     JOIN users u ON u.id = au.user_id
                     ORDER BY aa.created_at DESC
                     LIMIT $1 OFFSET $2`,
                    [limit, offset]
                ),
                getOne<{ count: string }>(
                    `SELECT COUNT(*)::text AS count FROM admin_actions`,
                    []
                ),
            ]);

            const total = parseInt(countRow?.count || '0');
            return apiSuccess({
                logs: logs.rows.map(r => ({ ...r, metadata: null })),
                total,
                page,
                pages: Math.ceil(total / limit),
            });
        }

        // tab === 'all' — combined view
        const [logs, countRow] = await Promise.all([
            query<{
                id: string; action_type: string; target_type: string | null;
                target_id: string | null; reason: string | null;
                ip_address: string | null; user_agent: string | null;
                created_at: string; actor: string; metadata: Record<string, unknown> | null;
            }>(
                `SELECT
                   id, action_type, target_type, target_id, reason, ip_address, user_agent, created_at, actor, metadata
                 FROM (
                   SELECT
                     aa.id,
                     aa.action_type,
                     aa.target_type,
                     aa.target_id::text AS target_id,
                     aa.reason,
                     aa.ip_address::text AS ip_address,
                     aa.user_agent,
                     aa.created_at,
                     u.username AS actor,
                     NULL::jsonb AS metadata
                   FROM admin_actions aa
                   JOIN admin_users au ON au.id = aa.admin_id
                   JOIN users u ON u.id = au.user_id

                   UNION ALL

                   SELECT
                     al.id,
                     al.action AS action_type,
                     al.target_type,
                     al.target_id::text AS target_id,
                     al.metadata->>'failure_reason' AS reason,
                     al.ip_address::text AS ip_address,
                     al.user_agent,
                     al.created_at,
                     COALESCE(u.username, al.metadata->>'identifier', 'system') AS actor,
                     al.metadata
                   FROM audit_logs al
                   LEFT JOIN users u ON u.id = al.user_id
                 ) combined
                 ORDER BY created_at DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            ),
            getOne<{ count: string }>(
                `SELECT (SELECT COUNT(*) FROM admin_actions) + (SELECT COUNT(*) FROM audit_logs) AS count`,
                []
            ),
        ]);

        const total = parseInt(countRow?.count || '0');
        return apiSuccess({
            logs: logs.rows,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        logger.error('[Admin Logs GET]', error);
        return apiError('Internal server error', 500);
    }
}
