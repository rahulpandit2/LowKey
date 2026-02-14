// Centralized API client for frontend components

type ApiResponse<T = unknown> = {
    data?: T;
    error?: string;
};

async function fetchApi<T>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.error || `Request failed (${res.status})` };
        }

        return { data: json.data };
    } catch (err) {
        return { error: 'Network error. Please try again.' };
    }
}

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

export const auth = {
    signup: (data: { username: string; email: string; password: string; display_name?: string }) =>
        fetchApi('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    login: (data: { login: string; password: string }) =>
        fetchApi('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    logout: () =>
        fetchApi('/api/auth/logout', { method: 'POST' }),

    me: () =>
        fetchApi('/api/auth/me'),
};

// ═══════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════

export const posts = {
    list: (params?: { status?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return fetchApi(`/api/posts?${qs}`);
    },

    get: (id: string) =>
        fetchApi(`/api/posts/${id}`),

    create: (data: Record<string, unknown>) =>
        fetchApi('/api/posts', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Record<string, unknown>) =>
        fetchApi(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        fetchApi(`/api/posts/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════
// FEED
// ═══════════════════════════════════════════

export const feed = {
    get: (params?: { filter?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return fetchApi(`/api/feed?${qs}`);
    },
};

// ═══════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════

export const reactions = {
    add: (postId: string, reaction: string) =>
        fetchApi(`/api/posts/${postId}/reactions`, { method: 'POST', body: JSON.stringify({ reaction }) }),

    remove: (postId: string, reaction: string) =>
        fetchApi(`/api/posts/${postId}/reactions?reaction=${reaction}`, { method: 'DELETE' }),
};

export const feedbacks = {
    list: (postId: string) =>
        fetchApi(`/api/posts/${postId}/feedbacks`),

    create: (postId: string, data: Record<string, unknown>) =>
        fetchApi(`/api/posts/${postId}/feedbacks`, { method: 'POST', body: JSON.stringify(data) }),
};

export const bookmarks = {
    list: (params?: { page?: number }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return fetchApi(`/api/bookmarks?${qs}`);
    },

    add: (postId: string, data?: { note?: string; tags?: string[] }) =>
        fetchApi(`/api/posts/${postId}/bookmarks`, { method: 'POST', body: JSON.stringify(data || {}) }),

    remove: (postId: string) =>
        fetchApi(`/api/posts/${postId}/bookmarks`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════

export const messages = {
    threads: () =>
        fetchApi('/api/messages'),

    getThread: (threadId: string) =>
        fetchApi(`/api/messages/${threadId}`),

    send: (data: { recipient_username: string; message: string }) =>
        fetchApi('/api/messages', { method: 'POST', body: JSON.stringify(data) }),

    reply: (threadId: string, message: string) =>
        fetchApi(`/api/messages/${threadId}`, { method: 'POST', body: JSON.stringify({ message }) }),
};

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

export const notifications = {
    list: (params?: { filter?: string; page?: number }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return fetchApi(`/api/notifications?${qs}`);
    },

    markRead: (notificationIds: string[]) =>
        fetchApi('/api/notifications', { method: 'PUT', body: JSON.stringify({ notification_ids: notificationIds }) }),

    markAllRead: () =>
        fetchApi('/api/notifications', { method: 'PUT', body: JSON.stringify({ mark_all_read: true }) }),
};

// ═══════════════════════════════════════════
// COMMUNITIES
// ═══════════════════════════════════════════

export const communities = {
    list: (params?: { filter?: string; search?: string; page?: number }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return fetchApi(`/api/communities?${qs}`);
    },

    get: (handle: string) =>
        fetchApi(`/api/communities/${handle}`),

    create: (data: Record<string, unknown>) =>
        fetchApi('/api/communities', { method: 'POST', body: JSON.stringify(data) }),

    update: (handle: string, data: Record<string, unknown>) =>
        fetchApi(`/api/communities/${handle}`, { method: 'PUT', body: JSON.stringify(data) }),

    join: (handle: string) =>
        fetchApi(`/api/communities/${handle}/join`, { method: 'POST' }),

    leave: (handle: string) =>
        fetchApi(`/api/communities/${handle}/join`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════

export const users = {
    profile: (username: string) =>
        fetchApi(`/api/users/${username}`),

    follow: (username: string) =>
        fetchApi(`/api/users/${username}/follow`, { method: 'POST' }),

    unfollow: (username: string) =>
        fetchApi(`/api/users/${username}/follow`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════

export const settings = {
    get: () =>
        fetchApi('/api/settings'),

    update: (section: string, data: Record<string, unknown>) =>
        fetchApi('/api/settings', { method: 'PUT', body: JSON.stringify({ section, data }) }),
};

// ═══════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════

export const contact = {
    submit: (data: Record<string, unknown>) =>
        fetchApi('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
};
