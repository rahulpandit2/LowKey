import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOne, getMany } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/middleware';
import { logger } from '@/lib/logger';

/**
 * GET /api/communities/[handle]/admin
 * Returns community stats, members, and posts for owners and admins.
 */
export async function GET(
    req: NextRequest,
    segmentData: { params: Promise<{ handle: string }> }
) {
    try {
        const { handle } = await segmentData.params;
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check community exists and user has admin/owner role
        const community = await getOne<{
            id: string; name: string; handle: string; description: string;
            member_count: number; post_count: number; is_active: boolean; created_at: string;
        }>(
            `SELECT c.id, c.name, c.handle, c.description, c.is_active, c.created_at,
                    (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.id) AS member_count,
                    (SELECT COUNT(*) FROM posts p WHERE p.community_id = c.id AND p.deleted_at IS NULL) AS post_count
             FROM communities c
             WHERE c.handle = $1 AND c.deleted_at IS NULL`,
            [handle]
        );

        if (!community) {
            return apiError('Community not found', 404);
        }

        // Verify caller has admin/owner role in this community
        const membership = await getOne<{ role: string }>(
            `SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2`,
            [community.id, user.id]
        );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return apiError('Forbidden', 403);
        }

        // Fetch members
        const members = await getMany(
            `SELECT u.id, u.username, pr.display_name, cm.role, cm.joined_at
             FROM community_members cm
             JOIN users u ON u.id = cm.user_id
             LEFT JOIN profiles pr ON pr.user_id = u.id
             WHERE cm.community_id = $1
             ORDER BY cm.role DESC, cm.joined_at ASC
             LIMIT 50`,
            [community.id]
        );

        // Fetch posts
        const posts = await getMany(
            `SELECT p.id, p.title, p.body, p.status, p.reaction_count, p.created_at,
                    u.username AS author_username
             FROM posts p
             JOIN users u ON u.id = p.author_id
             WHERE p.community_id = $1 AND p.deleted_at IS NULL
             ORDER BY p.created_at DESC
             LIMIT 50`,
            [community.id]
        );

        return apiSuccess({ community, members, posts });
    } catch (error) {
        logger.error('[Community Admin GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
