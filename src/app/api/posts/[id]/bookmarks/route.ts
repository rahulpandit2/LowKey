import { NextRequest } from 'next/server';
import { query, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// POST /api/posts/[id]/bookmarks — bookmark a post
export const POST = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const post = await getOne(`SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL`, [postId]);
    if (!post) return apiError('Post not found', 404);

    const body = await req.json().catch(() => ({}));

    await query(
        `INSERT INTO bookmarks (post_id, user_id, note, tags)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (post_id, user_id) DO UPDATE SET
       note = COALESCE($3, bookmarks.note),
       tags = COALESCE($4, bookmarks.tags),
       updated_at = NOW()`,
        [postId, user.id, body.note || null, body.tags || []]
    );

    return apiSuccess({ message: 'Bookmarked' }, 201);
});

// DELETE /api/posts/[id]/bookmarks — remove bookmark
export const DELETE = withAuth(async (_req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    await query(`DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2`, [postId, user.id]);

    return apiSuccess({ message: 'Bookmark removed' });
});
