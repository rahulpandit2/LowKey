'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Stats = {
  users: { total: number; active: number; banned: number; new_today: number; admins: number };
  posts: { total: number; today: number };
  communities: { total: number; active: number };
  reports: { total: number; pending: number };
  sessions: { active: number };
  recent_actions: { action_type: string; target_type: string; created_at: string; admin_username: string }[];
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/server-admin/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.data) setStats(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users.total.toLocaleString(), sub: `+${stats.users.new_today} today`, href: '/server-admin/users' },
    { label: 'Active Users', value: stats.users.active.toLocaleString(), sub: `${stats.users.banned} banned`, href: '/server-admin/users?filter=active' },
    { label: 'Total Posts', value: stats.posts.total.toLocaleString(), sub: `${stats.posts.today} today`, href: null },
    { label: 'Communities', value: stats.communities.total.toLocaleString(), sub: `${stats.communities.active} active`, href: '/server-admin/communities' },
    { label: 'Pending Reports', value: stats.reports.pending.toLocaleString(), sub: `${stats.reports.total} total`, href: '/server-admin/moderation' },
    { label: 'Active Sessions', value: stats.sessions.active.toLocaleString(), sub: `${stats.users.admins} admins`, href: '/server-admin/security' },
  ] : [];

  return (
    <div className="p-8">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-6 h-[1px] bg-white/20" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Administration</span>
        </div>
        <h1 className="font-serif text-3xl text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Platform-wide statistics and recent activity.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-white/[0.05] p-6 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-1/2 mb-3" />
              <div className="h-7 bg-white/5 rounded w-1/3 mb-2" />
              <div className="h-2 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map((card) => {
            const inner = (
              <div className={`border border-white/[0.05] p-6 transition-all ${card.href ? 'hover:border-white/20 cursor-pointer' : ''}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3">{card.label}</p>
                <p className="font-serif text-3xl text-white mb-1">{card.value}</p>
                <p className="text-xs text-zinc-600">{card.sub}</p>
              </div>
            );
            return card.href ? (
              <Link key={card.label} href={card.href}>{inner}</Link>
            ) : (
              <div key={card.label}>{inner}</div>
            );
          })}
        </div>
      )}

      {/* Recent Admin Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <section>
          <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">
            Recent Admin Activity
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/[0.02] animate-pulse" />)}
            </div>
          ) : (stats?.recent_actions?.length ?? 0) === 0 ? (
            <p className="text-zinc-600 text-sm py-6">No admin actions recorded yet.</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {stats?.recent_actions?.map((a, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 w-24">{a.action_type}</span>
                    <span className="text-sm text-zinc-400">
                      <span className="text-white">@{a.admin_username}</span>
                      {' acted on '}{a.target_type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600">{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/server-admin/logs" className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors mt-4 inline-block">
            View all logs →
          </Link>
        </section>

        {/* Demo Data Management */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 pb-2 border-b border-white/[0.05]">
            Demo Data
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">
              Populate the platform with sample users, communities, and posts to preview functionality.
            </p>
            <div className="flex gap-4">
              <button
                onClick={async () => {
                  if (!confirm('Insert mock demo data?')) return;
                  try {
                    const res = await fetch('/api/admin/demo-data', { method: 'POST' });
                    const json = await res.json();
                    alert(json.message || json.error);
                    if (res.ok) window.location.reload();
                  } catch (e) { alert('Failed to insert demo data'); }
                }}
                className="px-4 py-2 bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                Insert Demo Data
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Delete all demo data? This action cannot be undone.')) return;
                  try {
                    const res = await fetch('/api/admin/demo-data', { method: 'DELETE' });
                    const json = await res.json();
                    alert(json.message || json.error);
                    if (res.ok) window.location.reload();
                  } catch (e) { alert('Failed to purge demo data'); }
                }}
                className="px-4 py-2 border border-red-500/50 text-red-500 text-sm hover:bg-red-500/10 transition-colors"
              >
                Purge Demo Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
