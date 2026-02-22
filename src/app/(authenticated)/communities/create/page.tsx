'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const CATEGORIES = [
    'Technology', 'Design', 'Philosophy', 'Science', 'Art',
    'Writing', 'Health', 'Business', 'Education', 'Other',
];

export default function CreateCommunityPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        handle: '', name: '', description: '', visibility: 'public',
        join_type: 'open', category: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleHandleChange = (val: string) => {
        setForm((f) => ({ ...f, handle: val.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-') }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.handle || !form.name) { setError('Handle and name are required.'); return; }
        setLoading(true);
        setError('');

        const res = await fetch('/api/communities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();

        if (res.ok && data.data?.handle) {
            router.push(`/communities/${data.data.handle}`);
        } else {
            setError(data.error || 'Failed to create community. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-16 px-6">
            {/* Back */}
            <Link href="/my-communities" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs uppercase tracking-widest mb-10 transition-colors">
                <Icon name="ArrowLeftIcon" size={14} />
                Communities
            </Link>

            <header className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">New Community</span>
                </div>
                <h1 className="font-serif text-3xl text-white">Create a Space</h1>
                <p className="text-zinc-500 text-sm mt-2">A focused place for thoughtful discussion.</p>
            </header>

            {error && <div className="p-4 border border-red-500/20 text-red-400 text-sm mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Community Name *</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                            setForm((f) => ({ ...f, name: e.target.value }));
                            if (!form.handle) handleHandleChange(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }}
                        maxLength={80}
                        required
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-zinc-700"
                        placeholder="e.g. Design Philosophy"
                    />
                </div>

                {/* Handle */}
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Handle *</label>
                    <div className="flex items-center">
                        <span className="text-zinc-600 text-sm mr-1">/</span>
                        <input
                            type="text"
                            value={form.handle}
                            onChange={(e) => handleHandleChange(e.target.value)}
                            minLength={3}
                            maxLength={50}
                            required
                            className="flex-1 bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-zinc-700"
                            placeholder="design-philosophy"
                        />
                    </div>
                    <p className="text-xs text-zinc-700 mt-1">Letters, numbers, and hyphens only. Cannot be changed later.</p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        maxLength={500}
                        rows={4}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors resize-none placeholder-zinc-700"
                        placeholder="What is this community about?"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full bg-zinc-900 border-b border-white/10 py-2 text-white text-sm focus:outline-none appearance-none"
                    >
                        <option value="">Select a category...</option>
                        {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                </div>

                {/* Visibility & Join Type */}
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Visibility</label>
                        <select
                            value={form.visibility}
                            onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}
                            className="w-full bg-zinc-900 border-b border-white/10 py-2 text-white text-sm focus:outline-none appearance-none"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Joining</label>
                        <select
                            value={form.join_type}
                            onChange={(e) => setForm((f) => ({ ...f, join_type: e.target.value }))}
                            className="w-full bg-zinc-900 border-b border-white/10 py-2 text-white text-sm focus:outline-none appearance-none"
                        >
                            <option value="open">Open (anyone can join)</option>
                            <option value="approval">Approval required</option>
                            <option value="invite">Invite only</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !form.handle || !form.name}
                    className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-100 transition-colors disabled:opacity-40"
                >
                    {loading ? 'Creating...' : 'Create Community'}
                </button>
            </form>
        </div>
    );
}
