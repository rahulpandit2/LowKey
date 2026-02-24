import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) return null;
    const a = await getOne<{ is_active: boolean }>(
        `SELECT is_active FROM admin_users WHERE user_id = $1`, [user.id]
    );
    return a?.is_active ? user : null;
}

// GET /api/server-admin/logs?page=1&action_type=&admin_id=
export async function GET(req: NextRequest) {
    try {
        const admin = await requireAdmin();
        if (!admin) return apiError('Forbidden', 403);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const actionType = searchParams.get('action_type') || '';
        const limit = 50;
        const offset = (page - 1) * limit;

        const params: (string | number)[] = [];
        let where = '';
        let paramIdx = 1;
        if (actionType) {
            where = `WHERE action_type = $${paramIdx}`;
            params.push(actionType);
            paramIdx++;
        }
        params.push(limit, offset);

        const [logs, countRow] = await Promise.all([
            query<{
                id: string; action_type: string; target_type: string; target_id: string | null;
                reason: string | null; ip_address: string | null; created_at: string;
                admin_username: string;
            }>(
                `WITH combined_logs AS (
                   SELECT
                     aa.id, aa.action_type, aa.target_type, aa.target_id,
                     aa.reason, COALESCE(aa.ip_address::text, '') AS ip_address, aa.created_at,
                     u.username AS admin_username
                   FROM admin_actions aa
                   JOIN users u ON u.id = aa.admin_id
                   
                   UNION ALL
                   
                   SELECT
                     al.id, al.action AS action_type, al.target_type, al.target_id,
                     al.metadata->>'level' AS reason, COALESCE(al.ip_address::text, '') AS ip_address, al.created_at,
                     COALESCE(u.username, 'system') AS admin_username
                   FROM audit_logs al
                   LEFT JOIN users u ON u.id = al.user_id
                 )
                 SELECT * FROM combined_logs
                 ${where}
                 ORDER BY created_at DESC
                 LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
                params
            ),
            getOne<{ count: number }>(
                `WITH combined_logs AS (
                   SELECT action_type FROM admin_actions
                   UNION ALL
                   SELECT action AS action_type FROM audit_logs
                 )
                 SELECT COUNT(*) AS count FROM combined_logs ${where}`,
                params.slice(0, -2)
            ),
        ]);

        return apiSuccess({
            logs: logs.rows,
            total: Number(countRow?.count || 0),
            page,
            pages: Math.ceil(Number(countRow?.count || 0) / limit),
        });
    } catch (error) {
        logger.error('[Admin Logs GET]', error);
        return apiError('Internal server error', 500);
    }
}
