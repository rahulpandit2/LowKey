'use client';

import { useState } from 'react';

export default function SendNotificationPage() {
    const [form, setForm] = useState({
        type: 'system',
        message: '',
        link: '',
        user_id: '',
        broadcast: false,
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);

        const payload: Record<string, unknown> = {
            type: form.type,
            message: form.message,
            link: form.link || undefined,
        };
        if (form.broadcast) {
            payload.broadcast = true;
        } else {
            // Look up user by username
            const userRes = await fetch(`/api/users/${form.user_id}`);
            if (!userRes.ok) {
                setStatus({ type: 'error', message: 'User not found' });
                setSending(false);
                return;
            }
            const userData = await userRes.json();
            payload.user_id = userData.data?.id;
        }

        const res = await fetch('/api/admin/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        setSending(false);

        if (res.ok) {
            setStatus({ type: 'success', message: `Notification sent to ${data.data?.sent || 0} user(s)` });
            setForm((f) => ({ ...f, message: '', link: '', user_id: '' }));
        } else {
            setStatus({ type: 'error', message: data.error || 'Failed to send' });
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">Send Notification</h1>
                <p className="text-sm text-zinc-500">Send system notifications to users</p>
            </div>

            {status && (
                <div className={`mb-6 p-4 border rounded-sm text-sm ${status.type === 'success'
                        ? 'border-green-500/20 bg-green-500/5 text-green-400'
                        : 'border-red-500/20 bg-red-500/5 text-red-400'
                    }`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                {/* Broadcast toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="broadcast"
                        checked={form.broadcast}
                        onChange={(e) => setForm((f) => ({ ...f, broadcast: e.target.checked }))}
                        className="accent-white"
                    />
                    <label htmlFor="broadcast" className="text-sm text-zinc-400">
                        Broadcast to all users
                    </label>
                </div>

                {!form.broadcast && (
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Username</label>
                        <input
                            type="text"
                            value={form.user_id}
                            onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
                            className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors"
                            placeholder="Enter recipient username"
                            required={!form.broadcast}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Type</label>
                    <select
                        value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        className="w-full bg-black border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors"
                    >
                        <option value="system">System</option>
                        <option value="announcement">Announcement</option>
                        <option value="alert">Alert</option>
                        <option value="achievement">Achievement</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Message</label>
                    <textarea
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors min-h-[120px] resize-y"
                        placeholder="Enter notification message..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Link (optional)</label>
                    <input
                        type="text"
                        value={form.link}
                        onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors"
                        placeholder="/feed or https://..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all disabled:opacity-50"
                >
                    {sending ? 'Sending...' : 'Send Notification'}
                </button>
            </form>
        </div>
    );
}
