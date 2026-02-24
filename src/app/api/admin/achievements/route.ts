import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { getMany, query } from '@/lib/db';

// GET /api/admin/achievements — list all achievements
async function getHandler() {
    try {
        const achievements = await getMany(
            `SELECT * FROM achievements ORDER BY category, milestone_value ASC`, []
        );
        const badges = await getMany(
            `SELECT * FROM badges ORDER BY name ASC`, []
        );
        const pointTasks = await getMany(
            `SELECT * FROM point_tasks ORDER BY category, name ASC`, []
        );
        return apiSuccess({ achievements, badges, pointTasks });
    } catch (error) {
        logger.error('[Admin Achievements List Error]', error);
        return apiError('Internal server error', 500);
    }
}

// POST /api/admin/achievements — create achievement, badge, or point task
async function postHandler(req: NextRequest) {
    try {
        const body = await parseBody<{
            entity_type: 'achievement' | 'badge' | 'point_task';
            name: string;
            description?: string;
            icon_url?: string;
            category?: string;
            milestone_value?: number;
            linked_task_type?: string;
            // badge-specific
            badge_type?: string;
            level?: string;
            // point_task-specific
            points?: number;
            monthly_limit?: number;
            daily_limit?: number;
        }>(req);

        if (!body?.entity_type || !body?.name) {
            return apiError('entity_type and name are required', 400);
        }

        let result;
        switch (body.entity_type) {
            case 'achievement':
                result = await query(
                    `INSERT INTO achievements (name, description, icon_url, milestone_value, linked_task_type, category)
                     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                    [body.name, body.description || '', body.icon_url || null,
                    body.milestone_value || 1, body.linked_task_type || null, body.category || 'general']
                );
                break;
            case 'badge':
                result = await query(
                    `INSERT INTO badges (name, description, icon_url, badge_type, level)
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [body.name, body.description || '', body.icon_url || null,
                    body.badge_type || 'public', body.level || 'bronze']
                );
                break;
            case 'point_task':
                if (!body.points) return apiError('points is required for point tasks', 400);
                result = await query(
                    `INSERT INTO point_tasks (name, description, points, category, monthly_limit, daily_limit)
                     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                    [body.name, body.description || '', body.points,
                    body.category || 'general', body.monthly_limit || null, body.daily_limit || null]
                );
                break;
            default:
                return apiError('entity_type must be achievement, badge, or point_task', 400);
        }

        return apiSuccess(result.rows[0], 201);
    } catch (error) {
        logger.error('[Admin Achievements Create Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
