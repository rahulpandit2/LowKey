'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type Community = {
  id: string;
  handle: string;
  name: string;
  description: string;
  member_count: number;
  is_member: boolean;
  role?: string;
};

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-communities'>('my-communities');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, [activeTab]);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'my-communities' 
        ? '/api/communities?filter=joined'
        : '/api/communities?filter=all';
      
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setCommunities(data.data?.communities || []);
      }
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-white/30"></div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                Communities
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white">Your Communities</h1>
          </div>
          <Link
            href="/communities/create"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            <Icon name="PlusIcon" size={18} />
            Create
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-10 border-b border-white/[0.08] pb-px">
        <button
          onClick={() => setActiveTab('my-communities')}
          className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === 'my-communities'
              ? 'text-white border-white'
              : 'text-zinc-500 border-transparent hover:text-white hover:border-white/30'
          }`}
        >
          My Communities
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === 'discover'
              ? 'text-white border-white'
              : 'text-zinc-500 border-transparent hover:text-white hover:border-white/30'
          }`}
        >
          Discover
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/[0.05] p-6 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="border border-white/[0.05] p-12 text-center">
          <Icon name="UserGroupIcon" size={48} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 mb-2">
            {activeTab === 'my-communities'
              ? "You haven't joined any communities yet"
              : 'No communities found'}
          </p>
          <p className="text-zinc-600 text-sm mb-6">
            {activeTab === 'my-communities'
              ? 'Discover communities to connect with like-minded people'
              : 'Be the first to create a community'}
          </p>
          {activeTab === 'my-communities' ? (
            <button
              onClick={() => setActiveTab('discover')}
              className="px-6 py-3 bg-white text-black text-sm font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              Discover Communities
            </button>
          ) : (
            <Link
              href="/communities/create"
              className="inline-block px-6 py-3 bg-white text-black text-sm font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              Create Community
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {communities.map((community) => (
            <article
              key={community.id}
              className="border-b border-white/[0.05] py-6 group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <Link
                    href={`/communities/${community.handle}`}
                    className="block mb-2 group-hover:text-zinc-200 transition-colors"
                  >
                    <h2 className="text-xl font-serif text-white mb-1">{community.name}</h2>
                    <p className="text-xs text-zinc-600 uppercase tracking-widest">
                      @{community.handle}
                    </p>
                  </Link>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-6 text-xs text-zinc-600">
                    <span className="flex items-center gap-2">
                      <Icon name="UsersIcon" size={14} />
                      {community.member_count} members
                    </span>
                    {community.role && (
                      <span className="px-2 py-1 bg-white/5 text-zinc-400 uppercase tracking-wider">
                        {community.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/communities/${community.handle}`}
                    className="px-4 py-2 border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center"
                  >
                    View
                  </Link>
                  {community.role === 'owner' || community.role === 'admin' ? (
                    <Link
                      href={`/communities/${community.handle}/admin`}
                      className="px-4 py-2 bg-white/5 text-zinc-400 text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors text-center"
                    >
                      Manage
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
