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
            return apiError('Invalid credentials', 401);
        }

        if (user.status === 'banned') {
            return apiError('Your account has been banned', 403);
        }

        if (user.status === 'suspended') {
            return apiError('Your account is suspended', 403);
        }

        // Verify password
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
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

        return apiSuccess({
            id: user.id,
            username: user.username,
            role: user.role,
            onboarding_completed: user.onboarding_completed,
        });
    } catch (error) {
        console.error('[Login Error]', error);
        return apiError('Internal server error', 500);
    }
}
