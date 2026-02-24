'use client';


import { useState } from 'react';

export default function SendMessagePage() {
    const [form, setForm] = useState({ username: '', body: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);

        // Look up user by username
        const userRes = await fetch(`/api/users/${form.username}`);
        if (!userRes.ok) {
            setStatus({ type: 'error', message: 'User not found' });
            setSending(false);
            return;
        }
        const userData = await userRes.json();
        const recipientId = userData.data?.id;

        const res = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_id: recipientId, body: form.body }),
        });
        const data = await res.json();
        setSending(false);

        if (res.ok) {
            setStatus({ type: 'success', message: 'Message sent successfully' });
            setForm({ username: '', body: '' });
        } else {
            setStatus({ type: 'error', message: data.error || 'Failed to send message' });
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">Send Message</h1>
                <p className="text-sm text-zinc-500">Send a direct message to a user as an admin</p>
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
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Recipient Username</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors"
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Message</label>
                    <textarea
                        value={form.body}
                        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 outline-none transition-colors min-h-[180px] resize-y"
                        placeholder="Type your message..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all disabled:opacity-50"
                >
                    {sending ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}
