import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getOne } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';
import { User } from '@/types';
import { logAuthEvent } from '@/lib/login-logger';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
        || req.headers.get('x-real-ip')
        || null;
    const ua = req.headers.get('user-agent') || null;

    try {
        const body = await req.json();
        const { login, password } = body;

        if (!login || !password) {
            return apiError('Email/username and password are required');
        }

        // Find user by email or username
        const user = await getOne<User>(
            `SELECT * FROM users
             WHERE (email = $1 OR username = $1)
               AND deleted_at IS NULL`,
            [login.toLowerCase()]
        );

        if (!user) {
            await logAuthEvent({
                event_type: 'login', success: false, login_type: 'user',
                identifier: login, user_id: null,
                ip, user_agent: ua, failure_reason: 'user_not_found',
            });
            return apiError('Invalid credentials', 401);
        }

        if (user.status === 'banned') {
            await logAuthEvent({
                event_type: 'login', success: false, login_type: 'user',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'account_banned',
            });
            return apiError('Your account has been banned', 403);
        }

        if (user.status === 'suspended') {
            await logAuthEvent({
                event_type: 'login', success: false, login_type: 'user',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'account_suspended',
            });
            return apiError('Your account is suspended', 403);
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            await logAuthEvent({
                event_type: 'login', success: false, login_type: 'user',
                identifier: login, user_id: user.id,
                ip, user_agent: ua, failure_reason: 'wrong_password',
            });
            return apiError('Invalid credentials', 401);
        }

        // Update last login
        await getOne(
            `UPDATE users SET last_login_at = NOW(), last_login_ip = $1 WHERE id = $2 RETURNING id`,
            [ip, user.id]
        );

        // Log success
        await logAuthEvent({
            event_type: 'login', success: true, login_type: 'user',
            identifier: login, user_id: user.id,
            ip, user_agent: ua,
        });

        const token = await createSession(user.id, ip || undefined, ua || undefined);
        await setSessionCookie(token);

        return apiSuccess({
            id: user.id,
            username: user.username,
            role: user.role,
            onboarding_completed: user.onboarding_completed,
        });
    } catch (error) {
        logger.error('[Login Error]', error);
        return apiError('Internal server error', 500);
    }
}
