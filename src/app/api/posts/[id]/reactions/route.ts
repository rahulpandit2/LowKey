import { NextRequest } from 'next/server';
import { query, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

const VALID_REACTIONS = [
    'me_too', 'interesting', 'unique', 'loved_it', 'challenged_me',
    'made_me_question', 'relatable_struggle', 'motivated_me',
];

// POST /api/posts/[id]/reactions — add a reaction
export const POST = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const body = await req.json();
    if (!body.reaction || !VALID_REACTIONS.includes(body.reaction)) {
        return apiError('Invalid reaction type');
    }

    // Check post exists
    const post = await getOne(`SELECT id FROM posts WHERE id = $1 AND deleted_at IS NULL`, [postId]);
    if (!post) return apiError('Post not found', 404);

    // Upsert reaction
    await query(
        `INSERT INTO reactions (post_id, user_id, reaction)
     VALUES ($1, $2, $3)
     ON CONFLICT (post_id, user_id, reaction) DO NOTHING`,
        [postId, user.id, body.reaction]
    );

    // Update count
    await query(
        `UPDATE posts SET reaction_count = (SELECT COUNT(*) FROM reactions WHERE post_id = $1) WHERE id = $1`,
        [postId]
    );

    return apiSuccess({ message: 'Reaction added' }, 201);
});

// DELETE /api/posts/[id]/reactions — remove a reaction
export const DELETE = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const { searchParams } = new URL(req.url);
    const reaction = searchParams.get('reaction');
    if (!reaction) return apiError('Reaction type required');

    await query(
        `DELETE FROM reactions WHERE post_id = $1 AND user_id = $2 AND reaction = $3`,
        [postId, user.id, reaction]
    );

    await query(
        `UPDATE posts SET reaction_count = (SELECT COUNT(*) FROM reactions WHERE post_id = $1) WHERE id = $1`,
        [postId]
    );

    return apiSuccess({ message: 'Reaction removed' });
});
