export type NotificationKind =
    | 'reaction' | 'feedback' | 'feedback_helpful' | 'mention' | 'message'
    | 'community_invite' | 'join_request' | 'moderation' | 'system'
    | 'verification' | 'points' | 'badge' | 'achievement'
    | 'reveal_request' | 'dm_request' | 'follow' | 'appeal_result';

export type NotificationChannel = 'in_app' | 'email' | 'push';

export interface Notification {
    id: string;
    user_id: string;
    kind: NotificationKind;
    title: string | null;
    body: string | null;
    data: Record<string, unknown>;
    is_read: boolean;
    is_important: boolean;
    created_at: string;
}

export interface NotificationPreference {
    id: string;
    user_id: string;
    kind: NotificationKind;
    channel: NotificationChannel;
    enabled: boolean;
}
