'use client';

import { useState, useEffect, useCallback } from 'react';

type User = {
    id: string; username: string; email: string; status: string;
    role: string; created_at: string; last_login_at: string | null;
    display_name: string | null; post_count: number; follower_count: number; is_admin: boolean;
};

const STATUS_COLORS: Record<string, string> = {
    active: 'text-green-400 bg-green-500/10',
    banned: 'text-red-400 bg-red-500/10',
    suspended: 'text-amber-400 bg-amber-500/10',
};

function timeAgo(date: string | null) {
    if (!date) return 'Never';
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetchUsers = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), search, filter });
        fetch(`/api/server-admin/users?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) {
                    setUsers(d.data.users);
                    setTotal(d.data.total);
                    setPages(d.data.pages);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, search, filter]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const doAction = async (userId: string, action: string) => {
        setActionLoading(userId);
        const res = await fetch('/api/server-admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, action }),
        });
        const data = await res.json();
        setActionLoading(null);
        if (res.ok) {
            setMsg(`User ${action}d successfully`);
            fetchUsers();
        } else {
            setMsg(data.error || 'Action failed');
        }
        setTimeout(() => setMsg(''), 3000);
    };

    const FILTERS = ['all', 'active', 'banned', 'suspended'];

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">User Management</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Users</h1>
                    <span className="text-zinc-500 text-sm">{total.toLocaleString()} total</span>
                </div>
            </header>

            {msg && <div className="mb-4 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Filters + Search */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex gap-1 border-b border-white/[0.08]">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-2 text-xs uppercase tracking-widest border-b-2 transition-colors ${filter === f ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search users..."
                    className="flex-1 min-w-48 bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="border border-white/[0.05] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-white/[0.05]">
                        <tr className="text-[10px] uppercase tracking-widest text-zinc-600">
                            <th className="px-4 py-3 font-normal">User</th>
                            <th className="px-4 py-3 font-normal hidden md:table-cell">Status</th>
                            <th className="px-4 py-3 font-normal hidden lg:table-cell">Posts</th>
                            <th className="px-4 py-3 font-normal hidden lg:table-cell">Last Login</th>
                            <th className="px-4 py-3 font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5} className="px-4 py-4">
                                        <div className="h-4 bg-white/[0.03] animate-pulse rounded" />
                                    </td>
                                </tr>
                            ))
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-zinc-600 text-sm">No users found</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm">{u.display_name || u.username}</span>
                                            <span className="text-zinc-600 text-xs">@{u.username} · {u.email}</span>
                                            {u.is_admin && <span className="text-[10px] text-amber-500 uppercase tracking-wider mt-0.5">Admin</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${STATUS_COLORS[u.status] || 'text-zinc-500'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">{u.post_count}</td>
                                    <td className="px-4 py-3 text-zinc-600 text-xs hidden lg:table-cell">{timeAgo(u.last_login_at)}</td>
                                    <td className="px-4 py-3">
                                        {u.is_admin ? (
                                            <span className="text-xs text-zinc-700">Protected</span>
                                        ) : (
                                            <div className="flex gap-3">
                                                {u.status === 'active' && (
                                                    <>
                                                        <button onClick={() => doAction(u.id, 'suspend')} disabled={actionLoading === u.id} className="text-xs text-amber-500 hover:text-amber-400 disabled:opacity-40 transition-colors">Suspend</button>
                                                        <button onClick={() => doAction(u.id, 'ban')} disabled={actionLoading === u.id} className="text-xs text-red-500 hover:text-red-400 disabled:opacity-40 transition-colors">Ban</button>
                                                    </>
                                                )}
                                                {(u.status === 'banned' || u.status === 'suspended') && (
                                                    <button onClick={() => doAction(u.id, 'restore')} disabled={actionLoading === u.id} className="text-xs text-green-500 hover:text-green-400 disabled:opacity-40 transition-colors">Restore</button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
