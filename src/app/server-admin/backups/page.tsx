'use client';

import Icon from "@/components/ui/AppIcon";

export default function AdminBackupsPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Backups & Recovery</h1>
                <p className="text-zinc-500 text-sm">Manage database snapshots and disaster recovery.</p>
            </header>

            <div className="p-6 bg-green-900/10 border border-green-500/20 rounded-xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                        <Icon name="CheckCircleIcon" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Last Backup: Successful</h3>
                        <p className="text-sm text-green-300">Completed 4 hours ago. Size: 4.2GB</p>
                    </div>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded text-sm font-bold uppercase tracking-wide hover:bg-zinc-200">
                    Run Backup Now
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold">Backup ID</th>
                            <th className="px-6 py-4 font-bold">Type</th>
                            <th className="px-6 py-4 font-bold">Size</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-mono text-zinc-500">bk_autom_2938</td>
                            <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Automated</span></td>
                            <td className="px-6 py-4">4.2 GB</td>
                            <td className="px-6 py-4">Oct 24, 02:00 UTC</td>
                            <td className="px-6 py-4 text-zinc-500">
                                <button className="hover:text-white mr-3">Restore</button>
                                <button className="hover:text-white">Download</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-mono text-zinc-500">bk_man_9102</td>
                            <td className="px-6 py-4"><span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Manual</span></td>
                            <td className="px-6 py-4">4.1 GB</td>
                            <td className="px-6 py-4">Oct 23, 14:30 UTC</td>
                            <td className="px-6 py-4 text-zinc-500">
                                <button className="hover:text-white mr-3">Restore</button>
                                <button className="hover:text-white">Download</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
