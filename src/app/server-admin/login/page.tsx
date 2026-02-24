'use client';


import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Invalid credentials');
                return;
            }

            window.location.href = '/server-admin/overview';
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Wordmark */}
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-block">
                        <span className="font-serif text-2xl text-white tracking-tight">LowKey</span>
                    </Link>
                    <div className="w-8 h-[1px] bg-white/20 mx-auto mt-4 mb-6" />
                    <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-600">
                        Server Administration
                    </p>
                </div>

                {/* Heading */}
                <div className="mb-10">
                    <h1 className="font-serif text-4xl text-white leading-tight mb-2">
                        Admin <span className="text-zinc-600 italic">Access</span>
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Restricted to authorised server administrators only.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 border border-red-500/20 bg-red-500/[0.04]">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="admin"
                            required
                            autoFocus
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white/40 transition-colors text-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-3 text-zinc-600 hover:text-zinc-400 transition-colors text-xs uppercase tracking-wider"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!login || !password || loading}
                        className="w-full py-4 bg-white hover:bg-zinc-100 text-black text-xs uppercase tracking-[0.25em] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Verifying...' : 'Access Panel'}
                    </button>
                </form>

                {/* Footer note */}
                <div className="mt-12 pt-8 border-t border-white/[0.05]">
                    <p className="text-xs text-zinc-700 text-center leading-relaxed">
                        Unauthorised access attempts are logged and reported.
                        <br />
                        <Link href="/login" className="text-zinc-600 hover:text-zinc-400 transition-colors mt-1 inline-block">
                            Return to user login →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
