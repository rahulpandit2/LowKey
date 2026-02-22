import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { getMany, query } from '@/lib/db';

// GET /api/admin/sub-admins — list all admin users
async function getHandler(req: NextRequest, { user }: { user: { id: string; role: string } }) {
    try {
        const admins = await getMany(
            `SELECT au.id, au.admin_role, au.is_active, au.last_login_at, au.created_at,
                    u.username, u.email, u.display_name
             FROM admin_users au
             JOIN users u ON u.id = au.user_id
             ORDER BY au.created_at ASC`,
            []
        );
        return apiSuccess(admins);
    } catch (error) {
        console.error('[Sub-Admin List Error]', error);
        return apiError('Internal server error', 500);
    }
}

// POST /api/admin/sub-admins — promote a user to admin
async function postHandler(req: NextRequest, { user }: { user: { id: string; role: string } }) {
    try {
        // Only super_admin can promote
        if (user.role !== 'super_admin') {
            return apiError('Only super admins can promote users', 403);
        }

        const body = await parseBody<{ user_id: string; admin_role: string }>(req);
        if (!body?.user_id || !body?.admin_role) {
            return apiError('user_id and admin_role are required', 400);
        }

        const validRoles = ['super_admin', 'admin', 'moderator', 'support'];
        if (!validRoles.includes(body.admin_role)) {
            return apiError(`admin_role must be one of: ${validRoles.join(', ')}`, 400);
        }

        const result = await query(
            `INSERT INTO admin_users (user_id, admin_role)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET admin_role = $2, is_active = true, updated_at = NOW()
             RETURNING *`,
            [body.user_id, body.admin_role]
        );

        // Also update user role in users table
        await query(
            `UPDATE users SET role = $1 WHERE id = $2`,
            [body.admin_role === 'super_admin' ? 'super_admin' : 'admin', body.user_id]
        );

        return apiSuccess(result.rows[0], 201);
    } catch (error) {
        console.error('[Sub-Admin Promote Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
