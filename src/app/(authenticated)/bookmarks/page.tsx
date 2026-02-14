'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { bookmarks as bookmarksApi } from '@/lib/api';

type BookmarkItem = {
    id: string;
    post_id: string;
    note: string | null;
    tags: string[];
    created_at: string;
    title: string | null;
    body: string;
    post_type: string;
    is_incognito: boolean;
    reaction_count: number;
    feedback_count: number;
    post_created_at: string;
    author_display_name: string;
    author_username: string;
};

const MARK_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    read_carefully: { label: 'Read Carefully', icon: 'BookOpenIcon', color: 'text-blue-400 bg-blue-500/10' },
    saved_in_mind: { label: 'Saved in Mind', icon: 'SparklesIcon', color: 'text-amber-400 bg-amber-500/10' },
    inspired_to_reflect: { label: 'Inspired', icon: 'LightBulbIcon', color: 'text-purple-400 bg-purple-500/10' },
};

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default function BookmarksPage() {
    const [items, setItems] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bookmarksApi.list().then((res) => {
            if (res.data) {
                setItems((res.data as { bookmarks: BookmarkItem[] }).bookmarks || []);
            }
            setLoading(false);
        });
    }, []);

    const handleRemove = (postId: string) => {
        bookmarksApi.remove(postId).then(() => {
            setItems((prev) => prev.filter((b) => b.post_id !== postId));
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-[1px] bg-white/30"></div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Saved</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-white">Bookmarks</h1>
                <p className="text-zinc-500 text-sm mt-2">Posts you've saved for later reflection</p>
            </header>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-white/[0.05] p-6 animate-pulse">
                            <div className="h-3 bg-white/5 rounded w-1/3 mb-3"></div>
                            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="border border-white/[0.05] p-12 text-center">
                    <Icon name="BookmarkIcon" size={40} className="text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 mb-2">No saved posts</p>
                    <p className="text-zinc-600 text-sm">Bookmark posts from your feed to save them here.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item.id} className="border border-white/[0.05] p-6 hover:border-white/10 transition-colors group">
                            {/* Meta */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs text-zinc-500">
                                    {item.is_incognito ? 'Anonymous' : item.author_display_name || item.author_username}
                                </span>
                                <span className="text-zinc-700">·</span>
                                <span className="text-xs text-zinc-600">{timeAgo(item.post_created_at)}</span>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-600 ml-auto">
                                    {item.post_type}
                                </span>
                            </div>

                            {/* Content */}
                            <Link href={`/post/${item.post_id}`}>
                                {item.title && (
                                    <h3 className="font-serif text-lg text-white mb-1">{item.title}</h3>
                                )}
                                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-3">
                                    {item.body}
                                </p>
                            </Link>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-2 mb-3">
                                    {item.tags.map((tag) => {
                                        const mark = MARK_LABELS[tag];
                                        return mark ? (
                                            <span key={tag} className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${mark.color}`}>
                                                {mark.label}
                                            </span>
                                        ) : (
                                            <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-0.5 text-zinc-500 bg-zinc-800">
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Note */}
                            {item.note && (
                                <div className="border-l-2 border-white/10 pl-3 mb-3">
                                    <p className="text-xs text-zinc-500 italic">{item.note}</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-zinc-600">
                                <div className="flex gap-4">
                                    <span>{item.reaction_count} reactions</span>
                                    <span>{item.feedback_count} feedback</span>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.post_id)}
                                    className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Icon name="BookmarkSlashIcon" size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
