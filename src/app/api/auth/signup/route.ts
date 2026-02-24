import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, display_name } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return apiError('Username, email, and password are required');
        }

        if (username.length < 3 || username.length > 50) {
            return apiError('Username must be between 3 and 50 characters');
        }

        if (password.length < 8) {
            return apiError('Password must be at least 8 characters');
        }

        // Check if username or email already exists
        const existing = await getOne(
            `SELECT id FROM users WHERE username = $1 OR email = $2`,
            [username.toLowerCase(), email.toLowerCase()]
        );

        if (existing) {
            return apiError('Username or email already taken', 409);
        }

        // Hash password using pgcrypto
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await getOne<{ id: string }>(
            `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
            [username.toLowerCase(), email.toLowerCase(), passwordHash]
        );

        if (!user) {
            return apiError('Failed to create user', 500);
        }

        // Create profile
        await query(
            `INSERT INTO profiles (user_id, display_name)
       VALUES ($1, $2)`,
            [user.id, display_name || username]
        );

        // Create session
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
        const ua = req.headers.get('user-agent') || undefined;
        const token = await createSession(user.id, ip, ua);

        // Set session cookie
        await setSessionCookie(token);

        return apiSuccess({ id: user.id, username: username.toLowerCase() }, 201);
    } catch (error) {
        logger.error('[Signup Error]', error);
        return apiError('Internal server error', 500);
    }
}
