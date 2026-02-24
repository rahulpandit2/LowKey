import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { query, getOne } from '@/lib/db';

// PUT /api/admin/sub-admins/[id] — update admin role or status
async function putHandler(req: NextRequest, { user, params }: { user: { id: string; role: string }; params?: Record<string, string> }) {
    try {
        if (user.role !== 'super_admin') {
            return apiError('Only super admins can modify admin roles', 403);
        }
        const adminId = params?.id;
        if (!adminId) return apiError('Admin ID required', 400);

        const body = await parseBody<{ admin_role?: string; is_active?: boolean }>(req);
        if (!body) return apiError('Request body required', 400);

        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.admin_role) {
            updates.push(`admin_role = $${paramIndex++}`);
            values.push(body.admin_role);
        }
        if (body.is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(body.is_active);
        }

        if (updates.length === 0) return apiError('No fields to update', 400);

        updates.push(`updated_at = NOW()`);
        values.push(adminId);

        const result = await query(
            `UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) return apiError('Admin not found', 404);

        return apiSuccess(result.rows[0]);
    } catch (error) {
        logger.error('[Sub-Admin Update Error]', error);
        return apiError('Internal server error', 500);
    }
}

// DELETE /api/admin/sub-admins/[id] — deactivate admin
async function deleteHandler(req: NextRequest, { user, params }: { user: { id: string; role: string }; params?: Record<string, string> }) {
    try {
        if (user.role !== 'super_admin') {
            return apiError('Only super admins can remove admin privileges', 403);
        }
        const adminId = params?.id;
        if (!adminId) return apiError('Admin ID required', 400);

        // Get the admin record to find user_id
        const admin = await getOne<{ user_id: string }>(
            `SELECT user_id FROM admin_users WHERE id = $1`, [adminId]
        );
        if (!admin) return apiError('Admin not found', 404);

        // Deactivate
        await query(
            `UPDATE admin_users SET is_active = false, updated_at = NOW() WHERE id = $1`,
            [adminId]
        );

        // Reset user role
        await query(`UPDATE users SET role = 'user' WHERE id = $1`, [admin.user_id]);

        return apiSuccess({ message: 'Admin privileges removed' });
    } catch (error) {
        logger.error('[Sub-Admin Delete Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
