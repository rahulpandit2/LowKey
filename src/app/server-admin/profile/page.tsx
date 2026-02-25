'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';

type Session = {
    id: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    last_active_at: string;
    is_current: boolean;
};

type AdminUser = {
    id: string;
    username: string;
    email: string;
    display_name: string | null;
    admin_role: string;
    is_default: boolean;
};

function parseDevice(ua: string | null) {
    if (!ua) return 'Unknown Device';
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Mac OS')) return 'Mac';
    if (ua.includes('Linux')) return 'Linux PC';
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Android')) return 'Android Device';
    return 'Unknown Device';
}

function parseBrowser(ua: string | null) {
    if (!ua) return 'Unknown Browser';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    return 'Unknown Browser';
}

export default function AdminProfilePage() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');

    // Editable fields
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Session states
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/server-admin/profile')
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (data?.data) {
                    const u = data.data as AdminUser;
                    setUser(u);
                    setDisplayName(u.display_name || '');
                    setEmail(u.email);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

        fetch('/api/server-admin/profile/sessions')
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d?.data) setSessions(d.data);
                setSessionsLoading(false);
            })
            .catch(() => setSessionsLoading(false));
    }, []);

    const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
        setMsg(text);
        setMsgType(type);
        setTimeout(() => setMsg(''), 4000);
    };

    const saveProfile = async () => {
        setSaving(true);
        const res = await fetch('/api/server-admin/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ display_name: displayName, email }),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok) {
            showMsg('Profile updated.', 'ok');
        } else {
            showMsg(data.error || 'Failed to save.', 'err');
        }
    };

    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            showMsg('Passwords do not match.', 'err');
            return;
        }
        if (newPassword.length < 8) {
            showMsg('Password must be at least 8 characters.', 'err');
            return;
        }
        setSaving(true);
        const res = await fetch('/api/server-admin/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showMsg('Password changed successfully.', 'ok');
        } else {
            showMsg(data.error || 'Failed to change password.', 'err');
        }
    };

    const revokeSession = async (id: string) => {
        setSessionsLoading(true);
        const res = await fetch('/api/server-admin/profile/sessions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: id })
        });
        if (res.ok) {
            setSessions(prev => id === 'all'
                ? prev.filter(s => s.is_current)
                : prev.filter(s => s.id !== id)
            );
            showMsg('Session(s) revoked.', 'ok');
        } else {
            showMsg('Failed to revoke session.', 'err');
        }
        setSessionsLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Administration</span>
                </div>
                <h1 className="font-serif text-3xl text-white">My Profile</h1>
                {user && (
                    <p className="text-zinc-500 text-sm mt-1">
                        @{user.username} · <span className="text-zinc-600">{user.admin_role.replace('_', ' ')}</span>
                        {user.is_default && (
                            <span className="ml-2 text-[10px] uppercase tracking-widest text-amber-500/70 bg-amber-500/10 px-2 py-0.5">
                                Protected
                            </span>
                        )}
                    </p>
                )}
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

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Profile Info */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 pb-2 border-b border-white/[0.05]">
                            Profile Information
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                    Username
                                </label>
                                <p className="py-3 text-zinc-600 text-sm">
                                    @{user?.username}
                                    <span className="ml-3 text-[10px] text-zinc-700">(cannot be changed)</span>
                                </p>
                            </div>
                            <button
                                onClick={saveProfile}
                                disabled={saving}
                                className="px-8 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-100 transition-colors disabled:opacity-40"
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </section>

                    {/* Password Change */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 pb-2 border-b border-white/[0.05]">
                            Change Password
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={changePassword}
                                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                className="px-8 py-3 border border-white/10 text-white text-xs uppercase tracking-[0.2em] hover:border-white/30 transition-colors disabled:opacity-40"
                            >
                                {saving ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </section>

                    {/* Active Sessions */}
                    <section>
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.05]">
                            <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                Active Sessions
                            </h2>
                            {sessions.length > 1 && (
                                <button
                                    onClick={() => revokeSession('all')}
                                    disabled={sessionsLoading}
                                    className="text-[10px] text-red-500 hover:text-red-400 tracking-wider uppercase transition-colors disabled:opacity-50"
                                >
                                    Log out of all other devices
                                </button>
                            )}
                        </div>

                        {sessionsLoading && sessions.length === 0 ? (
                            <div className="h-20 bg-white/[0.03] animate-pulse" />
                        ) : (
                            <div className="space-y-4">
                                {sessions.map(s => (
                                    <div key={s.id} className="p-5 border border-white/5 bg-white/[0.01] flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-medium text-white">
                                                    {parseDevice(s.user_agent)} · {parseBrowser(s.user_agent)}
                                                </span>
                                                {s.is_current && (
                                                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 font-bold">
                                                        Current Session
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500">
                                                {s.ip_address || 'Unknown Location'} · Last active {new Date(s.last_active_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {!s.is_current && (
                                            <button
                                                onClick={() => revokeSession(s.id)}
                                                disabled={sessionsLoading}
                                                className="px-4 py-2 border border-white/10 text-xs text-white uppercase tracking-wider hover:bg-white/5 transition-colors disabled:opacity-50"
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Protected admin note */}
                    {user?.is_default && (
                        <section className="p-6 border border-amber-500/10 bg-amber-500/[0.03]">
                            <p className="text-xs text-amber-500/80 uppercase tracking-widest mb-2">Protected Account</p>
                            <p className="text-sm text-zinc-400">
                                This is the default server administrator account. It cannot be deleted or demoted.
                                You may update the display name, email, and password above.
                            </p>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
