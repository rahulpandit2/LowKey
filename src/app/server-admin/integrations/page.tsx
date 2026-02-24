'use client';

import Icon from "@/components/ui/AppIcon";

export default function AdminIntegrationsPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
                <p className="text-zinc-500 text-sm">Manage third-party connections and webhooks.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Icon name="CloudIcon" size={20} className="text-black" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">AWS S3 Storage</h3>
                            <p className="text-green-500 text-xs font-bold uppercase">Connected</p>
                        </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">Used for storing user uploads and backups.</p>
                    <button className="w-full bg-zinc-800 text-white py-2 rounded text-sm font-bold uppercase hover:bg-zinc-700">Configure</button>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <Icon name="EnvelopeIcon" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">SMTP Server</h3>
                            <p className="text-green-500 text-xs font-bold uppercase">Connected</p>
                        </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">Sending transactional emails via SendGrid.</p>
                    <button className="w-full bg-zinc-800 text-white py-2 rounded text-sm font-bold uppercase hover:bg-zinc-700">Configure</button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-zinc-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Webhooks</h3>
                    <button className="text-xs bg-white text-black px-3 py-1.5 rounded font-bold uppercase">+ Add Webhook</button>
                </div>
                <div className="divide-y divide-white/5">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Slack Notifications</p>
                            <p className="text-zinc-500 text-xs">Event: user.signup | Status: Active</p>
                        </div>
                        <button className="text-zinc-400 hover:text-white">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
