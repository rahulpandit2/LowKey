'use client';

import { useState, useEffect, useCallback } from 'react';

type LogEntry = {
    id: string;
    action_type: string;
    target_type: string | null;
    target_id: string | null;
    reason: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    actor: string;        // username or 'system' or 'anonymous'
    metadata: Record<string, unknown> | null;
};

type Tab = 'all' | 'login_attempts' | 'admin_actions';

function fmt(date: string) {
    return new Date(date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

function StatusBadge({ success }: { success: boolean }) {
    return (
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium ${success
            ? 'text-green-400 bg-green-500/10'
            : 'text-red-400 bg-red-500/10'
            }`}>
            {success ? 'Success' : 'Failed'}
        </span>
    );
}

function GeoTag({ geo }: { geo?: { city: string; country: string; region: string } | null }) {
    if (!geo) return <span className="text-zinc-700">—</span>;
    const parts = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    return <span className="text-zinc-500 text-xs">{parts || '—'}</span>;
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [tab, setTab] = useState<Tab>('login_attempts');
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), tab });
        fetch(`/api/server-admin/logs?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) {
                    setLogs(d.data.logs);
                    setTotal(d.data.total);
                    setPages(d.data.pages);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, tab]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const tabs: { id: Tab; label: string }[] = [
        { id: 'login_attempts', label: 'Login Attempts' },
        { id: 'admin_actions', label: 'Admin Actions' },
        { id: 'all', label: 'All Events' },
    ];

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Audit Trail</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Logs</h1>
                    <span className="text-zinc-500 text-sm">{total.toLocaleString()} entries</span>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.08]">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-5 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors ${tab === t.id ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Login Attempts Table */}
            {tab === 'login_attempts' && (
                <div className="border border-white/[0.05] overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-white/[0.05]">
                            <tr className="text-[10px] uppercase tracking-widest text-zinc-600">
                                <th className="px-4 py-3 font-normal whitespace-nowrap">Time</th>
                                <th className="px-4 py-3 font-normal">Status</th>
                                <th className="px-4 py-3 font-normal">Type</th>
                                <th className="px-4 py-3 font-normal">User</th>
                                <th className="px-4 py-3 font-normal">IP Address</th>
                                <th className="px-4 py-3 font-normal hidden md:table-cell">Location</th>
                                <th className="px-4 py-3 font-normal hidden lg:table-cell">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-white/[0.03] animate-pulse" /></td></tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-600 text-sm">No login attempts recorded yet</td></tr>
                            ) : logs.map((l) => {
                                const meta = l.metadata || {};
                                const success = meta.success === true;
                                const geo = meta.geo as { city: string; country: string; region: string } | null | undefined;
                                const identifier = (meta.identifier as string) || l.actor;
                                const loginType = (meta.login_type as string) || 'user';
                                const failureReason = meta.failure_reason as string | undefined;
                                return (
                                    <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-zinc-600 text-xs whitespace-nowrap">{fmt(l.created_at)}</td>
                                        <td className="px-4 py-3"><StatusBadge success={success} /></td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${loginType === 'admin'
                                                ? 'text-purple-400 bg-purple-500/10'
                                                : 'text-blue-400 bg-blue-500/10'}`}>
                                                {loginType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400 text-xs">{identifier || '—'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.ip_address || '—'}</td>
                                        <td className="px-4 py-3 hidden md:table-cell"><GeoTag geo={geo} /></td>
                                        <td className="px-4 py-3 text-zinc-600 text-xs hidden lg:table-cell">{failureReason?.replace(/_/g, ' ') || '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Admin Actions & All Events Table */}
            {(tab === 'admin_actions' || tab === 'all') && (
                <div className="border border-white/[0.05] overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-white/[0.05]">
                            <tr className="text-[10px] uppercase tracking-widest text-zinc-600">
                                <th className="px-4 py-3 font-normal whitespace-nowrap">Time</th>
                                <th className="px-4 py-3 font-normal">Actor</th>
                                <th className="px-4 py-3 font-normal">Action</th>
                                <th className="px-4 py-3 font-normal">Target</th>
                                <th className="px-4 py-3 font-normal hidden md:table-cell">IP</th>
                                <th className="px-4 py-3 font-normal hidden lg:table-cell">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-white/[0.03] animate-pulse" /></td></tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-600 text-sm">No logs found</td></tr>
                            ) : logs.map((l) => (
                                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-zinc-600 text-xs whitespace-nowrap">{fmt(l.created_at)}</td>
                                    <td className="px-4 py-3 text-zinc-400 text-xs">@{l.actor}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-300 bg-white/5 px-2 py-0.5">
                                            {l.action_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs">{l.target_type || '—'}{l.target_id ? ` · ${l.target_id.slice(0, 8)}` : ''}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-zinc-600 hidden md:table-cell">{l.ip_address || '—'}</td>
                                    <td className="px-4 py-3 text-zinc-600 text-xs hidden lg:table-cell max-w-xs truncate">{l.reason || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
