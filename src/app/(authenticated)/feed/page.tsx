'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { feed as feedApi } from '@/lib/api';
import ReactionPicker from '@/components/posts/ReactionPicker';
import MarkButton from '@/components/posts/MarkButton';

type ReactionKey =
  | 'me_too' | 'interesting' | 'unique' | 'loved_it'
  | 'challenged_me' | 'made_me_question' | 'relatable_struggle' | 'motivated_me';

type MarkKey = 'read_carefully' | 'saved_in_mind' | 'inspired_to_reflect';

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
  user_reaction?: ReactionKey | null;
  user_mark?: MarkKey | null;
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'following', label: 'Following' },
  { key: 'communities', label: 'Communities' },
  { key: 'help', label: 'Help' },
  { key: 'popular', label: 'Popular' },
];

// LowKey post type labels — no icon-heavy design, text-driven per brand guidelines
const POST_TYPE_LABEL: Record<string, string> = {
  thought: 'Thought',
  problem: 'Problem',
  achievement: 'Achievement',
  dilemma: 'Dilemma',
  help: 'Help',
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

  // Optimistic reaction handler
  const handleReact = (postId: string, reaction: ReactionKey | null) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const hadReaction = !!p.user_reaction;
      const gettingReaction = !!reaction;
      const countDelta = hadReaction && !gettingReaction ? -1 : !hadReaction && gettingReaction ? 1 : 0;
      return { ...p, user_reaction: reaction, reaction_count: p.reaction_count + countDelta };
    }));
  };

  // Optimistic mark handler
  const handleMark = (postId: string, mark: MarkKey | null) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, user_mark: mark } : p));
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
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
          Share a thought, problem, or win…
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
          {posts.map((post) => (
            <article key={post.id} className="border-b border-white/[0.05] py-8 group">
              {/* Meta row */}
              <div className="flex items-center gap-3 mb-4">
                {post.is_incognito ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="LockClosedIcon" size={14} className="text-indigo-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0"></div>
                )}
                <div className="flex items-center gap-2 text-xs min-w-0">
                  <span className="text-white font-medium truncate">
                    {post.is_incognito ? 'Incognito' : post.author_display_name || post.author_username}
                  </span>
                  {!post.is_incognito && (
                    <span className="text-zinc-600 flex-shrink-0">@{post.author_username}</span>
                  )}
                  <span className="text-zinc-700 flex-shrink-0">·</span>
                  <span className="text-zinc-600 flex-shrink-0">{timeAgo(post.created_at)}</span>
                </div>
                {/* Post type label — text only per brand */}
                {POST_TYPE_LABEL[post.post_type] && (
                  <span className="ml-auto text-[10px] uppercase tracking-widest text-zinc-600 flex-shrink-0">
                    {POST_TYPE_LABEL[post.post_type]}
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

              {/* Incognito note — identity is hidden */}
              {post.is_incognito && (
                <p className="text-[10px] uppercase tracking-widest text-indigo-400/60 mb-4">
                  Identity hidden — Help post
                </p>
              )}

              {/* Actions — LowKey-specific, text-driven */}
              <div className="flex items-center gap-6">
                {/* Reaction Picker — all 8 types */}
                <ReactionPicker
                  postId={post.id}
                  count={post.reaction_count}
                  userReaction={post.user_reaction}
                  onReact={handleReact}
                />

                {/* Feedback — goes to post detail */}
                <Link
                  href={`/post/${post.id}#feedback`}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <Icon name="ChatBubbleLeftIcon" size={14} />
                  <span>
                    {post.feedback_count > 0
                      ? `${post.feedback_count} feedback`
                      : 'Give feedback'}
                  </span>
                </Link>

                {/* Private mark — only visible to user */}
                <MarkButton
                  postId={post.id}
                  activeMark={post.user_mark}
                  onMark={handleMark}
                />

                {/* Share */}
                <button
                  onClick={() => handleShare(post.id)}
                  className="ml-auto text-zinc-700 hover:text-zinc-400 transition-colors"
                  title="Copy link"
                  aria-label="Copy link to post"
                >
                  <Icon name="ShareIcon" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
