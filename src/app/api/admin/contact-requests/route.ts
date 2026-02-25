import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { getMany, query, getOne } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/contact-requests
 * Returns paginated contact form submissions with optional status filter.
 * Query params: limit, offset, status (new|replied|spam|closed)
 */
async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
        const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
        const status = searchParams.get('status') || null;

        // Build parameterized query safely
        const values: unknown[] = [limit, offset];
        let whereClause = '';
        if (status) {
            values.unshift(status);
            whereClause = `WHERE cs.status = $1`;
        }
        // Shift limit/offset params after optional status param
        const limitParam = status ? '$2' : '$1';
        const offsetParam = status ? '$3' : '$2';

        const submissions = await getMany(
            `SELECT cs.id, cs.first_name, cs.last_name, cs.email,
                    cs.reason, cs.message, cs.consent_emails,
                    cs.ip_address, cs.status, cs.created_at,
                    cs.actioned_by, cs.actioned_at, cs.action_note
             FROM contact_submissions cs
             ${whereClause}
             ORDER BY cs.created_at DESC
             LIMIT ${limitParam} OFFSET ${offsetParam}`,
            values
        );

        const countValues: unknown[] = [];
        let countWhere = '';
        if (status) {
            countValues.push(status);
            countWhere = `WHERE status = $1`;
        }
        const total = await getOne<{ count: string }>(
            `SELECT COUNT(*) as count FROM contact_submissions ${countWhere}`,
            countValues
        );

        return apiSuccess({
            submissions,
            total: parseInt(total?.count || '0', 10),
            limit,
            offset,
        });
    } catch (error) {
        logger.error('[Contact Requests GET]', error);
        return apiError('Internal server error', 500);
    }
}

/**
 * PATCH /api/admin/contact-requests
 * Update status of a contact submission.
 * Body: { id, status, action_note? }
 * Valid statuses: new, replied, spam, closed
 */
async function patchHandler(req: NextRequest, { user }: { user: { id: string } }) {
    try {
        const body = await parseBody<{ id: string; status: string; action_note?: string }>(req);
        if (!body?.id || !body?.status) {
            return apiError('id and status are required', 400);
        }

        const validStatuses = ['new', 'replied', 'spam', 'closed'];
        if (!validStatuses.includes(body.status)) {
            return apiError(`status must be one of: ${validStatuses.join(', ')}`, 400);
        }

        const result = await query(
            `UPDATE contact_submissions
             SET status = $1, actioned_by = $2, actioned_at = NOW(), action_note = $3
             WHERE id = $4
             RETURNING id, status`,
            [body.status, user.id, body.action_note || null, body.id]
        );

        if (result.rows.length === 0) {
            return apiError('Contact submission not found', 404);
        }

        return apiSuccess(result.rows[0]);
    } catch (error) {
        logger.error('[Contact Requests PATCH]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAdmin(getHandler);
export const PATCH = withAdmin(patchHandler);
