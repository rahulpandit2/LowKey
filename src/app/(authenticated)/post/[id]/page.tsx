'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type PostDetailData = {
    id: string; title: string | null; body: string;
    post_type: string; is_incognito: boolean;
    reaction_count: number; feedback_count: number;
    created_at: string; author_username: string;
    author_display_name: string | null; author_avatar_url: string | null;
};

type Feedback = {
    id: string; content: string; created_at: string;
    author_username: string; author_display_name: string | null;
};

const POST_TYPE_COLORS: Record<string, string> = {
    thought: 'text-blue-400', problem: 'text-amber-400',
    achievement: 'text-green-400', dilemma: 'text-purple-400', help: 'text-indigo-400',
};

function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<PostDetailData | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [reacted, setReacted] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');

    useEffect(() => {
        const load = async () => {
            const [postRes, fbRes] = await Promise.all([
                fetch(`/api/posts/${id}`),
                fetch(`/api/posts/${id}/feedbacks`),
            ]);
            const postData = await postRes.json();
            const fbData = await fbRes.json();
            if (postData?.data) setPost(postData.data);
            if (fbData?.data?.feedbacks) setFeedbacks(fbData.data.feedbacks);
            setLoading(false);
        };
        load().catch(() => setLoading(false));
    }, [id]);

    const toggleReact = async () => {
        if (!post) return;
        const wasReacted = reacted;
        setReacted(!wasReacted);
        setPost((p) => p ? { ...p, reaction_count: p.reaction_count + (wasReacted ? -1 : 1) } : p);
        if (wasReacted) {
            await fetch(`/api/posts/${id}/reactions?reaction=interesting`, { method: 'DELETE' });
        } else {
            await fetch(`/api/posts/${id}/reactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reaction: 'interesting' }),
            });
        }
    };

    const submitFeedback = async () => {
        if (!feedbackText.trim()) return;
        setSubmittingFeedback(true);
        setFeedbackError('');
        const res = await fetch(`/api/posts/${id}/feedbacks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: feedbackText }),
        });
        const data = await res.json();
        if (res.ok) {
            setFeedbackText('');
            setPost((p) => p ? { ...p, feedback_count: p.feedback_count + 1 } : p);
            if (data.data) setFeedbacks((prev) => [data.data, ...prev]);
        } else {
            setFeedbackError(data.error || 'Failed to post feedback');
        }
        setSubmittingFeedback(false);
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6">
                <div className="h-4 bg-white/[0.03] animate-pulse rounded w-1/4 mb-8" />
                <div className="space-y-3 mb-8">
                    <div className="h-8 bg-white/[0.04] animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-white/[0.03] animate-pulse rounded w-full" />
                    <div className="h-4 bg-white/[0.03] animate-pulse rounded w-5/6" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-2xl mx-auto py-24 px-6 text-center">
                <p className="text-zinc-600 text-sm">Post not found.</p>
                <Link href="/feed" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest mt-4 inline-block transition-colors">← Back to Feed</Link>
            </div>
        );
    }

    const initials = ((post.author_display_name || post.author_username) || '?').slice(0, 2).toUpperCase();

    return (
        <div className="max-w-2xl mx-auto py-8 px-6">
            {/* Back */}
            <Link href="/feed" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs uppercase tracking-widest mb-8 transition-colors">
                <Icon name="ArrowLeftIcon" size={14} />
                Feed
            </Link>

            {/* Post */}
            <article className="border-b border-white/[0.06] pb-8 mb-8">
                {/* Author */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        {post.is_incognito ? (
                            <Icon name="LockClosedIcon" size={14} className="text-indigo-400" />
                        ) : post.author_avatar_url ? (
                            <img src={post.author_avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                        ) : (
                            <span className="font-serif text-sm text-zinc-400">{initials}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">
                            {post.is_incognito ? 'Incognito' : (post.author_display_name || post.author_username)}
                        </p>
                        <p className="text-zinc-600 text-xs">
                            {!post.is_incognito && `@${post.author_username} · `}{timeAgo(post.created_at)}
                        </p>
                    </div>
                    {post.post_type && (
                        <span className={`ml-auto text-[10px] uppercase tracking-widest ${POST_TYPE_COLORS[post.post_type] || 'text-zinc-500'}`}>
                            {post.post_type}
                        </span>
                    )}
                </div>

                {/* Content */}
                {post.title && <h1 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-snug">{post.title}</h1>}
                <p className="text-zinc-300 leading-relaxed text-[15px] mb-8 whitespace-pre-wrap">{post.body}</p>

                {/* Actions */}
                <div className="flex items-center gap-6 text-zinc-600">
                    <button
                        onClick={toggleReact}
                        className={`flex items-center gap-2 transition-colors text-sm ${reacted ? 'text-red-400 hover:text-red-300' : 'hover:text-white'}`}
                    >
                        <Icon name="HeartIcon" size={18} />
                        <span>{post.reaction_count}</span>
                    </button>
                    <span className="flex items-center gap-2 text-sm">
                        <Icon name="ChatBubbleLeftIcon" size={18} />
                        <span>{post.feedback_count}</span>
                    </span>
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="ml-auto hover:text-white transition-colors"
                    >
                        <Icon name="ShareIcon" size={18} />
                    </button>
                </div>
            </article>

            {/* Add Feedback */}
            <section className="mb-10">
                <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Add to the discussion</h2>
                <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    placeholder="Share your perspective..."
                    className="w-full bg-transparent border border-white/[0.08] p-4 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors resize-none mb-3"
                />
                {feedbackError && <p className="text-red-400 text-xs mb-2">{feedbackError}</p>}
                <div className="flex justify-end">
                    <button
                        onClick={submitFeedback}
                        disabled={submittingFeedback || !feedbackText.trim()}
                        className="px-6 py-2.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-100 transition-colors disabled:opacity-40"
                    >
                        {submittingFeedback ? 'Posting...' : 'Reply'}
                    </button>
                </div>
            </section>

            {/* Feedbacks */}
            {feedbacks.length > 0 && (
                <section>
                    <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">Discussion ({feedbacks.length})</h2>
                    <div className="space-y-6 divide-y divide-white/[0.04]">
                        {feedbacks.map((fb) => (
                            <div key={fb.id} className="pt-6 first:pt-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <span className="font-serif text-xs text-zinc-500">
                                            {(fb.author_display_name || fb.author_username || '?').slice(0, 1).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-medium">{fb.author_display_name || fb.author_username}</p>
                                        <p className="text-zinc-600 text-xs">@{fb.author_username} · {timeAgo(fb.created_at)}</p>
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed pl-10">{fb.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
