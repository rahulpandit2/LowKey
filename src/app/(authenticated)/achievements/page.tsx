'use client';

import { useState, useEffect } from 'react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    category: string;
    milestone_value: number;
    unlocked_at?: string;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    badge_type: string;
    level: string;
    icon_url: string | null;
    is_visible: boolean;
    granted_at: string;
}

interface Transaction {
    id: string;
    points: number;
    reason: string;
    task_name: string | null;
    created_at: string;
}

export default function AchievementsPage() {
    const [totalPoints, setTotalPoints] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'points'>('achievements');

    useEffect(() => {
        fetch('/api/achievements')
            .then((r) => r.json())
            .then((data) => {
                if (data.data) {
                    setTotalPoints(data.data.totalPoints);
                    setAchievements(data.data.achievements || []);
                    setAllAchievements(data.data.allAchievements || []);
                    setBadges(data.data.badges || []);
                    setTransactions(data.data.recentTransactions || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const unlockedIds = new Set(achievements.map((a) => a.id));
    const lockedAchievements = allAchievements.filter((a) => !unlockedIds.has(a.id));

    const levelColors: Record<string, string> = {
        bronze: 'from-amber-700 to-amber-900',
        silver: 'from-zinc-400 to-zinc-600',
        gold: 'from-yellow-500 to-amber-600',
        platinum: 'from-cyan-300 to-blue-500',
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                        Your <span className="text-zinc-600 italic">Growth</span>
                    </h1>
                    <p className="text-sm text-zinc-500">Track achievements, badges, and contribution points</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="p-6 border border-white/[0.06] rounded-sm bg-white/[0.01]">
                        <p className="text-3xl font-serif text-white mb-1">{totalPoints}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Points</p>
                    </div>
                    <div className="p-6 border border-white/[0.06] rounded-sm bg-white/[0.01]">
                        <p className="text-3xl font-serif text-white mb-1">{achievements.length}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Achievements</p>
                    </div>
                    <div className="p-6 border border-white/[0.06] rounded-sm bg-white/[0.01]">
                        <p className="text-3xl font-serif text-white mb-1">{badges.length}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Badges</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 border-b border-white/[0.06]">
                    {(['achievements', 'badges', 'points'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all border-b-2 ${activeTab === tab
                                    ? 'text-white border-white'
                                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white/[0.02] rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Achievements Tab */}
                        {activeTab === 'achievements' && (
                            <div className="space-y-8">
                                {achievements.length > 0 && (
                                    <section>
                                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                                            <span className="w-6 h-[1px] bg-zinc-600" />
                                            Unlocked ({achievements.length})
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {achievements.map((a) => (
                                                <div key={a.id} className="p-5 border border-white/[0.08] rounded-sm bg-white/[0.02]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-xl">{a.icon_url || '🏆'}</span>
                                                        <div>
                                                            <h3 className="text-white font-medium">{a.name}</h3>
                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                                                {a.category || 'General'} · Milestone {a.milestone_value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-zinc-400">{a.description}</p>
                                                    {a.unlocked_at && (
                                                        <p className="text-[10px] text-zinc-600 mt-2">
                                                            Unlocked {new Date(a.unlocked_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {lockedAchievements.length > 0 && (
                                    <section>
                                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                                            <span className="w-6 h-[1px] bg-zinc-600" />
                                            Locked ({lockedAchievements.length})
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {lockedAchievements.map((a) => (
                                                <div key={a.id} className="p-5 border border-white/[0.04] rounded-sm opacity-50">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-xl grayscale">🔒</span>
                                                        <div>
                                                            <h3 className="text-zinc-400 font-medium">{a.name}</h3>
                                                            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                                                                {a.category || 'General'} · Milestone {a.milestone_value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-zinc-600">{a.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {achievements.length === 0 && lockedAchievements.length === 0 && (
                                    <div className="text-center py-16 border border-white/[0.04] rounded-sm">
                                        <p className="text-zinc-500 text-lg mb-2">No achievements yet</p>
                                        <p className="text-sm text-zinc-600">Keep contributing to unlock achievements!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Badges Tab */}
                        {activeTab === 'badges' && (
                            <div>
                                {badges.length === 0 ? (
                                    <div className="text-center py-16 border border-white/[0.04] rounded-sm">
                                        <p className="text-zinc-500 text-lg mb-2">No badges earned yet</p>
                                        <p className="text-sm text-zinc-600">Badges are earned through special contributions</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {badges.map((b) => (
                                            <div key={b.id} className="p-6 border border-white/[0.08] rounded-sm bg-white/[0.02] text-center">
                                                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${levelColors[b.level] || levelColors.bronze} flex items-center justify-center mb-4`}>
                                                    <span className="text-2xl">{b.icon_url || '🏅'}</span>
                                                </div>
                                                <h3 className="text-white font-medium mb-1">{b.name}</h3>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                                                    {b.level || b.badge_type}
                                                </p>
                                                <p className="text-xs text-zinc-400">{b.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Points Tab */}
                        {activeTab === 'points' && (
                            <div>
                                {transactions.length === 0 ? (
                                    <div className="text-center py-16 border border-white/[0.04] rounded-sm">
                                        <p className="text-zinc-500 text-lg mb-2">No point activity yet</p>
                                        <p className="text-sm text-zinc-600">Earn points by posting, giving feedback, and more</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {transactions.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between p-4 border border-white/[0.04] rounded-sm hover:bg-white/[0.01] transition-colors">
                                                <div>
                                                    <p className="text-white text-sm">{t.reason || t.task_name || 'Points earned'}</p>
                                                    <p className="text-[10px] text-zinc-600">
                                                        {new Date(t.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`text-sm font-medium ${t.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {t.points > 0 ? '+' : ''}{t.points}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
