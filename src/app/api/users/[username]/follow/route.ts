import { NextRequest } from 'next/server';
import { query, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// POST /api/users/[username]/follow — follow user
export const POST = withAuth(async (_req, { user, params }) => {
    const username = params?.username;
    if (!username) return apiError('Username required');

    const target = await getOne<{ id: string }>(
        `SELECT id FROM users WHERE username = $1 AND status = 'active' AND deleted_at IS NULL`,
        [username.toLowerCase()]
    );

    if (!target) return apiError('User not found', 404);
    if (target.id === user.id) return apiError('Cannot follow yourself');

    // Check block
    const blocked = await getOne(
        `SELECT id FROM user_blocks
     WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)`,
        [user.id, target.id]
    );
    if (blocked) return apiError('Cannot follow this user', 403);

    await query(
        `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT (follower_id, following_id) DO NOTHING`,
        [user.id, target.id]
    );

    return apiSuccess({ message: 'Followed' }, 201);
});

// DELETE /api/users/[username]/follow — unfollow user
export const DELETE = withAuth(async (_req, { user, params }) => {
    const username = params?.username;
    if (!username) return apiError('Username required');

    const target = await getOne<{ id: string }>(
        `SELECT id FROM users WHERE username = $1`,
        [username.toLowerCase()]
    );
    if (!target) return apiError('User not found', 404);

    await query(
        `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
        [user.id, target.id]
    );

    return apiSuccess({ message: 'Unfollowed' });
});
