import { NextRequest } from 'next/server';
import { query, getMany, getOne } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/notifications — list notifications
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 50);
    const offset = (page - 1) * limit;

    let kindFilter = '';
    switch (filter) {
        case 'reactions':
            kindFilter = `AND kind = 'reaction'`;
            break;
        case 'feedback':
            kindFilter = `AND kind IN ('feedback', 'feedback_helpful')`;
            break;
        case 'mentions':
            kindFilter = `AND kind = 'mention'`;
            break;
        case 'system':
            kindFilter = `AND kind IN ('system', 'moderation', 'verification')`;
            break;
    }

    const notifications = await getMany(
        `SELECT * FROM notifications
     WHERE user_id = $1 ${kindFilter}
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
        [user.id, limit, offset]
    );

    const unreadCount = await getOne<{ count: string }>(
        `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
        [user.id]
    );

    return apiSuccess({
        notifications,
        unread_count: parseInt(unreadCount?.count || '0'),
    });
});

// PUT /api/notifications — mark as read (bulk or single)
export const PUT = withAuth(async (req, { user }) => {
    const body = await req.json();

    if (body.mark_all_read) {
        await query(
            `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
            [user.id]
        );
        return apiSuccess({ message: 'All notifications marked as read' });
    }

    if (body.notification_ids && Array.isArray(body.notification_ids)) {
        await query(
            `UPDATE notifications SET is_read = TRUE
       WHERE user_id = $1 AND id = ANY($2::uuid[])`,
            [user.id, body.notification_ids]
        );
        return apiSuccess({ message: 'Notifications marked as read' });
    }

    return apiError('Provide notification_ids or mark_all_read');
});
