import { NextRequest } from 'next/server';
import { getOne, getMany, query } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/communities/[handle] — community detail
export const GET = withAuth(async (_req, { user, params }) => {
    const handle = params?.handle;
    if (!handle) return apiError('Handle required');

    const community = await getOne(
        `SELECT c.*,
       EXISTS(SELECT 1 FROM community_members WHERE community_id = c.id AND user_id = $2) AS is_member,
       (SELECT role FROM community_members WHERE community_id = c.id AND user_id = $2) AS user_role,
       (SELECT username FROM users WHERE id = c.owner_id) AS owner_username
     FROM communities c
     WHERE c.handle = $1 AND c.status = 'active' AND c.deleted_at IS NULL`,
        [handle.toLowerCase(), user.id]
    );

    if (!community) return apiError('Community not found', 404);

    // Get rules
    const rules = await getMany(
        `SELECT * FROM community_rules WHERE community_id = $1 ORDER BY sort_order`,
        [(community as { id: string }).id]
    );

    // Get recent members
    const members = await getMany(
        `SELECT cm.role, cm.joined_at, u.username, pr.display_name, pr.avatar_url
     FROM community_members cm
     JOIN users u ON u.id = cm.user_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE cm.community_id = $1
     ORDER BY cm.joined_at DESC LIMIT 10`,
        [(community as { id: string }).id]
    );

    return apiSuccess({ ...community, rules, recent_members: members });
});

// PUT /api/communities/[handle] — edit community settings
export const PUT = withAuth(async (req, { user, params }) => {
    const handle = params?.handle;
    if (!handle) return apiError('Handle required');

    // Check authorization (must be owner or admin)
    const community = await getOne<{ id: string; owner_id: string }>(
        `SELECT id, owner_id FROM communities WHERE handle = $1 AND deleted_at IS NULL`,
        [handle.toLowerCase()]
    );

    if (!community) return apiError('Community not found', 404);

    const member = await getOne<{ role: string }>(
        `SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2`,
        [community.id, user.id]
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
        return apiError('Not authorized', 403);
    }

    const body = await req.json();
    const updated = await getOne(
        `UPDATE communities SET
       name = COALESCE($2, name),
       description = COALESCE($3, description),
       visibility = COALESCE($4, visibility),
       join_type = COALESCE($5, join_type),
       category = COALESCE($6, category),
       post_approval_required = COALESCE($7, post_approval_required),
       updated_at = NOW()
     WHERE id = $1 RETURNING *`,
        [community.id, body.name, body.description, body.visibility, body.join_type, body.category, body.post_approval_required]
    );

    return apiSuccess(updated);
});
