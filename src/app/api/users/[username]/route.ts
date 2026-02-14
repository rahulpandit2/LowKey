import { NextRequest } from 'next/server';
import { getOne, getMany } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';

// GET /api/users/[username] — public profile
export const GET = withAuth(async (_req, { user: currentUser, params }) => {
    const username = params?.username;
    if (!username) return apiError('Username required');

    const profile = await getOne(
        `SELECT u.id, u.username, u.role, u.created_at,
       p.display_name, p.bio, p.avatar_url, p.location, p.website,
       p.show_points, p.show_badges, p.show_achievements,
       CASE WHEN p.show_points THEN p.points_balance ELSE NULL END AS points_balance,
       (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS follower_count,
       (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
       (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND status = 'published' AND deleted_at IS NULL AND is_incognito = FALSE) AS post_count,
       EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = u.id) AS is_following,
       EXISTS(SELECT 1 FROM user_blocks WHERE blocker_id = $2 AND blocked_id = u.id) AS is_blocked
     FROM users u
     JOIN profiles p ON p.user_id = u.id
     WHERE u.username = $1
       AND u.status = 'active'
       AND u.deleted_at IS NULL`,
        [username.toLowerCase(), currentUser.id]
    );

    if (!profile) return apiError('User not found', 404);

    // Get badges if enabled
    const profileData = profile as Record<string, unknown>;
    let badges: unknown[] = [];
    if (profileData.show_badges) {
        badges = await getMany(
            `SELECT b.name, b.description, b.badge_type, b.level, b.icon_url, ub.granted_at
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1 AND ub.is_visible = TRUE AND ub.revoked_at IS NULL
         AND (ub.expires_at IS NULL OR ub.expires_at > NOW())`,
            [profileData.id]
        );
    }

    // Get achievements if enabled
    let achievements: unknown[] = [];
    if (profileData.show_achievements) {
        achievements = await getMany(
            `SELECT a.name, a.description, a.icon_url, a.category, ua.unlocked_at
       FROM user_achievements ua
       JOIN achievements a ON a.id = ua.achievement_id
       WHERE ua.user_id = $1`,
            [profileData.id]
        );
    }

    // Get recent posts
    const recentPosts = await getMany(
        `SELECT id, title, body, post_type, reaction_count, feedback_count, created_at
     FROM posts
     WHERE author_id = $1 AND status = 'published' AND deleted_at IS NULL AND is_incognito = FALSE
     ORDER BY created_at DESC LIMIT 10`,
        [profileData.id]
    );

    return apiSuccess({
        ...profile,
        badges,
        achievements,
        recent_posts: recentPosts,
        is_own_profile: profileData.id === currentUser.id,
    });
});
