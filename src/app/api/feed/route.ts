import { NextRequest } from 'next/server';
import { getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess } from '@/lib/middleware';
import { PostWithAuthor } from '@/types';

// GET /api/feed — paginated feed with filters
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: unknown[] = [user.id, limit, offset];

    switch (filter) {
        case 'following':
            whereClause = `AND p.author_id IN (SELECT following_id FROM follows WHERE follower_id = $1)`;
            break;
        case 'communities':
            whereClause = `AND p.community_id IN (SELECT community_id FROM community_members WHERE user_id = $1)`;
            break;
        case 'help':
            whereClause = `AND (p.post_type = 'help' OR p.is_incognito = TRUE)`;
            break;
        case 'popular':
            whereClause = `AND p.reaction_count + p.feedback_count > 0`;
            break;
        default:
            // 'all' — show posts from following + communities + popular + public
            whereClause = `AND (
        p.author_id IN (SELECT following_id FROM follows WHERE follower_id = $1)
        OR p.community_id IN (SELECT community_id FROM community_members WHERE user_id = $1)
        OR p.visibility = 'public'
      )`;
            break;
    }

    const posts = await getMany<PostWithAuthor>(
        `SELECT p.*,
       CASE WHEN p.is_incognito AND p.author_id != $1 THEN 'anonymous' ELSE u.username END AS author_username,
       CASE WHEN p.is_incognito AND p.author_id != $1 THEN 'Anonymous' ELSE pr.display_name END AS author_display_name,
       CASE WHEN p.is_incognito AND p.author_id != $1 THEN NULL ELSE pr.avatar_url END AS author_avatar_url
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE p.status = 'published'
       AND p.deleted_at IS NULL
       AND u.deleted_at IS NULL
       AND p.author_id NOT IN (SELECT blocked_id FROM user_blocks WHERE blocker_id = $1)
       AND p.author_id NOT IN (SELECT blocker_id FROM user_blocks WHERE blocked_id = $1)
       ${whereClause}
     ORDER BY ${filter === 'popular' ? 'p.reaction_count + p.feedback_count DESC,' : ''} p.published_at DESC
     LIMIT $2 OFFSET $3`,
        queryParams
    );

    const total = await getOne<{ count: string }>(
        `SELECT COUNT(*) FROM posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.status = 'published'
       AND p.deleted_at IS NULL
       AND u.deleted_at IS NULL
       AND p.author_id NOT IN (SELECT blocked_id FROM user_blocks WHERE blocker_id = $1)
       ${whereClause}`,
        [user.id]
    );

    return apiSuccess({
        posts,
        pagination: {
            page,
            limit,
            total: parseInt(total?.count || '0'),
            pages: Math.ceil(parseInt(total?.count || '0') / limit),
        },
    });
});
