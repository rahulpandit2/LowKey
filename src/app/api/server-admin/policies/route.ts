import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/policies — list current policy versions
export async function GET() {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        try {
            const policies = await query<{
                id: string; policy_type: string; content: string; version: string;
                is_current: boolean; created_at: string; author_username: string;
            }>(
                `SELECT pv.id, pv.policy_type, pv.content, pv.version, pv.is_current, pv.created_at,
              u.username AS author_username
       FROM policy_versions pv
       LEFT JOIN users u ON u.id = pv.created_by
       ORDER BY pv.policy_type, pv.created_at DESC`
            );

            const grouped: Record<string, typeof policies.rows> = {};
            for (const p of policies.rows) {
                if (!grouped[p.policy_type]) grouped[p.policy_type] = [];
                grouped[p.policy_type].push(p);
            }

            return apiSuccess({ policies: grouped });
        } catch {
            return apiSuccess({ policies: {} });
        }
    } catch (error) {
        console.error('[Admin Policies GET]', error);
        return apiError('Internal server error', 500);
    }
}

// POST /api/server-admin/policies — publish a new policy version
export async function POST(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { policy_type, content, version } = await req.json();
        if (!policy_type || !content || !version) {
            return apiError('policy_type, content, and version are required', 400);
        }

        // Mark all old versions of this type as not current
        await query(
            `UPDATE policy_versions SET is_current = false WHERE policy_type = $1`,
            [policy_type]
        );

        // Create new version — created_by is users.id
        const newPolicy = await getOne<{ id: string }>(
            `INSERT INTO policy_versions (policy_type, content, version, is_current, created_by)
       VALUES ($1, $2, $3, true, $4)
       RETURNING id`,
            [policy_type, content, version, ctx.user.id]
        );

        // Log — admin_id is admin_users.id FK
        await query(
            `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'publish', 'policy', $2, $3)`,
            [ctx.adminId, newPolicy?.id, `Published ${policy_type} v${version}`]
        );

        return apiSuccess({ id: newPolicy?.id, message: 'Policy published' }, 201);
    } catch (error) {
        console.error('[Admin Policies POST]', error);
        return apiError('Internal server error', 500);
    }
}
