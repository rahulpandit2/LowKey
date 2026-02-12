"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminLogsPage() {
    return (
        <div className="p-8">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Audit Logs</h1>
                    <p className="text-zinc-500 text-sm">Immutable record of all admin and system actions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-zinc-800 text-white rounded text-sm hover:bg-zinc-700">Download Logs</button>
                </div>
            </header>

            {/* Search/Filter Bar */}
            <div className="bg-zinc-900 border border-white/5 p-4 rounded-t-xl flex gap-4">
                <input type="text" placeholder="Filter by User, IP, or Action..." className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm flex-1" />
                <input type="date" className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm" />
                <button className="bg-white text-black px-4 py-2 rounded font-bold uppercase text-xs">Search</button>
            </div>

            <div className="bg-zinc-900 border-x border-b border-white/5 rounded-b-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold">Timestamp</th>
                            <th className="px-6 py-4 font-bold">Actor</th>
                            <th className="px-6 py-4 font-bold">Action</th>
                            <th className="px-6 py-4 font-bold">Target</th>
                            <th className="px-6 py-4 font-bold">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300 font-mono text-xs">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-zinc-500">2026-02-12 10:42:01</td>
                            <td className="px-6 py-4 text-white">admin_rahul</td>
                            <td className="px-6 py-4"><span className="text-yellow-500">USER_SUSPEND</span></td>
                            <td className="px-6 py-4">user_8291</td>
                            <td className="px-6 py-4">192.168.1.42</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-zinc-500">2026-02-12 10:40:15</td>
                            <td className="px-6 py-4 text-white">system</td>
                            <td className="px-6 py-4"><span className="text-green-500">BACKUP_COMPLETE</span></td>
                            <td className="px-6 py-4">db_snapshot_01</td>
                            <td className="px-6 py-4">localhost</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-zinc-500">2026-02-12 10:38:00</td>
                            <td className="px-6 py-4 text-white">admin_sarah</td>
                            <td className="px-6 py-4"><span className="text-blue-400">SETTINGS_UPDATE</span></td>
                            <td className="px-6 py-4">feature_flags</td>
                            <td className="px-6 py-4">10.0.0.5</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
