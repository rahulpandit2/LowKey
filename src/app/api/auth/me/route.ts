import { logger } from '@/lib/logger';
import { withAuth, apiSuccess } from '@/lib/middleware';
import { getOne } from '@/lib/db';
import { Profile } from '@/types';
import { getAdminCurrentUser } from '@/lib/auth';

export const GET = withAuth(async (_req, { user }) => {
    // Get full profile
    logger.info('[Auth/Me] Fetching profile for user', user.id);
    const profile = await getOne<Profile>(
        `SELECT * FROM profiles WHERE user_id = $1`,
        [user.id]
    );
    logger.info('[Auth/Me] Profile fetched:', profile ? 'found' : 'null');

    // Get follower/following counts
    logger.info('[Auth/Me] Fetching counts');
    const counts = await getOne<{ followers: string; following: string }>(
        `SELECT
       (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers,
       (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following`,
        [user.id]
    );
    logger.info('[Auth/Me] Counts fetched:', counts);

    // Check if there is an active admin session as well
    const adminUser = await getAdminCurrentUser();
    const isAdminActive = !!adminUser;

    return apiSuccess({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        onboarding_completed: user.onboarding_completed,
        created_at: user.created_at,
        isAdminActive,
        profile: profile
            ? {
                display_name: profile.display_name,
                bio: profile.bio,
                avatar_url: profile.avatar_url,
                location: profile.location,
                website: profile.website,
                default_post_visibility: profile.default_post_visibility,
                allow_dms_from: profile.allow_dms_from,
                show_points: profile.show_points,
                show_badges: profile.show_badges,
                show_achievements: profile.show_achievements,
                points_balance: profile.points_balance,
                locale: profile.locale,
                timezone: profile.timezone,
            }
            : null,
        followers: parseInt(counts?.followers || '0'),
        following: parseInt(counts?.following || '0'),
    });
});
