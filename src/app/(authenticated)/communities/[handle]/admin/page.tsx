'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CommunityStats {
    id: string;
    name: string;
    handle: string;
    description: string;
    member_count: number;
    post_count: number;
    is_active: boolean;
    created_at: string;
}

interface CommunityMember {
    id: string;
    username: string;
    display_name: string | null;
    role: string;
    joined_at: string;
}

interface CommunityPost {
    id: string;
    title: string | null;
    body: string;
    status: string;
    reaction_count: number;
    created_at: string;
    author_username: string;
}

export default function CommunityAdminPage() {
    const params = useParams();
    const handle = params?.handle as string;

    const [community, setCommunity] = useState<CommunityStats | null>(null);
    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [tab, setTab] = useState<'overview' | 'members' | 'posts'>('overview');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!handle) return;
        setLoading(true);
        fetch(`/api/communities/${handle}/admin`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) {
                    setCommunity(d.data.community || null);
                    setMembers(d.data.members || []);
                    setPosts(d.data.posts || []);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [handle]);

    const removeMember = async (userId: string) => {
        const res = await fetch(`/api/communities/${handle}/members/${userId}`, { method: 'DELETE' });
        if (res.ok) {
            setMembers((m) => m.filter((x) => x.id !== userId));
            setMsg('Member removed');
        } else {
            setMsg('Failed to remove member');
        }
        setTimeout(() => setMsg(''), 3000);
    };

    const removePost = async (postId: string) => {
        const res = await fetch(`/api/communities/${handle}/posts/${postId}`, { method: 'DELETE' });
        if (res.ok) {
            setPosts((p) => p.filter((x) => x.id !== postId));
            setMsg('Post removed from community');
        } else {
            setMsg('Failed to remove post');
        }
        setTimeout(() => setMsg(''), 3000);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/[0.03]" />)}
                </div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6 text-center">
                <p className="text-zinc-500">You don&apos;t have permission to manage this community.</p>
                <Link href="/my-communities" className="mt-4 inline-block text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                    ← Back to Communities
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <Link href={`/communities/${handle}`} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                        <Icon name="ArrowLeftIcon" size={16} />
                    </Link>
                    <div className="w-8 h-[1px] bg-white/30" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Admin</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-4xl text-white">{community.name}</h1>
                        <p className="text-zinc-500 text-sm mt-1">@{community.handle} · {community.member_count} members · {community.post_count} posts</p>
                    </div>
                    <Link
                        href={`/post-composer?community=${handle}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs uppercase tracking-wider font-semibold hover:bg-zinc-200 transition-colors"
                    >
                        <Icon name="PlusIcon" size={14} />
                        New Post
                    </Link>
                </div>
            </header>

            {msg && <div className="mb-6 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-white/[0.08]">
                {(['overview', 'members', 'posts'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors ${tab === t ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div className="space-y-6">
                    <div className="p-6 border border-white/[0.06]">
                        <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">About</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed">{community.description || 'No description set.'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-6 border border-white/[0.06] text-center">
                            <p className="font-serif text-3xl text-white">{community.member_count}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Members</p>
                        </div>
                        <div className="p-6 border border-white/[0.06] text-center">
                            <p className="font-serif text-3xl text-white">{community.post_count}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Posts</p>
                        </div>
                        <div className={`p-6 border border-white/[0.06] text-center ${community.is_active ? 'border-green-500/10' : 'border-red-500/10'}`}>
                            <p className={`text-xs uppercase tracking-widest font-medium mt-3 ${community.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                {community.is_active ? 'Active' : 'Inactive'}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Status</p>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'members' && (
                <div className="space-y-px">
                    {members.length === 0 ? (
                        <p className="text-center py-12 text-zinc-500">No members yet.</p>
                    ) : members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between py-4 border-b border-white/[0.05]">
                            <div>
                                <p className="text-sm text-white">{m.display_name || m.username}</p>
                                <p className="text-xs text-zinc-600">@{m.username} · <span className="text-zinc-500">{m.role}</span></p>
                            </div>
                            {m.role !== 'owner' && (
                                <button
                                    onClick={() => removeMember(m.id)}
                                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'posts' && (
                <div className="space-y-px">
                    {posts.length === 0 ? (
                        <p className="text-center py-12 text-zinc-500">No posts yet.</p>
                    ) : posts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-4 border-b border-white/[0.05]">
                            <div className="min-w-0 flex-1 mr-6">
                                <Link href={`/post/${p.id}`} className="text-sm text-white hover:text-zinc-300 transition-colors line-clamp-1">
                                    {p.title || p.body.slice(0, 60)}
                                </Link>
                                <p className="text-xs text-zinc-600">@{p.author_username} · {p.reaction_count} reactions · {p.status}</p>
                            </div>
                            <button
                                onClick={() => removePost(p.id)}
                                className="text-xs text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest shrink-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
