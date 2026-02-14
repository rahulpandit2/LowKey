import { NextRequest } from 'next/server';
import { query, getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/messages — list message threads
export const GET = withAuth(async (req, { user }) => {
    const threads = await getMany(
        `SELECT mt.*,
       m.body AS last_message,
       m.created_at AS last_message_at,
       other_p.user_id AS other_user_id,
       other_u.username AS other_user_username,
       other_pr.display_name AS other_user_display_name,
       other_pr.avatar_url AS other_user_avatar_url,
       (SELECT COUNT(*) FROM messages msg
        WHERE msg.thread_id = mt.id
          AND msg.sender_id != $1
          AND msg.is_read = FALSE
          AND msg.deleted_at IS NULL) AS unread_count
     FROM message_threads mt
     JOIN message_thread_participants my_p ON my_p.thread_id = mt.id AND my_p.user_id = $1
     JOIN message_thread_participants other_p ON other_p.thread_id = mt.id AND other_p.user_id != $1
     JOIN users other_u ON other_u.id = other_p.user_id
     LEFT JOIN profiles other_pr ON other_pr.user_id = other_u.id
     LEFT JOIN LATERAL (
       SELECT body, created_at FROM messages
       WHERE thread_id = mt.id AND deleted_at IS NULL
       ORDER BY created_at DESC LIMIT 1
     ) m ON TRUE
     WHERE mt.status = 'active'
       AND my_p.is_archived = FALSE
     ORDER BY COALESCE(m.created_at, mt.created_at) DESC`,
        [user.id]
    );

    return apiSuccess(threads);
});

// POST /api/messages — create new thread & send first message
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();
    const { recipient_username, message } = body;

    if (!recipient_username || !message) {
        return apiError('Recipient and message are required');
    }

    // Find recipient
    const recipient = await getOne<{ id: string }>(
        `SELECT id FROM users WHERE username = $1 AND status = 'active' AND deleted_at IS NULL`,
        [recipient_username.toLowerCase()]
    );

    if (!recipient) return apiError('User not found', 404);
    if (recipient.id === user.id) return apiError('Cannot message yourself');

    // Check blocks
    const blocked = await getOne(
        `SELECT id FROM user_blocks
     WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)`,
        [user.id, recipient.id]
    );
    if (blocked) return apiError('Cannot message this user', 403);

    // Check if thread already exists
    const existingThread = await getOne<{ id: string }>(
        `SELECT mt.id FROM message_threads mt
     JOIN message_thread_participants p1 ON p1.thread_id = mt.id AND p1.user_id = $1
     JOIN message_thread_participants p2 ON p2.thread_id = mt.id AND p2.user_id = $2
     WHERE mt.status = 'active'`,
        [user.id, recipient.id]
    );

    let threadId: string;

    if (existingThread) {
        threadId = existingThread.id;
    } else {
        // Create new thread
        const thread = await getOne<{ id: string }>(
            `INSERT INTO message_threads DEFAULT VALUES RETURNING id`
        );
        threadId = thread!.id;

        // Add participants
        await query(
            `INSERT INTO message_thread_participants (thread_id, user_id) VALUES ($1, $2), ($1, $3)`,
            [threadId, user.id, recipient.id]
        );
    }

    // Send message
    const msg = await getOne(
        `INSERT INTO messages (thread_id, sender_id, body) VALUES ($1, $2, $3) RETURNING *`,
        [threadId, user.id, message]
    );

    // Update thread timestamp
    await query(`UPDATE message_threads SET updated_at = NOW() WHERE id = $1`, [threadId]);

    return apiSuccess({ thread_id: threadId, message: msg }, 201);
});
