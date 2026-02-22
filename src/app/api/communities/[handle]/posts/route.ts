import { getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/communities/[handle]/posts — list posts in a community
export const GET = withAuth(async (req, { user, params }) => {
    const handle = params?.handle;
    if (!handle) return apiError('Handle required');

    const community = await getOne<{ id: string; visibility: string }>(
        `SELECT id, visibility FROM communities WHERE handle = $1 AND status = 'active' AND deleted_at IS NULL`,
        [handle.toLowerCase()]
    );

    if (!community) return apiError('Community not found', 404);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    const posts = await getMany(
        `SELECT p.id, p.title, p.body, p.post_type, p.is_incognito,
       p.reaction_count, p.feedback_count, p.created_at,
       u.username AS author_username,
       pr.display_name AS author_display_name,
       pr.avatar_url AS author_avatar_url
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE p.community_id = $1
       AND p.status = 'published'
       AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
        [community.id, limit, offset]
    );

    return apiSuccess({ posts });
});
