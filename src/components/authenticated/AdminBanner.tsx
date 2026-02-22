'use client';

import { useEffect, useState } from 'react';

export default function AdminBanner() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (data?.data?.role === 'admin') setIsAdmin(true);
            })
            .catch(() => { });
    }, []);

    if (!isAdmin) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 border-b border-amber-500/20 py-2 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400">
                    Admin Mode — Post interactions are disabled
                </span>
            </div>
            <a
                href="/server-admin/overview"
                className="text-[10px] uppercase tracking-[0.2em] text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/20 px-3 py-1 hover:border-amber-500/40"
            >
                Admin Panel →
            </a>
        </div>
    );
}
