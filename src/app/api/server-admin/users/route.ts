import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/users?page=1&search=&filter=all
export async function GET(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const filter = searchParams.get('filter') || 'all'; // all, active, banned, suspended
        const limit = 25;
        const offset = (page - 1) * limit;

        let whereClause = `WHERE u.deleted_at IS NULL`;
        const params: (string | number)[] = [];
        let paramIdx = 1;

        if (search) {
            whereClause += ` AND (u.username ILIKE $${paramIdx} OR u.email ILIKE $${paramIdx} OR p.display_name ILIKE $${paramIdx})`;
            params.push(`%${search}%`);
            paramIdx++;
        }
        if (filter !== 'all') {
            whereClause += ` AND u.status = $${paramIdx}`;
            params.push(filter);
            paramIdx++;
        }

        params.push(limit, offset);

        const [users, countRow] = await Promise.all([
            query<{
                id: string; username: string; email: string; status: string;
                role: string; created_at: string; last_login_at: string | null;
                display_name: string | null; post_count: number; follower_count: number;
                is_admin: boolean;
            }>(
                `SELECT
           u.id, u.username, u.email, u.status, u.role, u.created_at, u.last_login_at,
           p.display_name,
           (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND deleted_at IS NULL)::int AS post_count,
           (SELECT COUNT(*) FROM follows WHERE following_id = u.id)::int AS follower_count,
           (SELECT COUNT(*) > 0 FROM admin_users WHERE user_id = u.id AND is_active = true) AS is_admin
         FROM users u
         LEFT JOIN profiles p ON p.user_id = u.id
         ${whereClause}
         ORDER BY u.created_at DESC
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
                params
            ),
            getOne<{ count: number }>(
                `SELECT COUNT(*) AS count FROM users u LEFT JOIN profiles p ON p.user_id = u.id ${whereClause}`,
                params.slice(0, -2)
            ),
        ]);

        return apiSuccess({
            users: users.rows,
            total: Number(countRow?.count || 0),
            page,
            pages: Math.ceil(Number(countRow?.count || 0) / limit),
        });
    } catch (error) {
        logger.error('[Admin Users GET]', error);
        return apiError('Internal server error', 500);
    }
}

// PATCH /api/server-admin/users — ban, suspend, or restore a user
export async function PATCH(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { user_id, action, reason } = await req.json();
        if (!user_id || !action) return apiError('user_id and action required', 400);

        const targetUser = await getOne<{ id: string; username: string; status: string }>(
            `SELECT id, username, status FROM users WHERE id = $1 AND deleted_at IS NULL`, [user_id]
        );
        if (!targetUser) return apiError('User not found', 404);

        // Prevent acting on admins
        const targetAdmin = await getOne(
            `SELECT id FROM admin_users WHERE user_id = $1 AND is_active = true`, [user_id]
        );
        if (targetAdmin) return apiError('Cannot modify admin accounts from this endpoint', 403);

        let newStatus: string;
        switch (action) {
            case 'ban': newStatus = 'banned'; break;
            case 'suspend': newStatus = 'suspended'; break;
            case 'restore': newStatus = 'active'; break;
            default: return apiError('Invalid action', 400);
        }

        await query(`UPDATE users SET status = $1 WHERE id = $2`, [newStatus, user_id]);

        // Log action — adminId is admin_users.id (not users.id)
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason)
       VALUES ($1, $2, 'user', $3, $4)`,
            [ctx.adminId, action, user_id, reason || `Admin ${action}`]
        );

        return apiSuccess({ user_id, status: newStatus });
    } catch (error) {
        logger.error('[Admin Users PATCH]', error);
        return apiError('Internal server error', 500);
    }
}
