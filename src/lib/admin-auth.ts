/**
 * Shared admin auth helper.
 * Returns { user, adminId } where adminId is admin_users.id (the FK for admin_actions).
 * Returns null if the current user is not an active admin.
 */
import { getAdminCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { User } from '@/types';

export type AdminContext = {
    user: User & { profile_id: string };
    /** admin_users.id — use this for admin_actions.admin_id */
    adminId: string;
    adminRole: string;
};

export async function requireAdmin(): Promise<AdminContext | null> {
    const user = await getAdminCurrentUser();
    if (!user) return null;

    const record = await getOne<{ id: string; admin_role: string; is_active: boolean }>(
        `SELECT id, admin_role, is_active FROM admin_users WHERE user_id = $1`,
        [user.id]
    );

    if (!record?.is_active) return null;

    return { user, adminId: record.id, adminRole: record.admin_role };
}
