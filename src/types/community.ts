import { PostVisibility } from './user';

export type CommunityVisibility = 'public' | 'members_only' | 'invite_only';
export type CommunityJoinType = 'open' | 'approval' | 'invite_only';
export type CommunityStatus = 'active' | 'archived' | 'soft_deleted';
export type CommunityMemberRole = 'owner' | 'admin' | 'moderator' | 'mentor' | 'member';

export interface Community {
    id: string;
    handle: string;
    name: string;
    description: string | null;
    icon_url: string | null;
    banner_url: string | null;
    owner_id: string | null;
    visibility: CommunityVisibility;
    join_type: CommunityJoinType;
    status: CommunityStatus;
    default_post_visibility: PostVisibility;
    post_approval_required: boolean;
    category: string | null;
    location: string | null;
    member_count: number;
    post_count: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CommunityMember {
    id: string;
    community_id: string;
    user_id: string;
    role: CommunityMemberRole;
    is_trusted: boolean;
    joined_at: string;
}
