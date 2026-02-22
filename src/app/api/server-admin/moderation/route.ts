import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOne, query } from '@/lib/db';
import { apiError, apiSuccess } from '@/lib/middleware';

// GET /api/server-admin/moderation?page=1&status=pending
export async function GET(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const status = searchParams.get('status') || 'pending';
        const limit = 25;
        const offset = (page - 1) * limit;

        try {
            const [reports, countRow] = await Promise.all([
                query<{
                    id: string; content_type: string; content_id: string;
                    reason: string; status: string; created_at: string;
                    reporter_username: string; content_preview: string | null;
                }>(
                    `SELECT
             cr.id, cr.content_type, cr.content_id,
             cr.reason, cr.status, cr.created_at,
             u.username AS reporter_username,
             CASE
               WHEN cr.content_type = 'post' THEN (SELECT LEFT(body, 100) FROM posts WHERE id = cr.content_id)
               WHEN cr.content_type = 'comment' THEN (SELECT LEFT(body, 100) FROM post_feedbacks WHERE id = cr.content_id)
               ELSE NULL
             END AS content_preview
           FROM content_reports cr
           JOIN users u ON u.id = cr.reporter_id
           WHERE cr.status = $1
           ORDER BY cr.created_at DESC
           LIMIT $2 OFFSET $3`,
                    [status, limit, offset]
                ),
                getOne<{ count: number }>(
                    `SELECT COUNT(*) AS count FROM content_reports WHERE status = $1`, [status]
                ),
            ]);

            return apiSuccess({
                reports: reports.rows,
                total: Number(countRow?.count || 0),
                page,
                pages: Math.ceil(Number(countRow?.count || 0) / limit),
            });
        } catch {
            // Table doesn't exist yet
            return apiSuccess({ reports: [], total: 0, page: 1, pages: 0 });
        }
    } catch (error) {
        console.error('[Admin Moderation GET]', error);
        return apiError('Internal server error', 500);
    }
}

// PATCH /api/server-admin/moderation — resolve, dismiss reports
export async function PATCH(req: NextRequest) {
    try {
        const ctx = await requireAdmin();
        if (!ctx) return apiError('Forbidden', 403);

        const { report_id, action, reason } = await req.json();
        if (!report_id || !action) return apiError('report_id and action required', 400);

        try {
            switch (action) {
                case 'dismiss':
                    await query(
                        `UPDATE content_reports SET status = 'dismissed', resolved_at = NOW(), resolved_by = $1 WHERE id = $2`,
                        [ctx.user.id, report_id]
                    );
                    break;
                case 'remove_content': {
                    const report = await getOne<{ content_type: string; content_id: string }>(
                        `SELECT content_type, content_id FROM content_reports WHERE id = $1`, [report_id]
                    );
                    if (report?.content_type === 'post') {
                        await query(`UPDATE posts SET deleted_at = NOW() WHERE id = $1`, [report.content_id]);
                    }
                    await query(
                        `UPDATE content_reports SET status = 'resolved', resolved_at = NOW(), resolved_by = $1 WHERE id = $2`,
                        [ctx.user.id, report_id]
                    );
                    break;
                }
                default:
                    return apiError('Invalid action', 400);
            }

            // Log — adminId is admin_users.id FK
            await query(
                `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason)
         VALUES ($1, $2, 'content_report', $3, $4)`,
                [ctx.adminId, action, report_id, reason || `Report ${action}`]
            );

            return apiSuccess({ report_id, action });
        } catch {
            return apiError('Failed to process report', 500);
        }
    } catch (error) {
        console.error('[Admin Moderation PATCH]', error);
        return apiError('Internal server error', 500);
    }
}
