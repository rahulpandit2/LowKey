import { NextRequest } from 'next/server';
import { getOne } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';
import { User } from '@/types';

export async function POST(req: NextRequest) {
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
            return apiError('Invalid credentials', 401);
        }

        if (user.status === 'banned' || user.status === 'suspended') {
            return apiError('Account is not active', 403);
        }

        // Verify password
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return apiError('Invalid credentials', 401);
        }

        // Verify the user is actually an admin
        const adminRecord = await getOne<{ id: string; admin_role: string; is_active: boolean }>(
            `SELECT id, admin_role, is_active FROM admin_users WHERE user_id = $1`,
            [user.id]
        );

        if (!adminRecord || !adminRecord.is_active) {
            return apiError('Invalid credentials', 401);
        }


        // Update last login
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
        await getOne(
            `UPDATE users SET last_login_at = NOW(), last_login_ip = $1 WHERE id = $2 RETURNING id`,
            [ip, user.id]
        );

        // Create session
        const ua = req.headers.get('user-agent') || undefined;
        const token = await createSession(user.id, ip || undefined, ua);
        await setSessionCookie(token);

        // Log admin login — admin_id references admin_users.id, not users.id
        await getOne(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, reason, ip_address, user_agent)
             VALUES ($1, 'login', 'admin_session', 'Admin login', $2, $3) RETURNING id`,
            [adminRecord.id, ip || null, ua || null]
        );

        return apiSuccess({
            id: user.id,
            username: user.username,
            role: user.role,
            admin_role: adminRecord.admin_role,
            redirect: '/server-admin/overview',
        });
    } catch (error) {
        console.error('[Admin Login Error]', error);
        return apiError('Internal server error', 500);
    }
}
