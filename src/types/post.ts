import { PostVisibility } from './user';

export type PostType = 'thought' | 'problem' | 'achievement' | 'dilemma' | 'help';
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'hidden' | 'removed' | 'soft_deleted';

export type ReactionType =
    | 'me_too' | 'interesting' | 'unique' | 'loved_it' | 'challenged_me'
    | 'made_me_question' | 'relatable_struggle' | 'motivated_me';

export type FeedbackType = 'empathic' | 'constructive' | 'integrate_source';
export type FeedbackVoteType = 'agree' | 'disagree';
export type MarkType = 'read_carefully' | 'saved_in_mind' | 'inspired_to_reflect';

export interface Post {
    id: string;
    author_id: string;
    community_id: string | null;
    title: string | null;
    body: string;
    post_type: PostType;
    visibility: PostVisibility;
    status: PostStatus;
    is_incognito: boolean;
    is_pinned: boolean;
    content_warning: boolean;
    content_warning_text: string | null;
    location: string | null;
    scheduled_at: string | null;
    published_at: string | null;
    view_count: number;
    reaction_count: number;
    feedback_count: number;
    share_count: number;
    current_version: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PostWithAuthor extends Post {
    author_username: string;
    author_display_name: string | null;
    author_avatar_url: string | null;
}

export interface Reaction {
    id: string;
    post_id: string;
    user_id: string;
    reaction: ReactionType;
    created_at: string;
}

export interface Feedback {
    id: string;
    post_id: string;
    author_id: string;
    feedback_type: FeedbackType;
    body: string | null;
    whats_not_working: string | null;
    whats_working: string | null;
    what_can_be_done: string | null;
    source_url: string | null;
    source_note: string | null;
    is_anonymous: boolean;
    is_helpful: boolean;
    agree_count: number;
    disagree_count: number;
    created_at: string;
}

export interface Bookmark {
    id: string;
    post_id: string;
    user_id: string;
    note: string | null;
    tags: string[];
    created_at: string;
}

export interface Mark {
    id: string;
    post_id: string;
    user_id: string;
    mark: MarkType;
    created_at: string;
}

export interface CreatePostInput {
    title?: string;
    body: string;
    post_type: PostType;
    visibility?: PostVisibility;
    is_incognito?: boolean;
    community_id?: string;
    content_warning?: boolean;
    content_warning_text?: string;
    location?: string;
    scheduled_at?: string;
    guided_answers?: Record<string, string>;
}
