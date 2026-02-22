import { NextRequest } from 'next/server';
import { getMany, getOne, query } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/communities — list communities
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;
    const filter = searchParams.get('filter') || 'all'; // 'all', 'mine', 'joined'

    let whereClause = '';
    const params: unknown[] = [user.id, limit, offset];

    switch (filter) {
        case 'mine':
            whereClause = `AND c.owner_id = $1`;
            break;
        case 'joined':
            whereClause = `AND c.id IN (SELECT community_id FROM community_members WHERE user_id = $1)`;
            break;
    }

    if (search) {
        params.push(`%${search}%`);
        whereClause += ` AND (c.name ILIKE $${params.length} OR c.handle ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
    }

    const communities = await getMany(
        `SELECT c.*,
       EXISTS(SELECT 1 FROM community_members WHERE community_id = c.id AND user_id = $1) AS is_member,
       (SELECT role FROM community_members WHERE community_id = c.id AND user_id = $1) AS role
     FROM communities c
     WHERE c.status = 'active' AND c.deleted_at IS NULL
       ${whereClause}
     ORDER BY c.member_count DESC
     LIMIT $2 OFFSET $3`,
        params
    );

    return apiSuccess({ communities });
});

// POST /api/communities — create a community
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();
    const { handle, name, description, visibility, join_type, category } = body;

    if (!handle || !name) return apiError('Handle and name are required');
    if (handle.length < 3 || handle.length > 100) return apiError('Handle must be 3-100 characters');

    // Check uniqueness
    const existing = await getOne(`SELECT id FROM communities WHERE handle = $1`, [handle.toLowerCase()]);
    if (existing) return apiError('Handle already taken', 409);

    const community = await getOne(
        `INSERT INTO communities (handle, name, description, owner_id, visibility, join_type, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [handle.toLowerCase(), name, description || null, user.id, visibility || 'public', join_type || 'open', category || null]
    );

    // Add creator as owner
    if (community) {
        await query(
            `INSERT INTO community_members (community_id, user_id, role, is_trusted) VALUES ($1, $2, 'owner', TRUE)`,
            [(community as { id: string }).id, user.id]
        );
    }

    return apiSuccess(community, 201);
});
