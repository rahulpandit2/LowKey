"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminModerationPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Content Moderation</h1>
                <p className="text-zinc-500 text-sm">Review reports and manage flagged content.</p>
            </header>

            <div className="flex gap-6">
                {/* Queue List */}
                <div className="w-1/3 space-y-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-red-900/30 text-red-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded">High Severity</span>
                            <span className="text-xs text-zinc-500">2m ago</span>
                        </div>
                        <h3 className="text-white font-medium text-sm mb-1">Harassment Report</h3>
                        <p className="text-zinc-500 text-xs">Reported by 3 users.</p>
                    </div>

                    <div className="bg-zinc-900 border-l-4 border-yellow-500 border-y border-r border-white/5 rounded-r-lg p-4 cursor-pointer bg-white/5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-yellow-900/30 text-yellow-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded">Medium</span>
                            <span className="text-xs text-zinc-500">15m ago</span>
                        </div>
                        <h3 className="text-white font-medium text-sm mb-1">Spam / Bot</h3>
                        <p className="text-zinc-500 text-xs">Suspicious link pattern.</p>
                    </div>
                </div>

                {/* Detail View */}
                <div className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <div className="mb-6 pb-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white mb-2">Report #9280: Spam / Bot</h2>
                        <div className="flex gap-4 text-sm text-zinc-400">
                            <span>Target: Post Component</span>
                            <span>•</span>
                            <span>Reporter: Anonymous</span>
                        </div>
                    </div>

                    <div className="bg-black border border-white/10 rounded-lg p-4 mb-6">
                        <p className="text-zinc-300 italic">"Check out this amazing crypto opportunity! Click here: http://..."</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-colors">
                            Remove Content
                        </button>
                        <button className="flex-1 bg-white/5 text-white border border-white/10 py-3 rounded font-bold uppercase text-xs hover:bg-white/10 transition-colors">
                            Dismiss
                        </button>
                        <button className="flex-1 bg-zinc-800 text-zinc-400 border border-white/5 py-3 rounded font-bold uppercase text-xs hover:text-white transition-colors">
                            Escalate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
