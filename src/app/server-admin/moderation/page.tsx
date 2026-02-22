'use client';
import { useState, useEffect, useCallback } from 'react';

type Report = {
    id: string; content_type: string; content_id: string;
    reason: string; status: string; created_at: string;
    reporter_username: string; content_preview: string | null;
};

const STATUS_TABS = ['pending', 'resolved', 'dismissed'];

function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminModerationPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetchReports = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), status });
        fetch(`/api/server-admin/moderation?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) { setReports(d.data.reports); setTotal(d.data.total); setPages(d.data.pages); }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, status]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const doAction = async (reportId: string, action: string) => {
        setActionLoading(reportId + action);
        const res = await fetch('/api/server-admin/moderation', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report_id: reportId, action }),
        });
        const data = await res.json();
        setActionLoading(null);
        if (res.ok) { setMsg(`Report ${action}d`); fetchReports(); }
        else setMsg(data.error || 'Action failed');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Content Safety</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Moderation Queue</h1>
                    <span className="text-zinc-500 text-sm">{total.toLocaleString()} {status}</span>
                </div>
            </header>

            {msg && <div className="mb-4 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Status Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.08]">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => { setStatus(t); setPage(1); }}
                        className={`px-4 py-2 text-xs uppercase tracking-widest border-b-2 transition-colors ${status === t ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/[0.02] animate-pulse" />)}
                </div>
            ) : reports.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-zinc-600 text-sm">No {status} reports.</p>
                    {status === 'pending' && (
                        <p className="text-zinc-700 text-xs mt-2">The queue is clear — great sign!</p>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {reports.map((r) => (
                        <div key={r.id} className="border border-white/[0.05] p-5 hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 border border-white/10 px-2 py-0.5">{r.content_type}</span>
                                        <span className="text-xs text-zinc-600">{timeAgo(r.created_at)}</span>
                                        <span className="text-xs text-zinc-600">by @{r.reporter_username}</span>
                                    </div>
                                    <p className="text-sm text-white mb-1 font-medium">Reason: {r.reason}</p>
                                    {r.content_preview && (
                                        <p className="text-xs text-zinc-500 italic truncate">"{r.content_preview}"</p>
                                    )}
                                </div>
                                {status === 'pending' && (
                                    <div className="flex gap-3 shrink-0">
                                        <button
                                            onClick={() => doAction(r.id, 'dismiss')}
                                            disabled={actionLoading === r.id + 'dismiss'}
                                            className="text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 transition-colors disabled:opacity-40"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => doAction(r.id, 'remove_content')}
                                            disabled={actionLoading === r.id + 'remove_content'}
                                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 transition-colors disabled:opacity-40"
                                        >
                                            Remove Content
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
