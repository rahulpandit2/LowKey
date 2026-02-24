'use client';

import { useState, useEffect, useCallback } from 'react';

type LogEntry = {
    id: string; action_type: string; target_type: string; target_id: string | null;
    reason: string | null; ip_address: string | null; created_at: string; admin_username: string;
};

function fmt(date: string) {
    return new Date(date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

const ACTION_TYPES = ['', 'login', 'ban', 'suspend', 'restore', 'feature', 'update', 'publish', 'delete'];

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [actionType, setActionType] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), action_type: actionType });
        fetch(`/api/server-admin/logs?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) { setLogs(d.data.logs); setTotal(d.data.total); setPages(d.data.pages); }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, actionType]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

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

            {/* Filter */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.08]">
                {ACTION_TYPES.map((t) => (
                    <button
                        key={t || 'all'}
                        onClick={() => { setActionType(t); setPage(1); }}
                        className={`px-4 py-2 text-xs uppercase tracking-widest border-b-2 transition-colors ${actionType === t ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                    >
                        {t || 'All'}
                    </button>
                ))}
            </div>

            <div className="border border-white/[0.05] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-white/[0.05]">
                        <tr className="text-[10px] uppercase tracking-widest text-zinc-600">
                            <th className="px-4 py-3 font-normal">Time</th>
                            <th className="px-4 py-3 font-normal">Admin</th>
                            <th className="px-4 py-3 font-normal">Action</th>
                            <th className="px-4 py-3 font-normal">Target</th>
                            <th className="px-4 py-3 font-normal hidden lg:table-cell">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-white/[0.03] animate-pulse rounded" /></td></tr>
                            ))
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-zinc-600 text-sm">No logs found</td></tr>
                        ) : (
                            logs.map((l) => (
                                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-zinc-600 text-xs whitespace-nowrap">{fmt(l.created_at)}</td>
                                    <td className="px-4 py-3 text-zinc-400 text-xs">@{l.admin_username}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-300 bg-white/5 px-2 py-0.5">{l.action_type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs">{l.target_type}{l.target_id ? ` #${l.target_id.slice(0, 8)}` : ''}</td>
                                    <td className="px-4 py-3 text-zinc-600 text-xs hidden lg:table-cell max-w-xs truncate">{l.reason || '—'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs text-zinc-500 hover:text-white disabled:opacity-30">← Prev</button>
                    <span className="text-xs text-zinc-600">Page {page} of {pages}</span>
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="text-xs text-zinc-500 hover:text-white disabled:opacity-30">Next →</button>
                </div>
            )}
        </div>
    );
}
