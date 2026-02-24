'use client';

import Icon from "@/components/ui/AppIcon";

export default function AdminSecurityPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Security & Access</h1>
                <p className="text-zinc-500 text-sm">Manage admin access, API keys, and security logs.</p>
            </header>

            <div className="mb-8 p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
                        <Icon name="ShieldCheckIcon" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">System Status: Secure</h3>
                        <p className="text-sm text-indigo-300">Last vulnerability scan: 2 hours ago. No threats detected.</p>
                    </div>
                </div>
                <button className="text-indigo-400 hover:text-white text-sm font-medium">View Report</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-zinc-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Admin Access</h3>
                        <button className="text-xs bg-white text-black px-2 py-1 rounded font-bold uppercase">+ Add Admin</button>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="text-zinc-500 text-xs uppercase bg-black/20">
                            <tr>
                                <th className="px-4 py-2">User</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">MFA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-zinc-300">
                            <tr>
                                <td className="px-4 py-3">Rahul Pandit</td>
                                <td className="px-4 py-3"><span className="bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Super Admin</span></td>
                                <td className="px-4 py-3 text-green-500">Enabled</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Sarah J.</td>
                                <td className="px-4 py-3"><span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Moderator</span></td>
                                <td className="px-4 py-3 text-green-500">Enabled</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-zinc-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">API Keys</h3>
                        <button className="text-xs bg-white text-black px-2 py-1 rounded font-bold uppercase">+ Generate Key</button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center p-3 bg-black/50 border border-white/5 rounded">
                            <div>
                                <p className="text-white text-sm font-medium">Mobile App Prod</p>
                                <p className="text-zinc-500 text-xs">Prefix: sk_live_...</p>
                            </div>
                            <button className="text-red-500 hover:text-red-400 text-xs uppercase font-bold">Revoke</button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-black/50 border border-white/5 rounded">
                            <div>
                                <p className="text-white text-sm font-medium">Staging Server</p>
                                <p className="text-zinc-500 text-xs">Prefix: sk_test_...</p>
                            </div>
                            <button className="text-red-500 hover:text-red-400 text-xs uppercase font-bold">Revoke</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
