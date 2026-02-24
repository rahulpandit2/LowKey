'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type CommunityData = {
    id: string; name: string; handle: string; description: string | null;
    visibility: string; member_count: number; post_count: number;
    is_member: boolean; user_role: string | null; owner_username: string;
    rules: Array<{ id: string; title: string; description: string | null; sort_order: number }>;
    recent_members: Array<{ username: string; display_name: string | null; avatar_url: string | null; role: string }>;
};

type CommunityPost = {
    id: string; title: string | null; body: string; post_type: string;
    reaction_count: number; feedback_count: number; created_at: string;
    author_username: string; author_display_name: string | null;
};

const POST_TYPE_COLORS: Record<string, string> = {
    thought: 'text-blue-400 bg-blue-500/10', problem: 'text-amber-400 bg-amber-500/10',
    achievement: 'text-green-400 bg-green-500/10', dilemma: 'text-purple-400 bg-purple-500/10',
    help: 'text-indigo-400 bg-indigo-500/10',
};

function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

export default function CommunityPage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = use(params);
    const [community, setCommunity] = useState<CommunityData | null>(null);
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [cRes, pRes] = await Promise.all([
                fetch(`/api/communities/${handle}`),
                fetch(`/api/communities/${handle}/posts`),
            ]);
            const cData = await cRes.json();
            const pData = await pRes.json();
            if (cData?.data) setCommunity(cData.data);
            if (pData?.data?.posts) setPosts(pData.data.posts);
            setLoading(false);
        };
        load().catch(() => setLoading(false));
    }, [handle]);

    const toggleJoin = async () => {
        if (!community) return;
        setJoining(true);
        const method = community.is_member ? 'DELETE' : 'POST';
        const res = await fetch(`/api/communities/${handle}/join`, { method });
        if (res.ok) {
            setCommunity((c) => c ? {
                ...c,
                is_member: !c.is_member,
                member_count: c.member_count + (c.is_member ? -1 : 1),
            } : c);
        }
        setJoining(false);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="h-8 bg-white/[0.04] animate-pulse rounded w-1/3 mb-4" />
                <div className="h-4 bg-white/[0.03] animate-pulse rounded w-1/2" />
            </div>
        );
    }

    if (!community) {
        return (
            <div className="max-w-2xl mx-auto py-24 px-6 text-center">
                <p className="text-zinc-600 text-sm">Community not found.</p>
                <Link href="/my-communities" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest mt-4 inline-block transition-colors">← Communities</Link>
            </div>
        );
    }

    return (
        <div>
            {/* Community Header */}
            <div className="border-b border-white/[0.06] py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back */}
                    <Link href="/my-communities" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs uppercase tracking-widest mb-6 transition-colors">
                        <Icon name="ArrowLeftIcon" size={14} />
                        Communities
                    </Link>

                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">/{community.handle}</span>
                                {community.visibility !== 'public' && (
                                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 uppercase tracking-widest">Private</span>
                                )}
                            </div>
                            <h1 className="font-serif text-3xl md:text-4xl text-white mb-3">{community.name}</h1>
                            {community.description && (
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mb-4">{community.description}</p>
                            )}
                            <div className="flex gap-6 text-xs text-zinc-600">
                                <span>{community.member_count.toLocaleString()} members</span>
                                <span>{community.post_count.toLocaleString()} posts</span>
                                <span>by @{community.owner_username}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            {(community.user_role === 'owner' || community.user_role === 'admin') && (
                                <Link href={`/communities/${handle}/admin`} className="px-4 py-2.5 border border-white/[0.08] hover:border-white/20 text-zinc-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
                                    Manage
                                </Link>
                            )}
                            <button
                                onClick={toggleJoin}
                                disabled={joining || community.user_role === 'owner'}
                                className={`px-6 py-2.5 text-xs uppercase tracking-widest transition-colors disabled:opacity-40 ${community.is_member ? 'border border-white/20 hover:border-red-500/40 text-zinc-400 hover:text-red-400' : 'bg-white text-black hover:bg-zinc-100'}`}
                            >
                                {joining ? '...' : community.user_role === 'owner' ? 'Owner' : community.is_member ? 'Leave' : 'Join'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Posts Feed */}
                <div className="lg:col-span-2">
                    {posts.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-zinc-600 text-sm">No posts in this community yet.</p>
                            {community.is_member && (
                                <Link href="/post-composer" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest mt-3 inline-block transition-colors">Write the first post →</Link>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {posts.map((post) => (
                                <article key={post.id} className="py-6 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs text-zinc-500 font-medium">{post.author_display_name || post.author_username}</span>
                                        <span className="text-zinc-700">·</span>
                                        <span className="text-xs text-zinc-600">{timeAgo(post.created_at)}</span>
                                        {post.post_type && (
                                            <span className={`ml-auto text-[10px] uppercase tracking-widest px-2 py-0.5 ${POST_TYPE_COLORS[post.post_type] || 'text-zinc-600'}`}>{post.post_type}</span>
                                        )}
                                    </div>
                                    <Link href={`/post/${post.id}`}>
                                        {post.title && <h3 className="font-serif text-lg text-white mb-2 group-hover:text-zinc-200 transition-colors">{post.title}</h3>}
                                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{post.body}</p>
                                    </Link>
                                    <div className="flex items-center gap-5 mt-4 text-xs text-zinc-600">
                                        <span className="flex items-center gap-1.5"><Icon name="HeartIcon" size={13} />{post.reaction_count}</span>
                                        <span className="flex items-center gap-1.5"><Icon name="ChatBubbleLeftIcon" size={13} />{post.feedback_count}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Rules */}
                    {community.rules.length > 0 && (
                        <section>
                            <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">Community Rules</h3>
                            <ol className="space-y-3">
                                {community.rules.map((rule, idx) => (
                                    <li key={rule.id} className="flex gap-3">
                                        <span className="text-xs text-zinc-600 w-4 shrink-0">{idx + 1}.</span>
                                        <div>
                                            <p className="text-sm text-white">{rule.title}</p>
                                            {rule.description && <p className="text-xs text-zinc-600 mt-0.5">{rule.description}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {/* Recent Members */}
                    {community.recent_members.length > 0 && (
                        <section>
                            <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">Members</h3>
                            <div className="flex flex-wrap gap-2">
                                {community.recent_members.slice(0, 8).map((m) => (
                                    <div key={m.username} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] px-2 py-1">
                                        <span className="text-xs text-zinc-400">@{m.username}</span>
                                        {m.role !== 'member' && <span className="text-[10px] text-amber-400 uppercase">{m.role}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
