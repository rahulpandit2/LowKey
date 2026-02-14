import { NextRequest } from 'next/server';
import { getOne, query } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// POST /api/communities/[handle]/join — join or request to join
export const POST = withAuth(async (_req, { user, params }) => {
    const handle = params?.handle;
    if (!handle) return apiError('Handle required');

    const community = await getOne<{ id: string; join_type: string }>(
        `SELECT id, join_type FROM communities WHERE handle = $1 AND status = 'active' AND deleted_at IS NULL`,
        [handle.toLowerCase()]
    );

    if (!community) return apiError('Community not found', 404);

    // Check if already a member
    const existing = await getOne(
        `SELECT id FROM community_members WHERE community_id = $1 AND user_id = $2`,
        [community.id, user.id]
    );
    if (existing) return apiError('Already a member', 409);

    if (community.join_type === 'open') {
        // Direct join
        await query(
            `INSERT INTO community_members (community_id, user_id) VALUES ($1, $2)`,
            [community.id, user.id]
        );
        await query(`UPDATE communities SET member_count = member_count + 1 WHERE id = $1`, [community.id]);
        return apiSuccess({ message: 'Joined community' }, 201);
    } else if (community.join_type === 'approval') {
        // Create join request
        await query(
            `INSERT INTO community_join_requests (community_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (community_id, user_id) DO NOTHING`,
            [community.id, user.id]
        );
        return apiSuccess({ message: 'Join request submitted' }, 201);
    } else {
        return apiError('This community is invite-only', 403);
    }
});

// DELETE /api/communities/[handle]/join — leave community
export const DELETE = withAuth(async (_req, { user, params }) => {
    const handle = params?.handle;
    if (!handle) return apiError('Handle required');

    const community = await getOne<{ id: string }>(
        `SELECT id FROM communities WHERE handle = $1`,
        [handle.toLowerCase()]
    );
    if (!community) return apiError('Community not found', 404);

    const member = await getOne<{ role: string }>(
        `SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2`,
        [community.id, user.id]
    );
    if (!member) return apiError('Not a member', 404);
    if (member.role === 'owner') return apiError('Owners cannot leave. Transfer ownership first.', 400);

    await query(`DELETE FROM community_members WHERE community_id = $1 AND user_id = $2`, [community.id, user.id]);
    await query(`UPDATE communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = $1`, [community.id]);

    return apiSuccess({ message: 'Left community' });
});
