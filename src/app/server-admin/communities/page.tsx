'use client';
import { useState, useEffect, useCallback } from 'react';

type Community = {
    id: string; name: string; handle: string; description: string | null;
    is_active: boolean; is_featured: boolean; member_count: number;
    post_count: number; created_at: string; creator_username: string;
};

export default function AdminCommunitiesPage() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetchCommunities = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), search });
        fetch(`/api/server-admin/communities?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) {
                    setCommunities(d.data.communities);
                    setTotal(d.data.total);
                    setPages(d.data.pages);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, search]);

    useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

    const doAction = async (communityId: string, action: string) => {
        setActionLoading(communityId + action);
        const res = await fetch('/api/server-admin/communities', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ community_id: communityId, action }),
        });
        const data = await res.json();
        setActionLoading(null);
        if (res.ok) { setMsg(`Community ${action}d`); fetchCommunities(); }
        else setMsg(data.error || 'Action failed');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Community Management</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Communities</h1>
                    <span className="text-zinc-500 text-sm">{total.toLocaleString()} total</span>
                </div>
            </header>

            {msg && <div className="mb-4 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search communities..."
                className="w-full max-w-sm bg-transparent border-b border-white/10 py-2 mb-6 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
            />

            <div className="border border-white/[0.05] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-white/[0.05]">
                        <tr className="text-[10px] uppercase tracking-widest text-zinc-600">
                            <th className="px-4 py-3 font-normal">Community</th>
                            <th className="px-4 py-3 font-normal hidden md:table-cell">Members</th>
                            <th className="px-4 py-3 font-normal hidden md:table-cell">Posts</th>
                            <th className="px-4 py-3 font-normal hidden lg:table-cell">Status</th>
                            <th className="px-4 py-3 font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-white/[0.03] animate-pulse rounded" /></td></tr>
                            ))
                        ) : communities.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-zinc-600 text-sm">No communities found</td></tr>
                        ) : (
                            communities.map((c) => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm">{c.name} {c.is_featured && <span className="text-[10px] text-amber-400 ml-1">★ Featured</span>}</span>
                                            <span className="text-zinc-600 text-xs">/{c.handle} · by @{c.creator_username}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{c.member_count.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{c.post_count.toLocaleString()}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${c.is_active ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <button onClick={() => doAction(c.id, c.is_featured ? 'unfeature' : 'feature')} disabled={!!(actionLoading)} className="text-xs text-amber-500 hover:text-amber-400 disabled:opacity-40 transition-colors">
                                                {c.is_featured ? 'Unfeature' : 'Feature'}
                                            </button>
                                            <button onClick={() => doAction(c.id, c.is_active ? 'deactivate' : 'activate')} disabled={!!(actionLoading)} className="text-xs text-zinc-400 hover:text-white disabled:opacity-40 transition-colors">
                                                {c.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs text-zinc-500 hover:text-white disabled:opacity-30 transition-colors">← Prev</button>
                    <span className="text-xs text-zinc-600">Page {page} of {pages}</span>
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="text-xs text-zinc-500 hover:text-white disabled:opacity-30 transition-colors">Next →</button>
                </div>
            )}
        </div>
    );
}
