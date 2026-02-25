'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { posts as postsApi } from '@/lib/api';

type OwnPost = {
    id: string;
    title: string | null;
    body: string;
    post_type: string;
    status: string;
    is_incognito: boolean;
    visibility: string;
    view_count: number;
    reaction_count: number;
    feedback_count: number;
    created_at: string;
};

const STATUS_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
    { key: 'scheduled', label: 'Scheduled' },
];

const POST_TYPE_ICONS: Record<string, string> = {
    thought: 'LightBulbIcon',
    problem: 'QuestionMarkCircleIcon',
    achievement: 'TrophyIcon',
    dilemma: 'ScaleIcon',
    help: 'HandRaisedIcon',
};

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PostManagerPage() {
    const [filter, setFilter] = useState('all');
    const [postsList, setPostsList] = useState<OwnPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPosts, setTotalPosts] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setLoading(true);
        postsApi.list({ status: filter }).then((res) => {
            if (res.data) {
                const d = res.data as { posts: OwnPost[]; pagination: { total: number } };
                setPostsList(d.posts || []);
                setTotalPosts(d.pagination?.total || 0);
            }
            setLoading(false);
        });
    }, [filter]);

    const handleDelete = (id: string) => {
        setConfirmDelete(id);
    };

    const confirmDeletePost = () => {
        if (!confirmDelete) return;
        const id = confirmDelete;
        setConfirmDelete(null);
        postsApi.delete(id).then(() => {
            setPostsList((prev) => prev.filter((p) => p.id !== id));
            setTotalPosts((n) => n - 1);
            setToast('Post deleted.');
            setTimeout(() => setToast(''), 3000);
        });
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 px-4 py-3 border border-white/20 bg-black text-white text-sm animate-fade-in shadow-xl">
                    {toast}
                </div>
            )}
            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="border border-white/10 bg-zinc-950 p-8 max-w-sm w-full mx-4">
                        <h3 className="font-serif text-xl text-white mb-2">Delete post?</h3>
                        <p className="text-zinc-500 text-sm mb-6">This cannot be undone. The post will be soft-deleted and removed from your feed.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDeletePost}
                                className="px-6 py-2.5 bg-red-900 border border-red-500/30 text-red-400 text-xs uppercase tracking-widest hover:bg-red-800 transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-6 py-2.5 border border-white/10 text-zinc-400 text-xs uppercase tracking-widest hover:text-white hover:border-white/30 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-[1px] bg-white/30"></div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Manage</span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="font-serif text-4xl md:text-5xl text-white">Post Manager</h1>
                    <Link
                        href="/post-composer"
                        className="px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-colors"
                    >
                        New Post
                    </Link>
                </div>
                <p className="text-zinc-500 text-sm mt-2">{totalPosts} total posts</p>
            </header>

            {/* Filters */}
            <div className="flex gap-1 mb-8 border-b border-white/[0.08] pb-px">
                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${filter === f.key
                            ? 'text-white border-white'
                            : 'text-zinc-500 border-transparent hover:text-white'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Posts Table */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-white/[0.05] p-6 animate-pulse">
                            <div className="h-4 bg-white/5 rounded w-1/2 mb-3"></div>
                            <div className="h-3 bg-white/5 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : postsList.length === 0 ? (
                <div className="border border-white/[0.05] p-12 text-center">
                    <Icon name="DocumentIcon" size={40} className="text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 mb-2">No posts yet</p>
                    <Link href="/post-composer" className="text-white text-sm underline">Create your first post</Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {postsList.map((post) => (
                        <div key={post.id} className="border border-white/[0.05] p-6 hover:border-white/10 transition-colors group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon name={POST_TYPE_ICONS[post.post_type] || 'DocumentIcon'} size={16} className="text-zinc-500" />
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">{post.post_type}</span>
                                        {post.is_incognito && (
                                            <span className="text-[10px] uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5">Incognito</span>
                                        )}
                                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${post.status === 'published' ? 'text-green-400 bg-green-500/10' :
                                            post.status === 'draft' ? 'text-amber-400 bg-amber-500/10' :
                                                'text-zinc-400 bg-zinc-500/10'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                    <Link href={`/post/${post.id}`}>
                                        <h3 className="text-white font-medium text-sm mb-1 group-hover:text-zinc-200 transition-colors">
                                            {post.title || post.body.substring(0, 80) + (post.body.length > 80 ? '...' : '')}
                                        </h3>
                                    </Link>
                                    <p className="text-xs text-zinc-600">{timeAgo(post.created_at)}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-zinc-600 text-xs shrink-0">
                                    <div className="text-center">
                                        <p className="text-white font-medium">{post.view_count}</p>
                                        <p className="text-[10px] uppercase tracking-widest">Views</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium">{post.reaction_count}</p>
                                        <p className="text-[10px] uppercase tracking-widest">React</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium">{post.feedback_count}</p>
                                        <p className="text-[10px] uppercase tracking-widest">Feed</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/post/${post.id}`} className="p-2 text-zinc-500 hover:text-white transition-colors">
                                        <Icon name="PencilIcon" size={14} />
                                    </Link>
                                    <button onClick={() => handleDelete(post.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                                        <Icon name="TrashIcon" size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
