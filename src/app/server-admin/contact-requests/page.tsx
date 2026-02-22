'use client';

import { useState, useEffect } from 'react';

interface ContactSubmission {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_reason: string;
    message: string;
    consent_emails: boolean;
    created_at: string;
}

export default function ContactRequestsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/contact-requests')
            .then((r) => r.json())
            .then((data) => setSubmissions(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const reasonColors: Record<string, string> = {
        query: 'bg-blue-500/10 text-blue-400',
        support: 'bg-amber-500/10 text-amber-400',
        feedback: 'bg-green-500/10 text-green-400',
        report: 'bg-red-500/10 text-red-400',
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">Contact Requests</h1>
                <p className="text-sm text-zinc-500">
                    {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                </p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white/[0.02] rounded-sm animate-pulse border border-white/[0.04]" />
                    ))}
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 border border-white/[0.04] rounded-sm">
                    <p className="text-zinc-500">No contact submissions yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="p-5 border border-white/[0.06] rounded-sm bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-white font-medium">
                                        {sub.first_name} {sub.last_name}
                                    </h3>
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${reasonColors[sub.contact_reason] || 'bg-zinc-500/10 text-zinc-400'}`}>
                                        {sub.contact_reason}
                                    </span>
                                </div>
                                <span className="text-xs text-zinc-600">
                                    {new Date(sub.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-2">{sub.email}</p>
                            <p className="text-sm text-zinc-400 leading-relaxed">{sub.message}</p>
                            {sub.consent_emails && (
                                <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider">
                                    ✓ Consented to emails
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
