'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { notifications as notifApi } from '@/lib/api';

type Notif = {
    id: string;
    kind: string;
    title: string | null;
    body: string | null;
    is_read: boolean;
    is_important: boolean;
    created_at: string;
    data: Record<string, unknown>;
};

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'reactions', label: 'Reactions' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'mentions', label: 'Mentions' },
    { key: 'system', label: 'System' },
];

const KIND_CONFIG: Record<string, { icon: string; color: string }> = {
    reaction: { icon: 'HeartIcon', color: 'text-pink-400 bg-pink-500/10' },
    feedback: { icon: 'ChatBubbleLeftEllipsisIcon', color: 'text-blue-400 bg-blue-500/10' },
    feedback_helpful: { icon: 'HandThumbUpIcon', color: 'text-green-400 bg-green-500/10' },
    mention: { icon: 'AtSymbolIcon', color: 'text-amber-400 bg-amber-500/10' },
    message: { icon: 'EnvelopeIcon', color: 'text-indigo-400 bg-indigo-500/10' },
    community_invite: { icon: 'UserGroupIcon', color: 'text-purple-400 bg-purple-500/10' },
    follow: { icon: 'UserPlusIcon', color: 'text-cyan-400 bg-cyan-500/10' },
    badge: { icon: 'ShieldCheckIcon', color: 'text-yellow-400 bg-yellow-500/10' },
    points: { icon: 'SparklesIcon', color: 'text-emerald-400 bg-emerald-500/10' },
    system: { icon: 'BellAlertIcon', color: 'text-zinc-400 bg-zinc-500/10' },
    moderation: { icon: 'ExclamationTriangleIcon', color: 'text-red-400 bg-red-500/10' },
};

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default function NotificationsPage() {
    const [filter, setFilter] = useState('all');
    const [items, setItems] = useState<Notif[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = () => {
        setLoading(true);
        notifApi.list({ filter }).then((res) => {
            if (res.data) {
                const d = res.data as { notifications: Notif[]; unread_count: number };
                setItems(d.notifications || []);
                setUnreadCount(d.unread_count || 0);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const handleMarkAllRead = () => {
        notifApi.markAllRead().then(() => {
            setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-[1px] bg-white/30"></div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Activity</span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="font-serif text-4xl md:text-5xl text-white">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white/30 pb-px"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                {unreadCount > 0 && (
                    <p className="text-sm text-zinc-500 mt-2">{unreadCount} unread</p>
                )}
            </header>

            {/* Filters */}
            <div className="flex gap-1 mb-8 border-b border-white/[0.08] pb-px overflow-x-auto">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${filter === f.key
                                ? 'text-white border-white'
                                : 'text-zinc-500 border-transparent hover:text-white hover:border-white/30'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border border-white/[0.05] p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white/5 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-3 bg-white/5 rounded w-3/4 mb-2"></div>
                                    <div className="h-2 bg-white/5 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="border border-white/[0.05] p-12 text-center">
                    <Icon name="BellSlashIcon" size={40} className="text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {items.map((notif) => {
                        const config = KIND_CONFIG[notif.kind] || KIND_CONFIG.system;
                        return (
                            <div
                                key={notif.id}
                                className={`flex items-start gap-4 p-5 transition-colors ${!notif.is_read
                                        ? 'bg-white/[0.02] border-l-2 border-white/30'
                                        : 'border-l-2 border-transparent hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                                    <Icon name={config.icon} size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-relaxed ${!notif.is_read ? 'text-white' : 'text-zinc-400'}`}>
                                        {notif.body || notif.title || 'New notification'}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-1">{timeAgo(notif.created_at)}</p>
                                </div>
                                {!notif.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-white/60 mt-2 shrink-0"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
