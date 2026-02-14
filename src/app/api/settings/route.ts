import { NextRequest } from 'next/server';
import { getOne, getMany, query } from '@/lib/db';
import { withAuth, apiSuccess, apiError } from '@/lib/middleware';
import { Profile, NotificationPreference } from '@/types';

// GET /api/settings — get all user settings
export const GET = withAuth(async (_req, { user }) => {
    const profile = await getOne<Profile>(
        `SELECT * FROM profiles WHERE user_id = $1`,
        [user.id]
    );

    const notificationPrefs = await getMany<NotificationPreference>(
        `SELECT * FROM notification_preferences WHERE user_id = $1`,
        [user.id]
    );

    // Get active sessions count
    const sessions = await getOne<{ count: string }>(
        `SELECT COUNT(*) FROM sessions WHERE user_id = $1 AND expires_at > NOW()`,
        [user.id]
    );

    return apiSuccess({
        account: {
            username: user.username,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified,
            mfa_enabled: user.mfa_enabled,
            date_of_birth: user.date_of_birth,
        },
        profile: profile ? {
            display_name: profile.display_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            location: profile.location,
            website: profile.website,
            locale: profile.locale,
            timezone: profile.timezone,
        } : null,
        privacy: profile ? {
            visibility: profile.visibility,
            default_post_visibility: profile.default_post_visibility,
            allow_dms_from: profile.allow_dms_from,
            show_points: profile.show_points,
            show_badges: profile.show_badges,
            show_achievements: profile.show_achievements,
        } : null,
        notifications: notificationPrefs,
        points: profile ? {
            balance: profile.points_balance,
        } : null,
        security: {
            active_sessions: parseInt(sessions?.count || '0'),
            mfa_enabled: user.mfa_enabled,
        },
    });
});

// PUT /api/settings — update settings
export const PUT = withAuth(async (req, { user }) => {
    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) return apiError('Section and data are required');

    switch (section) {
        case 'profile':
            await query(
                `UPDATE profiles SET
           display_name = COALESCE($2, display_name),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url),
           location = COALESCE($5, location),
           website = COALESCE($6, website),
           locale = COALESCE($7, locale),
           timezone = COALESCE($8, timezone),
           updated_at = NOW()
         WHERE user_id = $1`,
                [user.id, data.display_name, data.bio, data.avatar_url, data.location, data.website, data.locale, data.timezone]
            );
            break;

        case 'privacy':
            await query(
                `UPDATE profiles SET
           visibility = COALESCE($2, visibility),
           default_post_visibility = COALESCE($3, default_post_visibility),
           allow_dms_from = COALESCE($4, allow_dms_from),
           show_points = COALESCE($5, show_points),
           show_badges = COALESCE($6, show_badges),
           show_achievements = COALESCE($7, show_achievements),
           updated_at = NOW()
         WHERE user_id = $1`,
                [user.id, data.visibility, data.default_post_visibility, data.allow_dms_from, data.show_points, data.show_badges, data.show_achievements]
            );
            break;

        case 'account':
            if (data.email) {
                const emailTaken = await getOne(`SELECT id FROM users WHERE email = $1 AND id != $2`, [data.email.toLowerCase(), user.id]);
                if (emailTaken) return apiError('Email already in use', 409);
                await query(`UPDATE users SET email = $1, email_verified = FALSE, updated_at = NOW() WHERE id = $2`, [data.email.toLowerCase(), user.id]);
            }
            if (data.phone !== undefined) {
                await query(`UPDATE users SET phone = $1, phone_verified = FALSE, updated_at = NOW() WHERE id = $2`, [data.phone || null, user.id]);
            }
            break;

        case 'notifications':
            if (data.preferences && Array.isArray(data.preferences)) {
                for (const pref of data.preferences) {
                    await query(
                        `INSERT INTO notification_preferences (user_id, kind, channel, enabled)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, kind, channel) DO UPDATE SET enabled = $4`,
                        [user.id, pref.kind, pref.channel, pref.enabled]
                    );
                }
            }
            break;

        default:
            return apiError('Unknown settings section');
    }

    return apiSuccess({ message: 'Settings updated' });
});
