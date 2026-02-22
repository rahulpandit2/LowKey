'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface SearchResult {
    users: Array<{ id: string; username: string; display_name: string; bio: string }>;
    posts: Array<{ id: string; body: string; post_type: string; username: string; display_name: string; created_at: string }>;
    communities: Array<{ id: string; handle: string; name: string; description: string; member_count: number }>;
}

type TabType = 'all' | 'users' | 'posts' | 'communities';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [results, setResults] = useState<SearchResult>({ users: [], posts: [], communities: [] });
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const doSearch = useCallback(async (q: string, type: TabType) => {
        if (q.length < 2) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
            const data = await res.json();
            if (data.data) setResults(data.data);
            setHasSearched(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) doSearch(query, activeTab);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, activeTab, doSearch]);

    const tabs: { id: TabType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'users', label: 'People' },
        { id: 'posts', label: 'Posts' },
        { id: 'communities', label: 'Communities' },
    ];

    const totalResults = (results.users?.length || 0) + (results.posts?.length || 0) + (results.communities?.length || 0);

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-serif text-white mb-2">Search</h1>
                    <p className="text-sm text-zinc-500">Find people, posts, and communities</p>
                </div>

                {/* Search Input */}
                <div className="relative mb-8">
                    <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for anything..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-sm pl-14 pr-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors text-lg"
                        autoFocus
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 border-b border-white/[0.06]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-white border-white'
                                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white/[0.02] rounded-sm animate-pulse border border-white/[0.04]" />
                        ))}
                    </div>
                ) : !hasSearched ? (
                    <div className="text-center py-20">
                        <Icon name="MagnifyingGlassIcon" size={40} className="text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 text-lg">Start typing to search</p>
                    </div>
                ) : totalResults === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-lg">No results found for &ldquo;{query}&rdquo;</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Users */}
                        {results.users?.length > 0 && (activeTab === 'all' || activeTab === 'users') && (
                            <section>
                                <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-zinc-600" />
                                    People ({results.users.length})
                                </h2>
                                <div className="space-y-2">
                                    {results.users.map((u) => (
                                        <Link key={u.id} href={`/profile?user=${u.username}`} className="flex items-center gap-4 p-4 border border-white/[0.04] rounded-sm hover:bg-white/[0.02] transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">
                                                {(u.display_name || u.username).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{u.display_name || u.username}</p>
                                                <p className="text-xs text-zinc-500">@{u.username}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Posts */}
                        {results.posts?.length > 0 && (activeTab === 'all' || activeTab === 'posts') && (
                            <section>
                                <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-zinc-600" />
                                    Posts ({results.posts.length})
                                </h2>
                                <div className="space-y-2">
                                    {results.posts.map((p) => (
                                        <Link key={p.id} href={`/post/${p.id}`} className="block p-5 border border-white/[0.04] rounded-sm hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-zinc-500">@{p.username}</span>
                                                <span className="text-zinc-700">·</span>
                                                <span className="text-xs text-zinc-600">{p.post_type}</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm line-clamp-2">{p.body}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Communities */}
                        {results.communities?.length > 0 && (activeTab === 'all' || activeTab === 'communities') && (
                            <section>
                                <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-zinc-600" />
                                    Communities ({results.communities.length})
                                </h2>
                                <div className="space-y-2">
                                    {results.communities.map((c) => (
                                        <Link key={c.id} href={`/communities/${c.handle}`} className="block p-5 border border-white/[0.04] rounded-sm hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{c.name}</p>
                                                    <p className="text-xs text-zinc-500">/{c.handle} · {c.member_count} members</p>
                                                </div>
                                                <Icon name="ArrowRightIcon" size={16} className="text-zinc-600" />
                                            </div>
                                            {c.description && (
                                                <p className="text-sm text-zinc-400 mt-2 line-clamp-1">{c.description}</p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
