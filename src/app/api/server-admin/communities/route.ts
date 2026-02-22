import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/communities?page=1&search=
export async function GET(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const limit = 20;
        const offset = (page - 1) * limit;

        const params: (string | number)[] = [];
        let where = `WHERE c.deleted_at IS NULL`;
        if (search) {
            params.push(`%${search}%`);
            where += ` AND (c.name ILIKE $1 OR c.handle ILIKE $1)`;
        }
        params.push(limit, offset);

        const [communities, countRow] = await Promise.all([
            query<{
                id: string; name: string; handle: string; description: string | null;
                is_active: boolean; is_featured: boolean; member_count: number;
                post_count: number; created_at: string; creator_username: string;
            }>(
                `SELECT
           c.id, c.name, c.handle, c.description, c.is_active, c.is_featured,
           (SELECT COUNT(*) FROM community_members WHERE community_id = c.id AND status = 'active')::int AS member_count,
           (SELECT COUNT(*) FROM posts WHERE community_id = c.id AND deleted_at IS NULL)::int AS post_count,
           c.created_at,
           u.username AS creator_username
         FROM communities c
         LEFT JOIN users u ON u.id = c.owner_id
         ${where}
         ORDER BY member_count DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
                params
            ),
            getOne<{ count: number }>(
                `SELECT COUNT(*) AS count FROM communities c ${where}`,
                params.slice(0, -2)
            ),
        ]);

        return apiSuccess({
            communities: communities.rows,
            total: Number(countRow?.count || 0),
            page,
            pages: Math.ceil(Number(countRow?.count || 0) / limit),
        });
    } catch (error) {
        console.error('[Admin Communities GET]', error);
        return apiError('Internal server error', 500);
    }
}

// PATCH /api/server-admin/communities — feature, deactivate a community
export async function PATCH(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { community_id, action, reason } = await req.json();
        if (!community_id || !action) return apiError('community_id and action required', 400);

        switch (action) {
            case 'feature':
                await query(`UPDATE communities SET is_featured = true WHERE id = $1`, [community_id]);
                break;
            case 'unfeature':
                await query(`UPDATE communities SET is_featured = false WHERE id = $1`, [community_id]);
                break;
            case 'deactivate':
                await query(`UPDATE communities SET is_active = false WHERE id = $1`, [community_id]);
                break;
            case 'activate':
                await query(`UPDATE communities SET is_active = true WHERE id = $1`, [community_id]);
                break;
            case 'delete':
                await query(`UPDATE communities SET deleted_at = NOW() WHERE id = $1`, [community_id]);
                break;
            default:
                return apiError('Invalid action', 400);
        }

        // Log action — adminId is admin_users.id (not users.id)
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason)
       VALUES ($1, $2, 'community', $3, $4)`,
            [ctx.adminId, action, community_id, reason || `Community ${action}`]
        );

        return apiSuccess({ community_id, action });
    } catch (error) {
        console.error('[Admin Communities PATCH]', error);
        return apiError('Internal server error', 500);
    }
}
