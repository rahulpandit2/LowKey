import { NextRequest } from 'next/server';
import { query, getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/messages/[threadId] — get messages in thread
export const GET = withAuth(async (req, { user, params }) => {
    const threadId = params?.threadId;
    if (!threadId) return apiError('Thread ID required');

    // Verify user is a participant
    const participant = await getOne(
        `SELECT id FROM message_thread_participants WHERE thread_id = $1 AND user_id = $2`,
        [threadId, user.id]
    );
    if (!participant) return apiError('Not authorized', 403);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const messages = await getMany(
        `SELECT m.*, u.username AS sender_username,
       pr.display_name AS sender_display_name,
       pr.avatar_url AS sender_avatar_url
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     LEFT JOIN profiles pr ON pr.user_id = u.id
     WHERE m.thread_id = $1 AND m.deleted_at IS NULL
     ORDER BY m.created_at ASC
     LIMIT $2 OFFSET $3`,
        [threadId, limit, offset]
    );

    // Mark messages as read
    await query(
        `UPDATE messages SET is_read = TRUE
     WHERE thread_id = $1 AND sender_id != $2 AND is_read = FALSE`,
        [threadId, user.id]
    );

    // Update last_read_at
    await query(
        `UPDATE message_thread_participants SET last_read_at = NOW()
     WHERE thread_id = $1 AND user_id = $2`,
        [threadId, user.id]
    );

    return apiSuccess(messages);
});

// POST /api/messages/[threadId] — send message to existing thread
export const POST = withAuth(async (req, { user, params }) => {
    const threadId = params?.threadId;
    if (!threadId) return apiError('Thread ID required');

    // Verify user is participant
    const participant = await getOne(
        `SELECT id FROM message_thread_participants WHERE thread_id = $1 AND user_id = $2`,
        [threadId, user.id]
    );
    if (!participant) return apiError('Not authorized', 403);

    const body = await req.json();
    if (!body.message || !body.message.trim()) {
        return apiError('Message is required');
    }

    const msg = await getOne(
        `INSERT INTO messages (thread_id, sender_id, body, attachment_url, attachment_type)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [threadId, user.id, body.message.trim(), body.attachment_url || null, body.attachment_type || null]
    );

    await query(`UPDATE message_threads SET updated_at = NOW() WHERE id = $1`, [threadId]);

    return apiSuccess(msg, 201);
});
