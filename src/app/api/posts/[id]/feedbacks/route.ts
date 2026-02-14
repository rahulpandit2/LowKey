import { NextRequest } from 'next/server';
import { query, getOne, getMany } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';
import { Feedback } from '@/types';

// GET /api/posts/[id]/feedbacks — list feedbacks on post
export const GET = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const feedbacks = await getMany<Feedback & { author_username: string; author_display_name: string }>(
        `SELECT f.*,
       CASE WHEN f.is_anonymous THEN 'anonymous' ELSE u.username END AS author_username,
       CASE WHEN f.is_anonymous THEN 'Anonymous' ELSE pr.display_name END AS author_display_name
     FROM feedbacks f
     JOIN users u ON u.id = f.author_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE f.post_id = $1 AND f.deleted_at IS NULL
     ORDER BY f.is_helpful DESC, f.agree_count DESC, f.created_at DESC`,
        [postId]
    );

    return apiSuccess(feedbacks);
});

// POST /api/posts/[id]/feedbacks — create feedback
export const POST = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const post = await getOne(`SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL`, [postId]);
    if (!post) return apiError('Post not found', 404);

    const body = await req.json();
    const validTypes = ['empathic', 'constructive', 'integrate_source'];
    if (!body.feedback_type || !validTypes.includes(body.feedback_type)) {
        return apiError('Invalid feedback type');
    }

    const feedback = await getOne<Feedback>(
        `INSERT INTO feedbacks (
       post_id, author_id, feedback_type, body,
       whats_not_working, whats_working, what_can_be_done,
       source_url, source_note, is_anonymous
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
        [
            postId, user.id, body.feedback_type,
            body.body || null,
            body.whats_not_working || null,
            body.whats_working || null,
            body.what_can_be_done || null,
            body.source_url || null,
            body.source_note || null,
            body.is_anonymous || false,
        ]
    );

    // Update count
    await query(
        `UPDATE posts SET feedback_count = (SELECT COUNT(*) FROM feedbacks WHERE post_id = $1 AND deleted_at IS NULL) WHERE id = $1`,
        [postId]
    );

    return apiSuccess(feedback, 201);
});
