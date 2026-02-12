"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminHelpPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Admin Help & Runbooks</h1>
                <p className="text-zinc-500 text-sm">Internal documentation and standard operating procedures.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <Icon name="FireIcon" size={32} className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-2">Emergency Response</h3>
                    <p className="text-zinc-400 text-sm">Procedures for outages, data breaches, and critical failures.</p>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <Icon name="UsersIcon" size={32} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-2">User Management</h3>
                    <p className="text-zinc-400 text-sm">Guides on bans, role assignments, and dispute resolution.</p>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <Icon name="ScaleIcon" size={32} className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-2">Legal Compliance</h3>
                    <p className="text-zinc-400 text-sm">Handling subpoenas, GDPR requests, and DMCA takedowns.</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-white/5 bg-zinc-800/50">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Recent Runbooks</h3>
                </div>
                <div className="divide-y divide-white/5">
                    <div className="p-4 hover:bg-white/5 flex items-center gap-3">
                        <Icon name="DocumentTextIcon" size={18} className="text-zinc-500" />
                        <a href="#" className="flex-1 text-white hover:underline text-sm">How to restore a database backup</a>
                    </div>
                    <div className="p-4 hover:bg-white/5 flex items-center gap-3">
                        <Icon name="DocumentTextIcon" size={18} className="text-zinc-500" />
                        <a href="#" className="flex-1 text-white hover:underline text-sm">Handling a mass-spam attack</a>
                    </div>
                    <div className="p-4 hover:bg-white/5 flex items-center gap-3">
                        <Icon name="DocumentTextIcon" size={18} className="text-zinc-500" />
                        <a href="#" className="flex-1 text-white hover:underline text-sm">Verifying a community admin</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
