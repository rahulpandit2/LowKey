'use client';

import { useState, useEffect } from 'react';

interface AdminUser {
    id: string;
    username: string;
    email: string;
    display_name: string | null;
    admin_role: string;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
    super_admin: 'bg-red-500/10 text-red-400',
    admin: 'bg-blue-500/10 text-blue-400',
    moderator: 'bg-amber-500/10 text-amber-400',
    support: 'bg-green-500/10 text-green-400',
};

export default function SubAdminsPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPromote, setShowPromote] = useState(false);
    const [promoteForm, setPromoteForm] = useState({ username: '', admin_role: 'moderator' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAdmins = () => {
        setLoading(true);
        fetch('/api/admin/sub-admins')
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (data?.data) setAdmins(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handlePromote = async () => {
        setError('');
        setSuccess('');
        if (!promoteForm.username.trim()) { setError('Username is required'); return; }

        // Look up the user by username first
        const userRes = await fetch(`/api/users/${promoteForm.username}`);
        if (!userRes.ok) { setError('User not found'); return; }
        const userData = await userRes.json();
        const userId = userData.data?.id;
        if (!userId) { setError('User not found'); return; }

        const res = await fetch('/api/admin/sub-admins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, admin_role: promoteForm.admin_role }),
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess(`${promoteForm.username} promoted to ${promoteForm.admin_role.replace('_', ' ')}`);
            setShowPromote(false);
            setPromoteForm({ username: '', admin_role: 'moderator' });
            fetchAdmins();
        } else {
            setError(data.error || 'Failed to promote user');
        }
    };

    const handleDeactivate = async (adminId: string, username: string) => {
        if (!window.confirm(`Remove admin privileges from ${username}?`)) return;
        const res = await fetch(`/api/admin/sub-admins/${adminId}`, { method: 'DELETE' });
        if (res.ok) {
            setSuccess(`${username} removed from admin`);
            fetchAdmins();
        }
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Administration</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="font-serif text-3xl text-white">Sub-Admin Management</h1>
                    <button
                        onClick={() => { setShowPromote(!showPromote); setError(''); }}
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-6 py-2.5 hover:bg-zinc-300 transition-all"
                    >
                        {showPromote ? 'Cancel' : '+ Promote User'}
                    </button>
                </div>
            </header>

            {error && (
                <div className="mb-4 p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 border border-green-500/20 bg-green-500/5 text-green-400 text-sm">
                    {success}
                </div>
            )}

            {/* Promote Form */}
            {showPromote && (
                <div className="mb-8 p-6 border border-white/[0.06] bg-white/[0.01]">
                    <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-widest">Promote User to Admin</h3>
                    <div className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-48">
                            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Username</label>
                            <input
                                type="text"
                                value={promoteForm.username}
                                onChange={(e) => setPromoteForm((p) => ({ ...p, username: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handlePromote()}
                                className="w-full bg-transparent border border-white/[0.08] px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none transition-colors"
                                placeholder="Enter exact username"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Role</label>
                            <select
                                value={promoteForm.admin_role}
                                onChange={(e) => setPromoteForm((p) => ({ ...p, admin_role: e.target.value }))}
                                className="w-full bg-black border border-white/[0.08] px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none transition-colors"
                            >
                                <option value="moderator">Moderator</option>
                                <option value="support">Support</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                        <button
                            onClick={handlePromote}
                            className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-6 py-2.5 hover:bg-zinc-300 transition-all whitespace-nowrap"
                        >
                            Promote
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-white/[0.02] animate-pulse border border-white/[0.04]" />
                    ))}
                </div>
            ) : admins.length === 0 ? (
                <div className="text-center py-20 border border-white/[0.04]">
                    <p className="text-zinc-500 mb-2">No admin users configured yet.</p>
                    <p className="text-zinc-600 text-sm">Use the promote button above to grant admin access to an existing user.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {admins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-5 border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-white font-medium">
                                    {(admin.display_name || admin.username).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">
                                        {admin.display_name || admin.username}
                                        <span className="text-zinc-500 font-normal ml-2 text-xs">@{admin.username}</span>
                                    </h3>
                                    <p className="text-xs text-zinc-600">{admin.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 ${ROLE_COLORS[admin.admin_role] || ROLE_COLORS.support}`}>
                                    {admin.admin_role.replace('_', ' ')}
                                </span>
                                {!admin.is_active && (
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-800/50 px-2 py-1">
                                        Inactive
                                    </span>
                                )}
                                <button
                                    onClick={() => handleDeactivate(admin.id, admin.username)}
                                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
