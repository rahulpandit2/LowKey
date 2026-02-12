"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminMaintenancePage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">System Tools & Maintenance</h1>
                <p className="text-zinc-500 text-sm">Operational controls and health tools.</p>
            </header>

            {/* System Health */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">CPU Load</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-green-500 w-[24%]"></div>
                    </div>
                    <p className="text-white font-mono text-xl">24%</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Memory</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[60%]"></div>
                    </div>
                    <p className="text-white font-mono text-xl">60%</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Disk Usage</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-blue-500 w-[45%]"></div>
                    </div>
                    <p className="text-white font-mono text-xl">45%</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Redis Cache</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-purple-500 w-[12%]"></div>
                    </div>
                    <p className="text-white font-mono text-xl">1.2GB</p>
                </div>
            </div>

            <h3 className="text-white font-bold mb-4">Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4 text-yellow-500">
                        <Icon name="ExclamationTriangleIcon" size={24} />
                        <h4 className="font-bold text-white">Maintenance Mode</h4>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">Lock the site for all non-admin users. Useful for migrations.</p>
                    <button className="w-full border border-yellow-500 text-yellow-500 py-2 rounded font-bold uppercase text-xs hover:bg-yellow-500 hover:text-black transition-colors">
                        Enable Maintenance
                    </button>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4 text-blue-500">
                        <Icon name="ArrowPathIcon" size={24} />
                        <h4 className="font-bold text-white">Cache Control</h4>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">Purge CDN and application caches.</p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-zinc-800 text-white py-2 rounded font-bold uppercase text-xs hover:bg-zinc-700">Clear CDN</button>
                        <button className="flex-1 bg-zinc-800 text-white py-2 rounded font-bold uppercase text-xs hover:bg-zinc-700">Clear App</button>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4 text-green-500">
                        <Icon name="ServerStackIcon" size={24} />
                        <h4 className="font-bold text-white">Database Tools</h4>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">Run safe diagnostics or export snapshots.</p>
                    <button className="w-full bg-zinc-800 text-white py-2 rounded font-bold uppercase text-xs hover:bg-zinc-700">
                        Open DB Console
                    </button>
                </div>
            </div>
        </div>
    );
}
