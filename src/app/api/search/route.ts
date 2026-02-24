import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAuth } from '@/lib/middleware';
import { getMany } from '@/lib/db';

// GET /api/search?q=term&type=all|users|posts|communities
async function handler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q')?.trim() || '';
        const type = searchParams.get('type') || 'all';
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        if (!q || q.length < 2) {
            return apiSuccess({ users: [], posts: [], communities: [] });
        }

        const pattern = `%${q}%`;
        const results: { users?: unknown[]; posts?: unknown[]; communities?: unknown[] } = {};

        if (type === 'all' || type === 'users') {
            results.users = await getMany(
                `SELECT u.id, u.username, p.display_name, p.bio, p.avatar_url
                 FROM users u
                 LEFT JOIN profiles p ON p.user_id = u.id
                 WHERE u.deleted_at IS NULL AND u.status = 'active'
                   AND (u.username ILIKE $1 OR p.display_name ILIKE $1)
                 LIMIT $2`,
                [pattern, limit]
            );
        }

        if (type === 'all' || type === 'posts') {
            results.posts = await getMany(
                `SELECT p.id, p.body, p.post_type, p.like_count, p.created_at,
                        u.username, pr.display_name
                 FROM posts p
                 JOIN users u ON u.id = p.user_id
                 LEFT JOIN profiles pr ON pr.user_id = u.id
                 WHERE p.deleted_at IS NULL AND p.status = 'published'
                   AND p.body ILIKE $1
                 ORDER BY p.created_at DESC
                 LIMIT $2`,
                [pattern, limit]
            );
        }

        if (type === 'all' || type === 'communities') {
            results.communities = await getMany(
                `SELECT c.id, c.handle, c.name, c.description, c.member_count, c.avatar_url
                 FROM communities c
                 WHERE c.deleted_at IS NULL AND c.status = 'active'
                   AND (c.name ILIKE $1 OR c.handle ILIKE $1 OR c.description ILIKE $1)
                 LIMIT $2`,
                [pattern, limit]
            );
        }

        return apiSuccess(results);
    } catch (error) {
        logger.error('[Search Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAuth(handler);
