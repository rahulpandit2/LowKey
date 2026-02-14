export type UserStatus = 'active' | 'suspended' | 'banned' | 'deactivated' | 'soft_deleted';
export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type SuspensionType = 'temporary' | 'permanent';
export type PostVisibility = 'public' | 'followers' | 'community_only' | 'private' | 'incognito';

export interface User {
    id: string;
    username: string;
    email: string;
    phone: string | null;
    password_hash: string;
    status: UserStatus;
    role: UserRole;
    email_verified: boolean;
    phone_verified: boolean;
    mfa_enabled: boolean;
    date_of_birth: string | null;
    last_login_at: string | null;
    last_login_ip: string | null;
    onboarding_completed: boolean;
    suspension_reason: string | null;
    suspension_type: SuspensionType | null;
    suspension_until: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Profile {
    id: string;
    user_id: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    website: string | null;
    visibility: PostVisibility;
    default_post_visibility: PostVisibility;
    allow_dms_from: 'everyone' | 'followers' | 'nobody';
    show_points: boolean;
    show_badges: boolean;
    show_achievements: boolean;
    locale: string;
    timezone: string;
    points_balance: number;
    created_at: string;
    updated_at: string;
}

export interface Session {
    id: string;
    user_id: string;
    token_hash: string;
    ip_address: string | null;
    user_agent: string | null;
    device_info: Record<string, unknown> | null;
    expires_at: string;
    created_at: string;
    last_active_at: string;
}

export interface UserPublic {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    website: string | null;
    points_balance: number;
    show_points: boolean;
    show_badges: boolean;
    created_at: string;
}

export interface Follow {
    id: string;
    follower_id: string;
    following_id: string;
    is_close_contact: boolean;
    created_at: string;
}
