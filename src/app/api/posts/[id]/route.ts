import { NextRequest } from 'next/server';
import { getOne, query } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';
import { PostWithAuthor } from '@/types';

// GET /api/posts/[id] — get single post with author details
export const GET = withAuth(async (_req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const post = await getOne<PostWithAuthor>(
        `SELECT p.*,
       u.username AS author_username,
       pr.display_name AS author_display_name,
       pr.avatar_url AS author_avatar_url,
       CASE WHEN p.is_incognito AND p.author_id != $2 THEN NULL ELSE u.username END AS author_username,
       CASE WHEN p.is_incognito AND p.author_id != $2 THEN 'Anonymous' ELSE pr.display_name END AS author_display_name,
       CASE WHEN p.is_incognito AND p.author_id != $2 THEN NULL ELSE pr.avatar_url END AS author_avatar_url
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE p.id = $1
       AND p.deleted_at IS NULL
       AND p.status IN ('published', 'draft')`,
        [postId, user.id]
    );

    if (!post) {
        return apiError('Post not found', 404);
    }

    // Increment view count
    await query(`UPDATE posts SET view_count = view_count + 1 WHERE id = $1`, [postId]);

    // Get user's reactions on this post
    const userReactions = await getOne<{ reactions: string[] }>(
        `SELECT ARRAY_AGG(reaction) AS reactions FROM reactions WHERE post_id = $1 AND user_id = $2`,
        [postId, user.id]
    );

    // Get user's marks on this post
    const userMarks = await getOne<{ marks: string[] }>(
        `SELECT ARRAY_AGG(mark) AS marks FROM marks WHERE post_id = $1 AND user_id = $2`,
        [postId, user.id]
    );

    // Get bookmark status
    const bookmark = await getOne(
        `SELECT id, note FROM bookmarks WHERE post_id = $1 AND user_id = $2`,
        [postId, user.id]
    );

    return apiSuccess({
        ...post,
        user_reactions: userReactions?.reactions?.filter(Boolean) || [],
        user_marks: userMarks?.marks?.filter(Boolean) || [],
        is_bookmarked: !!bookmark,
        bookmark_note: bookmark ? (bookmark as { note: string }).note : null,
        is_own_post: post.author_id === user.id,
    });
});

// PUT /api/posts/[id] — edit a post
export const PUT = withAuth(async (req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const existing = await getOne<{ author_id: string; current_version: number }>(
        `SELECT author_id, current_version FROM posts WHERE id = $1 AND deleted_at IS NULL`,
        [postId]
    );

    if (!existing) return apiError('Post not found', 404);
    if (existing.author_id !== user.id) return apiError('Not authorized', 403);

    const body = await req.json();
    const newVersion = existing.current_version + 1;

    const updated = await getOne(
        `UPDATE posts SET
       title = COALESCE($2, title),
       body = COALESCE($3, body),
       visibility = COALESCE($4, visibility),
       content_warning = COALESCE($5, content_warning),
       content_warning_text = COALESCE($6, content_warning_text),
       current_version = $7,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
        [postId, body.title, body.body, body.visibility, body.content_warning, body.content_warning_text, newVersion]
    );

    // Save version
    await query(
        `INSERT INTO post_versions (post_id, version_number, title, body, edited_by)
     VALUES ($1, $2, $3, $4, $5)`,
        [postId, newVersion, body.title, body.body, user.id]
    );

    return apiSuccess(updated);
});

// DELETE /api/posts/[id] — soft-delete a post
export const DELETE = withAuth(async (_req, { user, params }) => {
    const postId = params?.id;
    if (!postId) return apiError('Post ID required');

    const existing = await getOne<{ author_id: string }>(
        `SELECT author_id FROM posts WHERE id = $1 AND deleted_at IS NULL`,
        [postId]
    );

    if (!existing) return apiError('Post not found', 404);
    if (existing.author_id !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
        return apiError('Not authorized', 403);
    }

    await query(
        `UPDATE posts SET deleted_at = NOW(), status = 'soft_deleted' WHERE id = $1`,
        [postId]
    );

    return apiSuccess({ message: 'Post deleted' });
});
