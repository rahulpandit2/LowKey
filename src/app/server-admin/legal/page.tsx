'use client';

import Icon from "@/components/ui/AppIcon";

export default function AdminLegalPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Legal & Compliance</h1>
                <p className="text-zinc-500 text-sm">Handle data requests and legal hold status.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-zinc-800/50">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Data Subject Requests (GDPR/CCPA)</h3>
                    </div>
                    <div className="p-8 text-center text-zinc-500">
                        <Icon name="InboxIcon" size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No open data requests.</p>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-zinc-800/50">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Law Enforcement Inquiries</h3>
                    </div>
                    <div className="p-6">
                        <button className="w-full bg-zinc-800 border border-white/5 p-4 rounded text-left hover:bg-zinc-700 transition-colors mb-3">
                            <span className="block text-white font-medium">Log New Inquiry</span>
                            <span className="text-xs text-zinc-500">Record subpoena or preservation order details.</span>
                        </button>
                        <button className="w-full bg-zinc-800 border border-white/5 p-4 rounded text-left hover:bg-zinc-700 transition-colors">
                            <span className="block text-white font-medium">View Hold Register</span>
                            <span className="text-xs text-zinc-500">List of accounts currently under legal hold.</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
