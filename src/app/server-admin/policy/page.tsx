'use client';

import { useState, useEffect } from 'react';

type PolicyEntry = {
    id: string; policy_type: string; content: string; version: string;
    is_current: boolean; created_at: string; author_username: string;
};

type GroupedPolicies = Record<string, PolicyEntry[]>;

const POLICY_TYPES = ['privacy_policy', 'terms_of_service', 'community_guidelines', 'cookie_policy'];

export default function AdminPolicyPage() {
    const [policies, setPolicies] = useState<GroupedPolicies>({});
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState(POLICY_TYPES[0]);
    const [editContent, setEditContent] = useState('');
    const [version, setVersion] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchPolicies = () => {
        setLoading(true);
        fetch('/api/server-admin/policies')
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data?.policies) {
                    setPolicies(d.data.policies);
                    // Pre-fill editor with current version of first type
                    const current = d.data.policies[activeType]?.find((p: PolicyEntry) => p.is_current);
                    if (current) { setEditContent(current.content); setVersion(bump(current.version)); }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchPolicies(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // When active type changes, pre-fill content
    useEffect(() => {
        const current = policies[activeType]?.find((p) => p.is_current);
        if (current) { setEditContent(current.content); setVersion(bump(current.version)); }
        else { setEditContent(''); setVersion('1.0'); }
    }, [activeType, policies]);

    function bump(v: string) {
        const parts = v.split('.');
        const minor = parseInt(parts[1] || '0', 10) + 1;
        return `${parts[0]}.${minor}`;
    }

    const publish = async () => {
        if (!editContent.trim() || !version.trim()) return;
        setSaving(true);
        const res = await fetch('/api/server-admin/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ policy_type: activeType, content: editContent, version }),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok) { setMsg(`Published v${version}`); fetchPolicies(); }
        else setMsg(data.error || 'Failed to publish');
        setTimeout(() => setMsg(''), 4000);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Legal & Policy</span>
                </div>
                <h1 className="font-serif text-3xl text-white">Policy Editor</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage site-wide policies and publish new versions.</p>
            </header>

            {msg && <div className="mb-6 p-3 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {/* Type Tabs */}
            <div className="flex gap-1 mb-8 border-b border-white/[0.08] flex-wrap">
                {POLICY_TYPES.map((t) => {
                    const current = policies[t]?.find((p) => p.is_current);
                    return (
                        <button
                            key={t}
                            onClick={() => setActiveType(t)}
                            className={`px-4 py-2 text-xs uppercase tracking-widest border-b-2 transition-colors ${activeType === t ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-white'}`}
                        >
                            {t.replace(/_/g, ' ')}
                            {current && <span className="ml-2 text-zinc-600">v{current.version}</span>}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="h-64 bg-white/[0.02] animate-pulse" />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor */}
                    <div className="lg:col-span-2 space-y-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={20}
                            placeholder="Enter policy content..."
                            className="w-full bg-transparent border border-white/[0.08] p-4 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors resize-y font-mono"
                        />
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Version</label>
                                <input
                                    type="text"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                    placeholder="e.g. 1.2"
                                    className="w-24 bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                                />
                            </div>
                            <button
                                onClick={publish}
                                disabled={saving || !editContent.trim() || !version.trim()}
                                className="px-8 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-100 transition-colors disabled:opacity-40 self-end"
                            >
                                {saving ? 'Publishing...' : 'Publish Version'}
                            </button>
                        </div>
                    </div>

                    {/* Version History */}
                    <div>
                        <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">Version History</h3>
                        {(policies[activeType]?.length ?? 0) === 0 ? (
                            <p className="text-zinc-700 text-sm">No versions published yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {policies[activeType]?.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => { setEditContent(p.content); setVersion(bump(p.version)); }}
                                        className={`p-3 border cursor-pointer transition-all ${p.is_current ? 'border-white/20 bg-white/[0.03]' : 'border-white/[0.04] hover:border-white/15'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-white">v{p.version}</span>
                                            {p.is_current && <span className="text-[10px] text-green-400 uppercase tracking-widest">Current</span>}
                                        </div>
                                        <p className="text-xs text-zinc-600">by @{p.author_username}</p>
                                        <p className="text-xs text-zinc-700">{new Date(p.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
