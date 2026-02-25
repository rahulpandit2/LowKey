import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { getAdminCurrentUser, verifyPassword, hashPassword } from '@/lib/auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';
import { resolveGeo } from '@/lib/login-logger';

// GET /api/server-admin/profile — get current admin's profile
export async function GET() {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const adminRecord = await getOne<{ admin_role: string; is_active: boolean }>(
            `SELECT admin_role, is_active FROM admin_users WHERE user_id = $1`,
            [user.id]
        );
        if (!adminRecord?.is_active) return apiError('Forbidden', 403);

        const profile = await getOne<{ display_name: string | null }>(
            `SELECT display_name FROM profiles WHERE user_id = $1`,
            [user.id]
        );

        // Check if this is the "default" protected admin (username = 'admin')
        const isDefault = user.username === 'admin';

        return apiSuccess({
            id: user.id,
            username: user.username,
            email: user.email,
            display_name: profile?.display_name || null,
            admin_role: adminRecord.admin_role,
            is_default: isDefault,
        });
    } catch (error) {
        logger.error('[Admin Profile GET]', error);
        return apiError('Internal server error', 500);
    }
}

// PATCH /api/server-admin/profile — update profile info or password
export async function PATCH(req: NextRequest) {
    try {
        const user = await getAdminCurrentUser();
        if (!user) return apiError('Unauthorized', 401);

        const adminRecord = await getOne<{ is_active: boolean }>(
            `SELECT is_active FROM admin_users WHERE user_id = $1`,
            [user.id]
        );
        if (!adminRecord?.is_active) return apiError('Forbidden', 403);

        const body = await req.json();
        const { display_name, email, current_password, new_password } = body;

        // Password change
        if (current_password && new_password) {
            const valid = await verifyPassword(current_password, user.password_hash);
            if (!valid) return apiError('Current password is incorrect', 400);
            const newHash = await hashPassword(new_password);
            await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [newHash, user.id]);

            // Log password change
            const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined;
            const ua = req.headers.get('user-agent') || undefined;
            try {
                const geo = await resolveGeo(ip || null);
                const metadata: Record<string, unknown> = { keys_updated: ['password'], success: true };
                if (geo) metadata.geo = geo;
                await query(
                    `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata) VALUES ($1, 'profile_update', $2::inet, $3, $4::jsonb)`,
                    [user.id, ip || null, ua || null, JSON.stringify(metadata)]
                );
            } catch (err) {
                logger.error('[Admin Profile Password Audit Log Error]', err);
            }

            return apiSuccess({ message: 'Password updated' });
        }

        // Profile update
        const changedKeys: string[] = [];
        if (display_name !== undefined) {
            await query(
                `INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET display_name = $2, updated_at = NOW()`,
                [user.id, display_name]
            );
            changedKeys.push('display_name');
        }
        if (email) {
            await query(`UPDATE users SET email = $1 WHERE id = $2`, [email.toLowerCase(), user.id]);
            changedKeys.push('email');
        }

        // Audit Logging
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined;
        const ua = req.headers.get('user-agent') || undefined;
        if (changedKeys.length > 0) {
            try {
                const geo = await resolveGeo(ip || null);
                const metadata: Record<string, unknown> = { keys_updated: changedKeys, success: true };
                if (geo) metadata.geo = geo;

                await query(
                    `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata) VALUES ($1, 'profile_update', $2::inet, $3, $4::jsonb)`,
                    [user.id, ip || null, ua || null, JSON.stringify(metadata)]
                );
            } catch (err) {
                logger.error('[Admin Profile Audit Log Error]', err);
            }
        }

        return apiSuccess({ message: 'Profile updated' });
    } catch (error) {
        logger.error('[Admin Profile PATCH]', error);
        return apiError('Internal server error', 500);
    }
}
