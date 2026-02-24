import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { query } from '@/lib/db';

// POST /api/admin/messages — send system message to a user
async function postHandler(req: NextRequest, { user }: { user: { id: string } }) {
    try {
        const body = await parseBody<{
            recipient_id: string;
            body: string;
        }>(req);

        if (!body?.recipient_id || !body?.body) {
            return apiError('recipient_id and body are required', 400);
        }

        // Find or create a thread between admin and user
        const threadResult = await query(
            `INSERT INTO message_threads (participant_1, participant_2)
             VALUES (LEAST($1::UUID, $2::UUID), GREATEST($1::UUID, $2::UUID))
             ON CONFLICT (participant_1, participant_2) DO UPDATE SET updated_at = NOW()
             RETURNING id`,
            [user.id, body.recipient_id]
        );
        const threadId = threadResult.rows[0]?.id;

        if (!threadId) {
            return apiError('Failed to create message thread', 500);
        }

        // Insert the message
        await query(
            `INSERT INTO messages (thread_id, sender_id, body)
             VALUES ($1, $2, $3)`,
            [threadId, user.id, body.body]
        );

        // Update thread timestamp
        await query(
            `UPDATE message_threads SET updated_at = NOW(), last_message_at = NOW() WHERE id = $1`,
            [threadId]
        );

        return apiSuccess({ sent: true, thread_id: threadId }, 201);
    } catch (error) {
        logger.error('[Admin Message Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const POST = withAdmin(postHandler);
