'use client';

import { useState, useEffect } from 'react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    category: string;
    milestone_value: number;
    is_active: boolean;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    badge_type: string;
    level: string;
    icon_url: string | null;
    is_active: boolean;
}

interface PointTask {
    id: string;
    name: string;
    description: string;
    points: number;
    category: string;
    monthly_limit: number | null;
    daily_limit: number | null;
    is_active: boolean;
}

export default function AdminAchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [pointTasks, setPointTasks] = useState<PointTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'achievements' | 'badges' | 'point_tasks'>('achievements');
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const fetchData = () => {
        fetch('/api/admin/achievements')
            .then((r) => r.json())
            .then((data) => {
                if (data.data) {
                    setAchievements(data.data.achievements || []);
                    setBadges(data.data.badges || []);
                    setPointTasks(data.data.pointTasks || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async () => {
        setStatus(null);
        const payload: Record<string, any> = { entity_type: tab === 'point_tasks' ? 'point_task' : tab === 'badges' ? 'badge' : 'achievement', ...createForm };
        if (payload.points) payload.points = parseInt(payload.points);
        if (payload.milestone_value) payload.milestone_value = parseInt(payload.milestone_value);

        const res = await fetch('/api/admin/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            setStatus({ type: 'success', message: 'Created successfully' });
            setShowCreate(false);
            setCreateForm({});
            fetchData();
        } else {
            const data = await res.json();
            setStatus({ type: 'error', message: data.error || 'Failed to create' });
        }
    };

    const handleDeactivate = async (id: string, entityType: string) => {
        if (!confirm('Deactivate this item?')) return;
        await fetch(`/api/admin/achievements/${id}?entity_type=${entityType}`, { method: 'DELETE' });
        fetchData();
    };

    const tabLabels = { achievements: 'Achievements', badges: 'Badges', point_tasks: 'Point Tasks' };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Achievements & Rewards</h1>
                    <p className="text-sm text-zinc-500">
                        {achievements.length} achievements · {badges.length} badges · {pointTasks.length} point tasks
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-6 py-2.5 hover:bg-zinc-300 transition-all"
                >
                    {showCreate ? 'Cancel' : '+ Create'}
                </button>
            </div>

            {status && (
                <div className={`mb-4 p-3 border rounded-sm text-sm ${status.type === 'success' ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-red-500/20 bg-red-500/5 text-red-400'
                    }`}>{status.message}</div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/[0.06]">
                {(Object.keys(tabLabels) as (keyof typeof tabLabels)[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-all ${tab === t ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                            }`}
                    >
                        {tabLabels[t]}
                    </button>
                ))}
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className="mb-8 p-6 border border-white/[0.06] rounded-sm bg-white/[0.01] space-y-4">
                    <h3 className="text-white font-medium mb-2">Create {tabLabels[tab]?.slice(0, -1)}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Name *" value={createForm.name || ''} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                            className="bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none" />
                        <input placeholder="Category" value={createForm.category || ''} onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
                            className="bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none" />
                        <input placeholder="Icon (emoji or URL)" value={createForm.icon_url || ''} onChange={(e) => setCreateForm((f) => ({ ...f, icon_url: e.target.value }))}
                            className="bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none" />
                        {tab === 'achievements' && (
                            <input type="number" placeholder="Milestone Value" value={createForm.milestone_value || ''} onChange={(e) => setCreateForm((f) => ({ ...f, milestone_value: e.target.value }))}
                                className="bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none" />
                        )}
                        {tab === 'point_tasks' && (
                            <input type="number" placeholder="Points *" value={createForm.points || ''} onChange={(e) => setCreateForm((f) => ({ ...f, points: e.target.value }))}
                                className="bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none" />
                        )}
                        {tab === 'badges' && (
                            <select value={createForm.level || 'bronze'} onChange={(e) => setCreateForm((f) => ({ ...f, level: e.target.value }))}
                                className="bg-black border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none">
                                <option value="bronze">Bronze</option>
                                <option value="silver">Silver</option>
                                <option value="gold">Gold</option>
                                <option value="platinum">Platinum</option>
                            </select>
                        )}
                    </div>
                    <textarea placeholder="Description" value={createForm.description || ''} onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none min-h-[80px]" />
                    <button onClick={handleCreate}
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-6 py-2.5 hover:bg-zinc-300 transition-all">
                        Create
                    </button>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white/[0.02] rounded-sm animate-pulse border border-white/[0.04]" />)}
                </div>
            ) : (
                <div className="space-y-2">
                    {tab === 'achievements' && achievements.map((a) => (
                        <div key={a.id} className={`flex items-center justify-between p-4 border border-white/[0.06] rounded-sm ${a.is_active ? 'bg-white/[0.01]' : 'opacity-40'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{a.icon_url || '🏆'}</span>
                                <div>
                                    <h3 className="text-white text-sm font-medium">{a.name}</h3>
                                    <p className="text-[10px] text-zinc-500">{a.category} · Milestone {a.milestone_value}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDeactivate(a.id, 'achievement')} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
                                {a.is_active ? 'Deactivate' : 'Inactive'}
                            </button>
                        </div>
                    ))}
                    {tab === 'badges' && badges.map((b) => (
                        <div key={b.id} className={`flex items-center justify-between p-4 border border-white/[0.06] rounded-sm ${b.is_active ? 'bg-white/[0.01]' : 'opacity-40'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{b.icon_url || '🏅'}</span>
                                <div>
                                    <h3 className="text-white text-sm font-medium">{b.name}</h3>
                                    <p className="text-[10px] text-zinc-500">{b.badge_type} · {b.level}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDeactivate(b.id, 'badge')} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
                                {b.is_active ? 'Deactivate' : 'Inactive'}
                            </button>
                        </div>
                    ))}
                    {tab === 'point_tasks' && pointTasks.map((pt) => (
                        <div key={pt.id} className={`flex items-center justify-between p-4 border border-white/[0.06] rounded-sm ${pt.is_active ? 'bg-white/[0.01]' : 'opacity-40'}`}>
                            <div>
                                <h3 className="text-white text-sm font-medium">{pt.name}</h3>
                                <p className="text-[10px] text-zinc-500">{pt.category} · {pt.points} pts{pt.daily_limit ? ` · ${pt.daily_limit}/day` : ''}{pt.monthly_limit ? ` · ${pt.monthly_limit}/mo` : ''}</p>
                            </div>
                            <button onClick={() => handleDeactivate(pt.id, 'point_task')} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
                                {pt.is_active ? 'Deactivate' : 'Inactive'}
                            </button>
                        </div>
                    ))}
                    {tab === 'achievements' && achievements.length === 0 && <p className="text-center py-12 text-zinc-500">No achievements yet</p>}
                    {tab === 'badges' && badges.length === 0 && <p className="text-center py-12 text-zinc-500">No badges yet</p>}
                    {tab === 'point_tasks' && pointTasks.length === 0 && <p className="text-center py-12 text-zinc-500">No point tasks yet</p>}
                </div>
            )}
        </div>
    );
}
