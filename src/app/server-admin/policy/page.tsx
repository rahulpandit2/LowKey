"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminPolicyPage() {
    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Global Policy Editor</h1>
                    <p className="text-zinc-500 text-sm">Manage Terms of Service and Privacy Policy versions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded text-sm font-bold uppercase hover:text-white">Preview</button>
                    <button className="bg-white text-black px-4 py-2 rounded text-sm font-bold uppercase hover:bg-zinc-200">Publish Update</button>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Sidebar */}
                <div className="col-span-1 bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-widest mb-4">Documents</h3>
                    <div className="space-y-1 mb-8">
                        <button className="w-full text-left px-3 py-2 bg-white/10 text-white rounded font-medium text-sm">Privacy Policy</button>
                        <button className="w-full text-left px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded font-medium text-sm">Terms of Service</button>
                        <button className="w-full text-left px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded font-medium text-sm">Community Guidelines</button>
                    </div>

                    <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-widest mb-4">Version History</h3>
                    <div className="space-y-4 overflow-y-auto flex-1">
                        <div className="border-l-2 border-green-500 pl-3">
                            <p className="text-white text-sm font-medium">v2.1 (Current)</p>
                            <p className="text-xs text-zinc-500">Published Oct 12, 2025</p>
                            <p className="text-xs text-zinc-500">by Admin</p>
                        </div>
                        <div className="border-l-2 border-zinc-700 pl-3 opacity-60 hover:opacity-100 cursor-pointer">
                            <p className="text-white text-sm font-medium">v2.0</p>
                            <p className="text-xs text-zinc-500">Published Jan 1, 2025</p>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="col-span-2 bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col">
                    <div className="border-b border-white/5 pb-2 mb-4 flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded"><Icon name="BoldIcon" size={16} className="text-zinc-400" /></button>
                        <button className="p-2 hover:bg-white/5 rounded"><Icon name="ItalicIcon" size={16} className="text-zinc-400" /></button>
                        <button className="p-2 hover:bg-white/5 rounded"><Icon name="ListBulletIcon" size={16} className="text-zinc-400" /></button>
                        <button className="p-2 hover:bg-white/5 rounded"><Icon name="LinkIcon" size={16} className="text-zinc-400" /></button>
                    </div>
                    <textarea
                        className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-zinc-300 font-mono text-sm leading-relaxed"
                        defaultValue="# Privacy Policy\n\nLast updated: October 12, 2025\n\nTo Protect your privacy..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
