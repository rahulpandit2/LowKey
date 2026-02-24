import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAuth } from '@/lib/middleware';
import { getMany, getOne } from '@/lib/db';

// GET /api/achievements — list user's achievements, badges, points
async function handler(req: NextRequest, { user }: { user: { id: string } }) {
    try {
        // Get total points
        const pointsRow = await getOne<{ total: string }>(
            `SELECT COALESCE(SUM(points), 0) AS total
             FROM point_transactions
             WHERE user_id = $1 AND is_revoked = false`,
            [user.id]
        );

        // Get unlocked achievements
        const achievements = await getMany(
            `SELECT a.id, a.name, a.description, a.icon_url, a.category, a.milestone_value,
                    ua.unlocked_at
             FROM user_achievements ua
             JOIN achievements a ON a.id = ua.achievement_id
             WHERE ua.user_id = $1 AND a.is_active = true
             ORDER BY ua.unlocked_at DESC`,
            [user.id]
        );

        // Get all available achievements (for progress tracking)
        const allAchievements = await getMany(
            `SELECT id, name, description, icon_url, category, milestone_value, linked_task_type
             FROM achievements WHERE is_active = true
             ORDER BY milestone_value ASC`,
            []
        );

        // Get badges
        const badges = await getMany(
            `SELECT b.id, b.name, b.description, b.badge_type, b.level, b.icon_url,
                    ub.is_visible, ub.granted_at, ub.expires_at
             FROM user_badges ub
             JOIN badges b ON b.id = ub.badge_id
             WHERE ub.user_id = $1 AND ub.revoked_at IS NULL
             ORDER BY ub.granted_at DESC`,
            [user.id]
        );

        // Get recent point transactions
        const recentTransactions = await getMany(
            `SELECT pt.id, pt.points, pt.reason, pt.created_at,
                    ptask.name AS task_name
             FROM point_transactions pt
             LEFT JOIN point_tasks ptask ON ptask.id = pt.task_id
             WHERE pt.user_id = $1 AND pt.is_revoked = false
             ORDER BY pt.created_at DESC
             LIMIT 20`,
            [user.id]
        );

        return apiSuccess({
            totalPoints: parseInt(pointsRow?.total || '0', 10),
            achievements,
            allAchievements,
            badges,
            recentTransactions,
        });
    } catch (error) {
        logger.error('[Achievements Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAuth(handler);
