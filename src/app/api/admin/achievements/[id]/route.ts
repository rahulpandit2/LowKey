import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { query, getOne } from '@/lib/db';

// PUT /api/admin/achievements/[id] — update entity
async function putHandler(req: NextRequest, { params }: { user: any; params?: Record<string, string> }) {
    try {
        const id = params?.id;
        if (!id) return apiError('ID required', 400);

        const body = await parseBody<{
            entity_type: 'achievement' | 'badge' | 'point_task';
            name?: string;
            description?: string;
            icon_url?: string;
            category?: string;
            is_active?: boolean;
            milestone_value?: number;
            points?: number;
            level?: string;
        }>(req);

        if (!body?.entity_type) return apiError('entity_type required', 400);

        const table = body.entity_type === 'point_task' ? 'point_tasks'
            : body.entity_type === 'badge' ? 'badges' : 'achievements';

        const fields: string[] = [];
        const values: unknown[] = [];
        let idx = 1;

        const allowed = ['name', 'description', 'icon_url', 'category', 'is_active',
            'milestone_value', 'points', 'level'];
        for (const key of allowed) {
            if ((body as any)[key] !== undefined) {
                fields.push(`${key} = $${idx++}`);
                values.push((body as any)[key]);
            }
        }

        if (fields.length === 0) return apiError('No fields to update', 400);

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await query(
            `UPDATE ${table} SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        );

        if (result.rows.length === 0) return apiError('Not found', 404);
        return apiSuccess(result.rows[0]);
    } catch (error) {
        logger.error('[Admin Achievement Update Error]', error);
        return apiError('Internal server error', 500);
    }
}

// DELETE /api/admin/achievements/[id] — deactivate entity
async function deleteHandler(req: NextRequest, { params }: { user: any; params?: Record<string, string> }) {
    try {
        const id = params?.id;
        if (!id) return apiError('ID required', 400);

        const { searchParams } = new URL(req.url);
        const entityType = searchParams.get('entity_type') || 'achievement';
        const table = entityType === 'point_task' ? 'point_tasks'
            : entityType === 'badge' ? 'badges' : 'achievements';

        await query(
            `UPDATE ${table} SET is_active = false, updated_at = NOW() WHERE id = $1`,
            [id]
        );

        return apiSuccess({ message: 'Deactivated' });
    } catch (error) {
        logger.error('[Admin Achievement Delete Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
