import { logger } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/stats — real platform counts for admin dashboard
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const adminRecord = await getOne<{ is_active: boolean }>(
            `SELECT is_active FROM admin_users WHERE user_id = $1`,
            [user.id]
        );
        if (!adminRecord?.is_active) return apiError('Forbidden', 403);

        const [
            userStats,
            postStats,
            communityStats,
            reportStats,
            sessionStats,
            newUsersToday,
            recentActions,
        ] = await Promise.all([
            getOne<{ total: number; active: number; banned: number; admins: number }>(
                `SELECT
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE status = 'active') AS active,
           COUNT(*) FILTER (WHERE status = 'banned') AS banned,
           (SELECT COUNT(*) FROM admin_users WHERE is_active = true) AS admins
         FROM users WHERE deleted_at IS NULL`
            ),
            getOne<{ total: number; today: number }>(
                `SELECT
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS today
         FROM posts WHERE deleted_at IS NULL`
            ),
            getOne<{ total: number; active: number }>(
                `SELECT
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE is_active = true) AS active
         FROM communities WHERE deleted_at IS NULL`
            ),
            getOne<{ total: number; pending: number }>(
                `SELECT
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE status = 'pending') AS pending
         FROM content_reports`
            ).catch(() => ({ total: 0, pending: 0 })),
            getOne<{ active_sessions: number }>(
                `SELECT COUNT(*) AS active_sessions FROM sessions WHERE expires_at > NOW()`
            ),
            getOne<{ count: number }>(
                `SELECT COUNT(*) AS count FROM users WHERE created_at >= NOW() - INTERVAL '24 hours' AND deleted_at IS NULL`
            ),
            import('@/lib/db').then(({ query: q }) =>
                q<{ action_type: string; target_type: string; created_at: string; admin_username: string }>(
                    `SELECT aa.action_type, aa.target_type, aa.created_at, u.username AS admin_username
           FROM admin_actions aa
           JOIN users u ON u.id = aa.admin_id
           ORDER BY aa.created_at DESC
           LIMIT 10`
                ).then((r) => r.rows)
            ),
        ]);

        return apiSuccess({
            users: {
                total: Number(userStats?.total || 0),
                active: Number(userStats?.active || 0),
                banned: Number(userStats?.banned || 0),
                admins: Number(userStats?.admins || 0),
                new_today: Number(newUsersToday?.count || 0),
            },
            posts: {
                total: Number(postStats?.total || 0),
                today: Number(postStats?.today || 0),
            },
            communities: {
                total: Number(communityStats?.total || 0),
                active: Number(communityStats?.active || 0),
            },
            reports: {
                total: Number(reportStats?.total || 0),
                pending: Number(reportStats?.pending || 0),
            },
            sessions: {
                active: Number(sessionStats?.active_sessions || 0),
            },
            recent_actions: recentActions,
        });
    } catch (error) {
        logger.error('[Admin Stats Error]', error);
        return apiError('Internal server error', 500);
    }
}
