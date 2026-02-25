import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getOne } from '@/lib/db';
import { verifyPassword, createSession, setAdminSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';
import { User } from '@/types';
import { logLoginAttempt } from '@/lib/login-logger';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
        || req.headers.get('x-real-ip')
        || null;
    const ua = req.headers.get('user-agent') || null;

    try {
        const body = await req.json();
        const { login, password } = body;

        if (!login || !password) {
            return apiError('Username/email and password are required');
        }

        // Find user by email or username
        const user = await getOne<User>(
            `SELECT * FROM users
             WHERE (email = $1 OR username = $1)
               AND deleted_at IS NULL`,
            [login.toLowerCase()]
        );

        if (!user) {
            await logLoginAttempt({
                success: false, login_type: 'admin',
                identifier: login, user_id: null,
                ip, user_agent: ua, failure_reason: 'user_not_found',
            });
            return apiError('Invalid credentials', 401);
        }

        if (user.status === 'banned' || user.status === 'suspended') {
            await logLoginAttempt({
                success: false, login_type: 'admin',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'account_inactive',
            });
            return apiError('Account is not active', 403);
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            await logLoginAttempt({
                success: false, login_type: 'admin',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'wrong_password',
            });
            return apiError('Invalid credentials', 401);
        }

        // Verify the user is actually an admin
        const adminRecord = await getOne<{ id: string; admin_role: string; is_active: boolean }>(
            `SELECT id, admin_role, is_active FROM admin_users WHERE user_id = $1`,
            [user.id]
        );

        if (!adminRecord || !adminRecord.is_active) {
            await logLoginAttempt({
                success: false, login_type: 'admin',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'not_an_admin',
            });
            return apiError('Invalid credentials', 401);
        }

        // Update last login
        await getOne(
            `UPDATE users SET last_login_at = NOW(), last_login_ip = $1 WHERE id = $2 RETURNING id`,
            [ip, user.id]
        );

        // Log success to both audit_logs (for login panel) and admin_actions (for audit trail)
        await logLoginAttempt({
            success: true, login_type: 'admin',
            identifier: login, user_id: user.id,
            ip, user_agent: ua,
        });

        await getOne(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, reason, ip_address, user_agent)
             VALUES ($1, 'login', 'admin_session', 'Admin login success', $2, $3) RETURNING id`,
            [adminRecord.id, ip || null, ua || null]
        ).catch(() => { /* non-critical */ });

        const token = await createSession(user.id, ip || undefined, ua || undefined);
        await setAdminSessionCookie(token);

        return apiSuccess({
            id: user.id,
            username: user.username,
            role: user.role,
            admin_role: adminRecord.admin_role,
            redirect: '/server-admin/overview',
        });
    } catch (error) {
        logger.error('[Admin Login Error]', error);
        return apiError('Internal server error', 500);
    }
}
