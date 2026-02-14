import { NextRequest } from 'next/server';
import { query, getOne, getMany } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';
import { Post, CreatePostInput } from '@/types';

// GET /api/posts — list own posts (for Post Manager)
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    const posts = await getMany<Post>(
        `SELECT p.*, 
       (SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id) AS reaction_count,
       (SELECT COUNT(*) FROM feedbacks f WHERE f.post_id = p.id AND f.deleted_at IS NULL) AS feedback_count
     FROM posts p
     WHERE p.author_id = $1
       AND p.deleted_at IS NULL
       AND ($2::text = 'all' OR p.status = $2::post_status)
     ORDER BY p.created_at DESC
     LIMIT $3 OFFSET $4`,
        [user.id, status, limit, offset]
    );

    const total = await getOne<{ count: string }>(
        `SELECT COUNT(*) FROM posts WHERE author_id = $1 AND deleted_at IS NULL AND ($2::text = 'all' OR status = $2::post_status)`,
        [user.id, status]
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

// POST /api/posts — create a new post
export const POST = withAuth(async (req, { user }) => {
    const body: CreatePostInput = await req.json();

    if (!body.body || body.body.trim().length === 0) {
        return apiError('Post body is required');
    }

    if (body.body.length > 5000) {
        return apiError('Post body must not exceed 5000 characters');
    }

    const validTypes = ['thought', 'problem', 'achievement', 'dilemma', 'help'];
    if (body.post_type && !validTypes.includes(body.post_type)) {
        return apiError('Invalid post type');
    }

    const status = body.scheduled_at ? 'scheduled' : 'published';
    const publishedAt = body.scheduled_at ? null : new Date().toISOString();

    const post = await getOne<Post>(
        `INSERT INTO posts (
       author_id, title, body, post_type, visibility, status,
       is_incognito, community_id, content_warning, content_warning_text,
       location, scheduled_at, published_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
        [
            user.id,
            body.title || null,
            body.body.trim(),
            body.post_type || 'thought',
            body.visibility || 'public',
            status,
            body.is_incognito || false,
            body.community_id || null,
            body.content_warning || false,
            body.content_warning_text || null,
            body.location || null,
            body.scheduled_at || null,
            publishedAt,
        ]
    );

    // Create initial version
    if (post) {
        await query(
            `INSERT INTO post_versions (post_id, version_number, title, body, edited_by)
       VALUES ($1, 1, $2, $3, $4)`,
            [post.id, post.title, post.body, user.id]
        );
    }

    return apiSuccess(post, 201);
});
