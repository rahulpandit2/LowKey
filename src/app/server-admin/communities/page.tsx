"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminCommunitiesPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Communities</h1>
                <p className="text-zinc-500 text-sm">Manage community creation, settings, and moderation.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
                    <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Total Communities</div>
                    <div className="text-2xl font-mono text-white">128</div>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
                    <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">New (24h)</div>
                    <div className="text-2xl font-mono text-white">3</div>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
                    <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Pending Approval</div>
                    <div className="text-2xl font-mono text-white">0</div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <input type="text" placeholder="Find community..." className="bg-black border border-white/10 rounded px-3 py-1.5 text-white text-sm w-64" />
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold">Name</th>
                            <th className="px-6 py-4 font-bold">Members</th>
                            <th className="px-6 py-4 font-bold">Posts</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Design Ethics</td>
                            <td className="px-6 py-4">1,204</td>
                            <td className="px-6 py-4">8.5k</td>
                            <td className="px-6 py-4"><span className="text-green-500">Active</span></td>
                            <td className="px-6 py-4 text-zinc-500">
                                <button className="hover:text-white">Manage</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Slow Living</td>
                            <td className="px-6 py-4">892</td>
                            <td className="px-6 py-4">3.2k</td>
                            <td className="px-6 py-4"><span className="text-green-500">Active</span></td>
                            <td className="px-6 py-4 text-zinc-500">
                                <button className="hover:text-white">Manage</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
