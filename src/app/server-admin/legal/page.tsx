'use client';

import { useState, useEffect } from 'react';

interface GdprRequest {
    id: string;
    user_id: string;
    username: string;
    email: string;
    request_type: 'data_export' | 'account_deletion' | 'data_correction' | 'access';
    status: 'pending' | 'processing' | 'fulfilled' | 'rejected';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
    data_export: 'Data Export',
    account_deletion: 'Deletion',
    data_correction: 'Data Correction',
    access: 'Data Access',
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400',
    processing: 'bg-blue-500/10 text-blue-400',
    fulfilled: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminLegalPage() {
    const [requests, setRequests] = useState<GdprRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [noteMap, setNoteMap] = useState<Record<string, string>>({});
    const [acting, setActing] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetch_ = (filter: string) => {
        setLoading(true);
        const params = new URLSearchParams({ limit: '50', offset: '0' });
        if (filter !== 'all') params.set('status', filter);
        fetch(`/api/admin/legal?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) setRequests(d.data.requests || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetch_(statusFilter); }, [statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        setActing(id);
        const res = await fetch('/api/admin/legal', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, notes: noteMap[id] || null }),
        });
        const data = await res.json();
        setActing(null);
        if (res.ok) {
            setMsg(`Marked as ${status}`);
            setExpanded(null);
            fetch_(statusFilter);
        } else {
            setMsg(data.error || 'Failed to update');
        }
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Compliance</span>
                </div>
                <h1 className="font-serif text-3xl text-white">Legal & GDPR</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage data subject requests, GDPR, and CCPA compliance actions.</p>
            </header>

            {msg && <div className="mb-4 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Filter tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.08]">
                {['all', 'pending', 'processing', 'fulfilled', 'rejected'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest border-b-2 transition-colors ${statusFilter === s ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/[0.02] animate-pulse border border-white/[0.04]" />)}
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20 border border-white/[0.04]">
                    <p className="text-zinc-500">No {statusFilter !== 'all' ? statusFilter : ''} legal requests.</p>
                    <p className="text-zinc-700 text-sm mt-2">When users submit data subject requests, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {requests.map((req) => (
                        <div key={req.id} className="border border-white/[0.06] bg-white/[0.01]">
                            <button
                                onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                                className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-white font-medium text-sm">{req.username}</h3>
                                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-zinc-500/10 text-zinc-400">
                                            {REQUEST_TYPE_LABELS[req.request_type] || req.request_type}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${STATUS_COLORS[req.status] || 'bg-zinc-500/10 text-zinc-400'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-600">{fmtDate(req.created_at)}</span>
                                </div>
                                <p className="text-xs text-zinc-500">{req.email}</p>
                            </button>

                            {expanded === req.id && (
                                <div className="border-t border-white/[0.05] p-5 bg-white/[0.02]">
                                    <div className="mb-4">
                                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Internal notes</label>
                                        <textarea
                                            value={noteMap[req.id] || req.notes || ''}
                                            onChange={(e) => setNoteMap((n) => ({ ...n, [req.id]: e.target.value }))}
                                            rows={2}
                                            className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm text-white resize-none focus:border-white/20 outline-none transition-colors"
                                            placeholder="Add notes about this request..."
                                        />
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        <button
                                            onClick={() => updateStatus(req.id, 'processing')}
                                            disabled={acting === req.id || req.status === 'processing'}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            Mark Processing
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, 'fulfilled')}
                                            disabled={acting === req.id || req.status === 'fulfilled'}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            Mark Fulfilled
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, 'rejected')}
                                            disabled={acting === req.id || req.status === 'rejected'}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Law Enforcement Section */}
            <div className="mt-12">
                <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">
                    Law Enforcement Inquiries
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                        <h3 className="text-sm text-white font-medium mb-1">Log New Inquiry</h3>
                        <p className="text-xs text-zinc-600 mb-4">Record subpoenas, preservation orders, and government data requests.</p>
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Contact legal@lowkey.com to process</p>
                    </div>
                    <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                        <h3 className="text-sm text-white font-medium mb-1">Legal Holds</h3>
                        <p className="text-xs text-zinc-600 mb-4">Accounts under legal hold will not be permanently deleted until released.</p>
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Manage via Deletion & Recovery</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
