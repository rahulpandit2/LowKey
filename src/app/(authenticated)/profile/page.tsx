'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { auth as authApi } from '@/lib/api';

type ProfileData = {
  id: string; username: string; email: string;
  display_name: string | null; bio: string | null;
  location: string | null; website: string | null;
  avatar_url: string | null; following_count: number;
  follower_count: number; post_count: number;
  role: string;
};

type ProfilePost = {
  id: string; title: string | null; body: string;
  post_type: string; is_incognito: boolean;
  reaction_count: number; feedback_count: number;
  created_at: string;
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const POST_TYPE_COLORS: Record<string, string> = {
  thought: 'text-blue-400 bg-blue-500/10',
  problem: 'text-amber-400 bg-amber-500/10',
  achievement: 'text-green-400 bg-green-500/10',
  dilemma: 'text-purple-400 bg-purple-500/10',
  help: 'text-indigo-400 bg-indigo-500/10',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'reactions'>('posts');

  useEffect(() => {
    // Fetch current user, then their full profile in one call
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then(async (meData) => {
        if (!meData?.data) { setLoading(false); setPostsLoading(false); return; }
        const user = meData.data;

        // /api/users/:username returns profile + follower counts + recent_posts
        const profileRes = await fetch(`/api/users/${user.username}`);
        const profileData = await profileRes.json();
        if (profileData?.data) {
          setProfile(profileData.data);
          setPosts(profileData.data.recent_posts || []);
        } else {
          setProfile(user);
        }
        setLoading(false);
        setPostsLoading(false);
      })
      .catch(() => { setLoading(false); setPostsLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6">
        <div className="h-8 bg-white/[0.03] animate-pulse rounded w-1/3 mb-4" />
        <div className="h-4 bg-white/[0.03] animate-pulse rounded w-1/4 mb-12" />
        <div className="space-y-8">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white/[0.02] animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="py-24 px-6 text-zinc-600 text-sm">Unable to load profile.</div>;
  }

  const initials = (profile.display_name || profile.username || '?').slice(0, 2).toUpperCase();

  return (
    <div>
      {/* Profile Header */}
      <div className="border-b border-white/[0.06] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Avatar + Name */}
          <div className="flex items-end gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-white/[0.08] flex items-center justify-center shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="font-serif text-2xl text-zinc-400">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                {profile.display_name || profile.username}
                {profile.display_name && (
                  <span className="text-zinc-600 italic ml-2 text-2xl">@{profile.username}</span>
                )}
              </h1>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-zinc-400 text-[15px] leading-relaxed mb-6 max-w-xl">{profile.bio}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-zinc-600 mb-8">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <Icon name="MapPinIcon" size={12} />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
                <Icon name="LinkIcon" size={12} />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-8">
            <div>
              <p className="font-serif text-2xl text-white">{profile.post_count}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-1">Posts</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-white">{profile.follower_count}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-1">Followers</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-white">{profile.following_count}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-1">Following</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/settings" className="px-6 py-2.5 border border-white/20 hover:border-white/40 text-white text-xs uppercase tracking-[0.2em] transition-colors">
              Edit Profile
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="px-6 py-2.5 border border-white/[0.08] hover:border-white/20 text-zinc-500 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex gap-1">
            {(['posts', 'reactions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-xs uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {postsLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white/[0.02] animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-zinc-600 text-sm">No posts yet.</p>
            <Link href="/post-composer" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest mt-3 inline-block transition-colors">
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {posts.filter(p => activeTab === 'posts' ? !p.is_incognito : true).map((post) => (
              <article key={post.id} className="py-6 group">
                <div className="flex items-center gap-3 mb-3">
                  {post.post_type && (
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${POST_TYPE_COLORS[post.post_type] || 'text-zinc-500 bg-zinc-800'}`}>
                      {post.post_type}
                    </span>
                  )}
                  <span className="text-xs text-zinc-600">{timeAgo(post.created_at)}</span>
                </div>
                <Link href={`/post/${post.id}`}>
                  {post.title && (
                    <h3 className="font-serif text-lg text-white mb-2 group-hover:text-zinc-200 transition-colors">{post.title}</h3>
                  )}
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{post.body}</p>
                </Link>
                <div className="flex items-center gap-6 mt-4 text-xs text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <Icon name="HeartIcon" size={14} />
                    {post.reaction_count || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="ChatBubbleLeftIcon" size={14} />
                    {post.feedback_count || 0}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
