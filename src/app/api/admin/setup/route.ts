import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { query, getOne } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, display_name } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return apiError('Username, email, and password are required', 400);
        }

        // Check if any admin already exists
        const existingAdmin = await getOne(
            `SELECT id FROM admin_users WHERE is_active = true LIMIT 1`
        );

        if (existingAdmin) {
            return apiError('Admin account already exists. Setup is disabled.', 403);
        }

        // Check if username or email already exists
        const existingUser = await getOne(
            `SELECT id FROM users WHERE username = $1 OR email = $2`,
            [username.toLowerCase(), email.toLowerCase()]
        );

        if (existingUser) {
            return apiError('Username or email already taken', 409);
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await getOne<{ id: string }>(
            `INSERT INTO users (username, email, password_hash, role, status, email_verified, onboarding_completed)
       VALUES ($1, $2, $3, 'admin', 'active', true, true)
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

        // Create admin record and get its PK
        const adminRec = await getOne<{ id: string }>(
            `INSERT INTO admin_users (user_id, admin_role, is_active, mfa_enabled)
       VALUES ($1, 'super_admin', true, false)
       RETURNING id`,
            [user.id]
        );

        // Create session
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
        const ua = req.headers.get('user-agent') || undefined;
        const token = await createSession(user.id, ip, ua);

        // Set session cookie
        await setSessionCookie(token);

        // Log admin action — admin_id references admin_users.id
        if (adminRec) {
            await query(
                `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason, ip_address, user_agent)
         VALUES ($1, 'create', 'admin_user', $1, 'First-time server admin setup', $2, $3)`,
                [adminRec.id, ip || null, ua || null]
            );
        }


        return apiSuccess(
            {
                id: user.id,
                username: username.toLowerCase(),
                message: 'Server admin account created successfully',
            },
            201
        );
    } catch (error) {
        logger.error('[Admin Setup Error]', error);
        return apiError('Internal server error', 500);
    }
}

// GET /api/admin/setup — check if setup is needed
export async function GET() {
    try {
        const existingAdmin = await getOne(
            `SELECT id FROM admin_users WHERE is_active = true LIMIT 1`
        );

        return apiSuccess({
            setup_required: !existingAdmin,
        });
    } catch (error) {
        logger.error('[Admin Setup Check Error]', error);
        return apiError('Internal server error', 500);
    }
}
