export type MessageRequestStatus = 'pending' | 'accepted' | 'rejected';
export type ThreadStatus = 'active' | 'archived' | 'blocked';

export interface MessageThread {
    id: string;
    status: ThreadStatus;
    is_incognito: boolean;
    created_at: string;
    updated_at: string;
}

export interface MessageThreadParticipant {
    id: string;
    thread_id: string;
    user_id: string;
    is_pinned: boolean;
    is_archived: boolean;
    last_read_at: string | null;
    profile_revealed: boolean;
    joined_at: string;
}

export interface Message {
    id: string;
    thread_id: string;
    sender_id: string;
    body: string;
    attachment_url: string | null;
    attachment_type: string | null;
    is_read: boolean;
    created_at: string;
    deleted_at: string | null;
}

export interface ThreadWithDetails extends MessageThread {
    other_user_username: string;
    other_user_display_name: string | null;
    other_user_avatar_url: string | null;
    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;
}
