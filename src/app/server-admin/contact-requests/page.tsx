'use client';

import { useState, useEffect } from 'react';

type ContactSubmission = {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    reason: string;
    message: string;
    consent_emails: boolean;
    status: string;
    action_note: string | null;
    created_at: string;
};

const REASON_COLORS: Record<string, string> = {
    query: 'bg-blue-500/10 text-blue-400',
    support: 'bg-amber-500/10 text-amber-400',
    feedback: 'bg-green-500/10 text-green-400',
    report: 'bg-red-500/10 text-red-400',
};

const STATUS_COLORS: Record<string, string> = {
    new: 'bg-white/10 text-white',
    replied: 'bg-green-500/10 text-green-400',
    spam: 'bg-red-500/10 text-red-400',
    closed: 'bg-zinc-500/10 text-zinc-500',
};

const STATUS_FILTERS = ['all', 'new', 'replied', 'spam', 'closed'];

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactRequestsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetchSubmissions = (status: string) => {
        setLoading(true);
        const params = new URLSearchParams({ limit: '50', offset: '0' });
        if (status !== 'all') params.set('status', status);
        fetch(`/api/admin/contact-requests?${params}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data) {
                    setSubmissions(d.data.submissions || []);
                    setTotal(d.data.total || 0);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchSubmissions(statusFilter); }, [statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        setActionLoading(id);
        const res = await fetch('/api/admin/contact-requests', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, action_note: actionNotes[id] || null }),
        });
        const data = await res.json();
        setActionLoading(null);
        if (res.ok) {
            setMsg(`Marked as ${status}`);
            fetchSubmissions(statusFilter);
            setExpanded(null);
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
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Inbox</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Contact Requests</h1>
                    <span className="text-zinc-500 text-sm">{total} submission{total !== 1 ? 's' : ''}</span>
                </div>
            </header>

            {msg && <div className="mb-4 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Status Filter */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.08]">
                {STATUS_FILTERS.map((s) => (
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
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white/[0.02] animate-pulse border border-white/[0.04]" />
                    ))}
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 border border-white/[0.04]">
                    <p className="text-zinc-500">No {statusFilter !== 'all' ? statusFilter : ''} contact submissions.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="border border-white/[0.06] bg-white/[0.01]">
                            {/* Summary Row */}
                            <button
                                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                                className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-white font-medium text-sm">
                                            {sub.first_name} {sub.last_name || ''}
                                        </h3>
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${REASON_COLORS[sub.reason] || 'bg-zinc-500/10 text-zinc-400'}`}>
                                            {sub.reason}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${STATUS_COLORS[sub.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-600">{fmtDate(sub.created_at)}</span>
                                </div>
                                <p className="text-xs text-zinc-500">{sub.email}</p>
                                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{sub.message}</p>
                            </button>

                            {/* Expanded Actions */}
                            {expanded === sub.id && (
                                <div className="border-t border-white/[0.05] p-5 bg-white/[0.02]">
                                    <p className="text-sm text-zinc-300 mb-4 leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                                    {sub.consent_emails && (
                                        <p className="text-[10px] text-green-600 uppercase tracking-wider mb-4">✓ Consented to receive email replies</p>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Internal note (optional)</label>
                                        <textarea
                                            value={actionNotes[sub.id] || ''}
                                            onChange={(e) => setActionNotes((n) => ({ ...n, [sub.id]: e.target.value }))}
                                            rows={2}
                                            className="w-full bg-transparent border border-white/[0.08] px-3 py-2 text-sm text-white resize-none focus:border-white/20 outline-none transition-colors"
                                            placeholder="Add an internal note..."
                                        />
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        <a
                                            href={`mailto:${sub.email}?subject=Re: ${sub.reason}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 bg-white text-black hover:bg-zinc-200 transition-colors"
                                        >
                                            Email reply
                                        </a>
                                        <button
                                            onClick={() => updateStatus(sub.id, 'replied')}
                                            disabled={actionLoading === sub.id}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            Mark replied
                                        </button>
                                        <button
                                            onClick={() => updateStatus(sub.id, 'closed')}
                                            disabled={actionLoading === sub.id}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 text-zinc-400 hover:bg-white/5 disabled:opacity-40 transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => updateStatus(sub.id, 'spam')}
                                            disabled={actionLoading === sub.id}
                                            className="text-[10px] uppercase tracking-widest px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            Mark spam
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
