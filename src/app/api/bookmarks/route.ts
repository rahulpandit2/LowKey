import { getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess } from '@/lib/middleware';

// GET /api/bookmarks — list user's bookmarks
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    const bookmarks = await getMany(
        `SELECT b.*, p.title, p.body, p.post_type, p.is_incognito,
       p.reaction_count, p.feedback_count, p.created_at AS post_created_at,
       CASE WHEN p.is_incognito THEN 'Anonymous' ELSE pr.display_name END AS author_display_name,
       CASE WHEN p.is_incognito THEN 'anonymous' ELSE u.username END AS author_username
     FROM bookmarks b
     JOIN posts p ON p.id = b.post_id AND p.deleted_at IS NULL
     JOIN users u ON u.id = p.author_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
        [user.id, limit, offset]
    );

    const total = await getOne<{ count: string }>(
        `SELECT COUNT(*) FROM bookmarks b
     JOIN posts p ON p.id = b.post_id AND p.deleted_at IS NULL
     WHERE b.user_id = $1`,
        [user.id]
    );

    return apiSuccess({
        bookmarks,
        pagination: {
            page,
            limit,
            total: parseInt(total?.count || '0'),
        },
    });
});
