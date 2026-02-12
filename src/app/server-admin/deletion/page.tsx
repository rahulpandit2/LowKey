"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminDeletionPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Deletion & Recovery</h1>
                <p className="text-zinc-500 text-sm">Manage account deletion requests and restoration.</p>
            </header>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden mb-8">
                <div className="p-4 border-b border-white/5 bg-zinc-800/50">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Pending Requests</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Requested</th>
                            <th className="px-6 py-4 font-bold">Grace Period Ends</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">@user123</td>
                            <td className="px-6 py-4">Oct 24, 2025</td>
                            <td className="px-6 py-4">Nov 23, 2025</td>
                            <td className="px-6 py-4"><span className="text-yellow-500">Soft Deleted</span></td>
                            <td className="px-6 py-4 text-zinc-500">
                                <button className="hover:text-green-500 mr-3">Restore</button>
                                <button className="hover:text-red-500">Purge Now</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-xl">
                <h3 className="text-red-400 font-bold mb-2">Legal Hold</h3>
                <p className="text-zinc-500 text-sm mb-4">Prevent deletion for specific accounts regardless of user request.</p>
                <div className="flex gap-2">
                    <input type="text" placeholder="Enter User ID or Email" className="bg-black border border-red-500/20 rounded px-3 py-2 text-white text-sm" />
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors text-sm font-bold uppercase">
                        Apply Hold
                    </button>
                </div>
            </div>
        </div>
    );
}
