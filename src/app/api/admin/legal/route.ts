import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { getMany, query, getOne } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/legal
 * Returns GDPR / data subject requests with optional status filter.
 * If the table does not exist yet, returns an empty list gracefully.
 */
async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
        const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
        const status = searchParams.get('status') || null;

        try {
            const values: unknown[] = [limit, offset];
            let whereClause = '';
            if (status) {
                values.unshift(status);
                whereClause = `WHERE dr.status = $1`;
            }
            const limitParam = status ? '$2' : '$1';
            const offsetParam = status ? '$3' : '$2';

            const requests = await getMany(
                `SELECT dr.id, dr.user_id, dr.request_type, dr.status, dr.notes,
                        dr.created_at, dr.updated_at,
                        u.username, u.email
                 FROM data_requests dr
                 JOIN users u ON u.id = dr.user_id
                 ${whereClause}
                 ORDER BY dr.created_at DESC
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
                `SELECT COUNT(*) as count FROM data_requests ${countWhere}`,
                countValues
            );

            return apiSuccess({ requests, total: parseInt(total?.count || '0', 10) });
        } catch {
            // Table doesn't exist yet
            return apiSuccess({ requests: [], total: 0 });
        }
    } catch (error) {
        logger.error('[Legal GET]', error);
        return apiError('Internal server error', 500);
    }
}

/**
 * PATCH /api/admin/legal
 * Update status of a data subject request.
 * Body: { id, status, notes? }
 */
async function patchHandler(req: NextRequest, { user }: { user: { id: string } }) {
    try {
        const body = await parseBody<{ id: string; status: string; notes?: string }>(req);
        if (!body?.id || !body?.status) {
            return apiError('id and status are required', 400);
        }

        const validStatuses = ['pending', 'processing', 'fulfilled', 'rejected'];
        if (!validStatuses.includes(body.status)) {
            return apiError(`status must be one of: ${validStatuses.join(', ')}`, 400);
        }

        const result = await query(
            `UPDATE data_requests
             SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
             WHERE id = $3
             RETURNING id, status`,
            [body.status, body.notes || null, body.id]
        );

        if (result.rows.length === 0) {
            return apiError('Request not found', 404);
        }

        // Log the action
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason)
             SELECT au.id, 'update', 'data_request', $1, $2
             FROM admin_users au WHERE au.user_id = $3`,
            [body.id, `Status changed to ${body.status}`, user.id]
        ).catch(() => { /* non-critical */ });

        return apiSuccess(result.rows[0]);
    } catch (error) {
        logger.error('[Legal PATCH]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAdmin(getHandler);
export const PATCH = withAdmin(patchHandler);
