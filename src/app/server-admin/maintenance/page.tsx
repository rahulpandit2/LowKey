'use client';

import { useState, useEffect } from 'react';
import Icon from "@/components/ui/AppIcon";

type MaintenanceStats = {
    cpu_percent: number;
    memory_used_gb: string;
    memory_total_gb: string;
    memory_percent: number;
    maintenance_mode: boolean;
};

export default function AdminMaintenancePage() {
    const [stats, setStats] = useState<MaintenanceStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');

    const fetchStats = () => {
        fetch('/api/server-admin/maintenance')
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.data) setStats(d.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchStats();
        // optionally refresh every 10 seconds
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
        setMsg(text);
        setMsgType(type);
        setTimeout(() => setMsg(''), 4000);
    };

    const runAction = async (action: string, extraPayload: any = {}) => {
        if (!confirm(`Are you sure you want to run: ${action}?`)) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/server-admin/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...extraPayload })
            });
            const data = await res.json();
            if (res.ok) {
                showMsg(data.data?.message || 'Operation successful.', 'ok');
                fetchStats(); // refresh stats
            } else {
                showMsg(data.error || 'Operation failed.', 'err');
            }
        } catch {
            showMsg('Network error executing operation.', 'err');
        }
        setActionLoading(false);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">System Tools & Maintenance</h1>
                <p className="text-zinc-500 text-sm">Operational controls and health tools.</p>
            </header>

            {/* Status Message */}
            {msg && (
                <div className={`mb-6 p-4 border text-sm ${msgType === 'ok'
                    ? 'border-white/10 text-zinc-300 bg-white/[0.02]'
                    : 'border-red-500/20 text-red-400 bg-red-500/[0.04]'
                    }`}>
                    {msg}
                </div>
            )}

            {/* System Health */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">CPU Load</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${stats?.cpu_percent || 0}%` }}></div>
                    </div>
                    <p className="text-white font-mono text-xl">{stats?.cpu_percent || 0}%</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Memory Usage</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${stats?.memory_percent || 0}%` }}></div>
                    </div>
                    <p className="text-white font-mono text-xl">
                        {stats?.memory_used_gb || '0.00'} <span className="text-sm text-zinc-500">/ {stats?.memory_total_gb || '0'} GB</span>
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">PostgreSQL View</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-blue-500 w-[100%] opacity-50"></div>
                    </div>
                    <p className="text-white font-mono text-xl">Active</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Next.js Router</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-purple-500 w-[100%] opacity-50"></div>
                    </div>
                    <p className="text-white font-mono text-xl">Online</p>
                </div>
            </div>

            <h3 className="text-white font-bold mb-4">Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`border ${stats?.maintenance_mode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-zinc-900 border-white/5'} p-6 rounded-xl transition-colors flex flex-col justify-between`}>
                    <div>
                        <div className={`flex items-center gap-3 mb-4 ${stats?.maintenance_mode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                            <Icon name="ExclamationTriangleIcon" size={24} />
                            <h4 className={`font-bold ${stats?.maintenance_mode ? 'text-yellow-400' : 'text-white'}`}>Maintenance Mode</h4>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 flex-1">
                            Lock the public-facing site. Only administrators will be able to browse contents.
                        </p>
                    </div>
                    <button
                        onClick={() => runAction('toggle_maintenance', { enabled: !stats?.maintenance_mode })}
                        disabled={actionLoading || loading}
                        className={`w-full border py-2 rounded font-bold uppercase text-xs transition-colors disabled:opacity-50
                            ${stats?.maintenance_mode
                                ? 'border-yellow-500/50 bg-yellow-500 text-black hover:bg-yellow-400'
                                : 'border-zinc-500 text-zinc-300 hover:border-white hover:text-white'
                            }`}
                    >
                        {stats?.maintenance_mode ? 'Disable Maintenance' : 'Enable Maintenance'}
                    </button>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <Icon name="ArrowPathIcon" size={24} />
                            <h4 className="font-bold text-white">Cache Control</h4>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">Purge the dynamic application router layout cache globally.</p>
                    </div>
                    <button
                        onClick={() => runAction('clear_cache')}
                        disabled={actionLoading}
                        className="w-full bg-zinc-800 text-white py-2 rounded font-bold uppercase text-xs hover:bg-zinc-700 disabled:opacity-50"
                    >
                        Clear App Cache
                    </button>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-green-500">
                            <Icon name="ServerStackIcon" size={24} />
                            <h4 className="font-bold text-white">Database Tools</h4>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">Safely re-index the PostgreSQL database to improve query latency.</p>
                    </div>
                    <button
                        onClick={() => runAction('reindex_db')}
                        disabled={actionLoading}
                        className="w-full bg-zinc-800 text-white py-2 rounded font-bold uppercase text-xs hover:bg-zinc-700 disabled:opacity-50"
                    >
                        Re-index Database
                    </button>
                </div>
            </div>
        </div>
    );
}
