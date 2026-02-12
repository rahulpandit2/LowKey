"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminUsersPage() {
    return (
        <div className="p-8">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Users & Accounts</h1>
                    <p className="text-zinc-500 text-sm">Manage user accounts, roles, and status.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded text-sm font-bold uppercase tracking-wide hover:bg-zinc-200">
                    Export CSV
                </button>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input type="text" placeholder="Search users..." className="bg-zinc-900 border border-white/10 rounded px-4 py-2 text-white text-sm w-64" />
                <select className="bg-zinc-900 border border-white/10 rounded px-4 py-2 text-white text-sm">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Moderator</option>
                    <option>User</option>
                </select>
                <select className="bg-zinc-900 border border-white/10 rounded px-4 py-2 text-white text-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Banned</option>
                </select>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Role</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Joined</th>
                            <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                        {/* Mock Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                                    <div>
                                        <p className="font-medium text-white">User {i}</p>
                                        <p className="text-xs text-zinc-500">user{i}@example.com</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">Member</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-900/30 text-green-500 rounded text-xs font-bold uppercase">Active</span></td>
                                <td className="px-6 py-4">2 days ago</td>
                                <td className="px-6 py-4 text-zinc-500">
                                    <button className="hover:text-white mr-3">Edit</button>
                                    <button className="hover:text-red-500">Suspend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
