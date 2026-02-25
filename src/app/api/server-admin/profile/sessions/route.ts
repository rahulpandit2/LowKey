import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getAdminCurrentUser, hashToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';
import { cookies } from 'next/headers';

// GET /api/server-admin/profile/sessions — fetch all active sessions for current admin
export async function GET() {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const cookieStore = await cookies();
        const currentToken = cookieStore.get('lk_admin_session')?.value;
        const currentHash = currentToken ? hashToken(currentToken) : null;

        const res = await query<{
            id: string;
            ip_address: string | null;
            user_agent: string | null;
            created_at: string;
            last_active_at: string;
            is_current: boolean;
        }>(
            `SELECT 
                id, 
                ip_address::text, 
                user_agent, 
                created_at, 
                last_active_at,
                (token_hash = $2) AS is_current
             FROM sessions 
             WHERE user_id = $1 AND expires_at > NOW()
             ORDER BY last_active_at DESC`,
            [user.id, currentHash]
        );

        return apiSuccess(res.rows);
    } catch (error) {
        logger.error('[Admin Sessions GET]', error);
        return apiError('Internal server error', 500);
    }
}

// DELETE /api/server-admin/profile/sessions — revoke session(s)
export async function DELETE(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const body = await req.json();
        const { session_id } = body; // 'all' or uuid

        const cookieStore = await cookies();
        const currentToken = cookieStore.get('lk_admin_session')?.value;
        const currentHash = currentToken ? hashToken(currentToken) : null;

        if (session_id === 'all') {
            await query(
                `DELETE FROM sessions WHERE user_id = $1 AND token_hash != $2`,
                [user.id, currentHash]
            );
            return apiSuccess({ message: 'All other sessions revoked.' });
        } else if (session_id) {
            // Revoke specific session (ensure it belongs to current user)
            await query(
                `DELETE FROM sessions WHERE id = $1 AND user_id = $2`,
                [session_id, user.id]
            );
            return apiSuccess({ message: 'Session revoked.' });
        }

        return apiError('Invalid request', 400);
    } catch (error) {
        logger.error('[Admin Sessions DELETE]', error);
        return apiError('Internal server error', 500);
    }
}
