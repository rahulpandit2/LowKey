'use client';

import Icon from "@/components/ui/AppIcon";

export default function AdminAutomationPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Automation & Rules</h1>
                <p className="text-zinc-500 text-sm">Configure auto-moderation and automated workflows.</p>
            </header>

            <div className="space-y-6">
                <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-zinc-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Active Rules</h3>
                        <button className="text-xs bg-white text-black px-3 py-1.5 rounded font-bold uppercase">+ New Rule</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Auto-Flag Hate Speech</p>
                                <p className="text-zinc-500 text-xs">Trigger: Keywords | Action: Hide & Report | Confidence: High</p>
                            </div>
                            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">New User Rate Limit</p>
                                <p className="text-zinc-500 text-xs">Trigger: >5 posts/min | Action: 1h Mute</p>
                            </div>
                            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between opacity-50">
                            <div>
                                <p className="text-white font-medium">Spam Link Block</p>
                                <p className="text-zinc-500 text-xs">Trigger: Regex Match | Action: Auto-Delete</p>
                            </div>
                            <div className="w-10 h-5 bg-zinc-700 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Keyword Blocklist</h3>
                    <textarea
                        className="w-full h-32 bg-black border border-white/10 rounded p-3 text-white font-mono text-sm resize-none"
                        placeholder="Enter comma-separated keywords..."
                        defaultValue="scam, free crypto, winner, click here"
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <button className="bg-zinc-800 text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-zinc-700">Update List</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
