'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrendingPost {
    id: string;
    title: string | null;
    body: string;
    post_type: string;
    reaction_count: number;
    feedback_count: number;
    author_username: string;
    is_incognito: boolean;
    created_at: string;
}

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

export default function TrendingSidebar() {
    const [posts, setPosts] = useState<TrendingPost[]>([]);
    const [mode, setMode] = useState<'trending' | 'recent'>('trending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Try trending first (last 7 days, sorted by engagement)
        fetch('/api/feed?filter=popular&limit=5')
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                const feedPosts: TrendingPost[] = d?.data?.posts || [];
                if (feedPosts.length > 0) {
                    setPosts(feedPosts);
                    setMode('trending');
                } else {
                    // Fall back to recent
                    return fetch('/api/feed?filter=all&limit=5&page=1')
                        .then((r) => r.ok ? r.json() : null)
                        .then((d2) => {
                            setPosts(d2?.data?.posts || []);
                            setMode('recent');
                        });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false))
            .finally(() => setLoading(false));
    }, []);

    return (
        <aside className="hidden lg:block w-80 sticky top-0 h-screen border-l border-white/[0.08] p-6 overflow-y-auto">
            <div className="mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-4">
                    {mode === 'trending' ? 'Trending' : 'Recent'}
                </h3>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-white/[0.03] animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-6">
                        <p className="text-zinc-600 text-xs">Nothing to show yet.</p>
                        <p className="text-zinc-700 text-[11px] mt-1">Start posting to see activity here.</p>
                    </div>
                ) : (
                    <div className="space-y-px">
                        {posts.map((post, idx) => (
                            <Link
                                key={post.id}
                                href={`/post/${post.id}`}
                                className="block py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="flex items-start gap-2.5">
                                    <span className="text-[10px] text-zinc-700 mt-0.5 w-4 shrink-0">{idx + 1}</span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                                            {post.title || post.body.slice(0, 80)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-zinc-600">
                                                {post.is_incognito ? '· incognito' : `@${post.author_username}`}
                                            </span>
                                            <span className="text-[10px] text-zinc-700">·</span>
                                            <span className="text-[10px] text-zinc-600">
                                                {(post.reaction_count + post.feedback_count) > 0
                                                    ? `${post.reaction_count + post.feedback_count} engagements`
                                                    : timeAgo(post.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Posts prompt */}
            <div className="mt-6 pt-6 border-t border-white/[0.05]">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3">Quick Post</h3>
                <Link
                    href="/post-composer"
                    className="block p-4 border border-white/[0.05] hover:border-white/20 transition-colors group"
                >
                    <p className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        Share something on your mind…
                    </p>
                </Link>
            </div>
        </aside>
    );
}
