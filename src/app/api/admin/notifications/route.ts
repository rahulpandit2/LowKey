import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { query, getMany } from '@/lib/db';

// POST /api/admin/notifications — send system notification
async function postHandler(req: NextRequest, { user }: { user: { id: string } }) {
    try {
        const body = await parseBody<{
            user_id?: string;
            broadcast?: boolean;
            type: string;
            message: string;
            link?: string;
        }>(req);

        if (!body?.message || !body?.type) {
            return apiError('type and message are required', 400);
        }

        if (body.broadcast) {
            // Send to all users
            const users = await getMany<{ id: string }>(
                `SELECT id FROM users WHERE deleted_at IS NULL`, []
            );
            for (const u of users) {
                await query(
                    `INSERT INTO notifications (user_id, type, message, link, sender_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [u.id, body.type, body.message, body.link || null, user.id]
                );
            }
            return apiSuccess({ sent: users.length, broadcast: true }, 201);
        } else if (body.user_id) {
            // Send to specific user
            await query(
                `INSERT INTO notifications (user_id, type, message, link, sender_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [body.user_id, body.type, body.message, body.link || null, user.id]
            );
            return apiSuccess({ sent: 1, user_id: body.user_id }, 201);
        } else {
            return apiError('Either user_id or broadcast=true is required', 400);
        }
    } catch (error) {
        logger.error('[Admin Notification Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const POST = withAdmin(postHandler);
