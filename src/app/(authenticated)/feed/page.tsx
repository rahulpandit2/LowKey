'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { feed as feedApi } from '@/lib/api';

type FeedPost = {
  id: string;
  title: string | null;
  body: string;
  post_type: string;
  is_incognito: boolean;
  reaction_count: number;
  feedback_count: number;
  share_count: number;
  created_at: string;
  author_username: string;
  author_display_name: string | null;
  author_avatar_url: string | null;
  has_reacted?: boolean;
  is_bookmarked?: boolean;
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'following', label: 'Following' },
  { key: 'communities', label: 'Communities' },
  { key: 'help', label: 'Help' },
  { key: 'popular', label: 'Popular' },
];

const POST_TYPE_BADGES: Record<string, { label: string; color: string; icon: string }> = {
  thought: { label: 'Thought', color: 'text-blue-400 bg-blue-500/10', icon: 'LightBulbIcon' },
  problem: { label: 'Problem', color: 'text-amber-400 bg-amber-500/10', icon: 'QuestionMarkCircleIcon' },
  achievement: { label: 'Achievement', color: 'text-green-400 bg-green-500/10', icon: 'TrophyIcon' },
  dilemma: { label: 'Dilemma', color: 'text-purple-400 bg-purple-500/10', icon: 'ScaleIcon' },
  help: { label: 'Help', color: 'text-indigo-400 bg-indigo-500/10', icon: 'HandRaisedIcon' },
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  // Track per-post interaction state
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const loadFeed = useCallback(() => {
    setLoading(true);
    feedApi.get({ filter: activeFilter }).then((res) => {
      if (res.data) {
        setPosts((res.data as { posts: FeedPost[] }).posts || []);
      }
      setLoading(false);
    });
  }, [activeFilter]);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  // Optimistic reaction toggle
  const toggleReact = async (postId: string) => {
    const wasReacted = reacted.has(postId);
    // Optimistic UI
    setReacted((prev) => {
      const next = new Set(prev);
      wasReacted ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts((prev) => prev.map((p) => p.id === postId
      ? { ...p, reaction_count: p.reaction_count + (wasReacted ? -1 : 1) }
      : p
    ));

    // API call
    if (wasReacted) {
      await fetch(`/api/posts/${postId}/reactions?reaction=interesting`, { method: 'DELETE' });
    } else {
      await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: 'interesting' }),
      });
    }
  };

  // Optimistic bookmark toggle
  const toggleBookmark = async (postId: string) => {
    const wasBookmarked = bookmarked.has(postId);
    setBookmarked((prev) => {
      const next = new Set(prev);
      wasBookmarked ? next.delete(postId) : next.add(postId);
      return next;
    });
    await fetch(`/api/posts/${postId}/bookmarks`, {
      method: wasBookmarked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  };


  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-white/30"></div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Your Feed</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white">Home</h1>
      </header>

      {/* Filters */}
      <div className="flex gap-1 mb-10 border-b border-white/[0.08] pb-px overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${activeFilter === f.key
              ? 'text-white border-white'
              : 'text-zinc-500 border-transparent hover:text-white hover:border-white/30'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Composer Prompt */}
      <Link
        href="/post-composer"
        className="group flex items-center gap-4 border border-white/[0.05] p-6 mb-10 hover:border-white/20 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <Icon name="PencilSquareIcon" size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
        </div>
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-sm">
          Share a thought, problem, or win...
        </span>
        <Icon
          name="ArrowUpRightIcon"
          size={14}
          className="ml-auto text-zinc-600 group-hover:text-white transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>

      {/* Posts */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/[0.05] p-8 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
              <div className="h-4 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-white/[0.05] p-12 text-center">
          <Icon name="InboxIcon" size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 mb-2">Your feed is quiet</p>
          <p className="text-zinc-600 text-sm">Follow people or join communities to see posts here.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {posts.map((post) => {
            const badge = POST_TYPE_BADGES[post.post_type];
            return (
              <article key={post.id} className="border-b border-white/[0.05] py-8 group">
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-4">
                  {post.is_incognito ? (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Icon name="LockClosedIcon" size={14} className="text-indigo-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white font-medium">
                      {post.is_incognito ? 'Incognito' : post.author_display_name || post.author_username}
                    </span>
                    {!post.is_incognito && (
                      <span className="text-zinc-600">@{post.author_username}</span>
                    )}
                    <span className="text-zinc-700">·</span>
                    <span className="text-zinc-600">{timeAgo(post.created_at)}</span>
                  </div>
                  {badge && (
                    <span className={`ml-auto text-[10px] uppercase tracking-widest px-2 py-1 ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Content */}
                <Link href={`/post/${post.id}`}>
                  {post.title && (
                    <h2 className="font-serif text-xl text-white mb-2 group-hover:text-zinc-200 transition-colors">
                      {post.title}
                    </h2>
                  )}
                  <p className="text-zinc-400 leading-relaxed text-[15px] mb-6 line-clamp-4">
                    {post.body}
                  </p>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-8 text-zinc-600">
                  <button
                    onClick={() => toggleReact(post.id)}
                    className={`flex items-center gap-2 transition-colors text-xs ${reacted.has(post.id) ? 'text-red-400 hover:text-red-300' : 'hover:text-white'}`}
                  >
                    <Icon name={reacted.has(post.id) ? 'HeartIcon' : 'HeartIcon'} size={16} />
                    <span>{post.reaction_count || ''}</span>
                  </button>
                  <Link href={`/post/${post.id}`} className="flex items-center gap-2 hover:text-white transition-colors text-xs">
                    <Icon name="ChatBubbleLeftIcon" size={16} />
                    <span>{post.feedback_count || ''}</span>
                  </Link>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className={`flex items-center gap-2 transition-colors text-xs ${bookmarked.has(post.id) ? 'text-amber-400 hover:text-amber-300' : 'hover:text-white'}`}
                  >
                    <Icon name="BookmarkIcon" size={16} />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}
                    className="ml-auto hover:text-white transition-colors text-xs"
                    title="Copy link"
                  >
                    <Icon name="ShareIcon" size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
