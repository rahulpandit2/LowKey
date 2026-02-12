'use client';
import Icon from '@/components/ui/AppIcon';

export default function AdminOverviewPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">System Overview</h1>
        <p className="text-zinc-500 text-sm">Real-time platform metrics.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
              Total Users
            </h3>
            <Icon name="UsersIcon" size={20} className="text-zinc-600" />
          </div>
          <p className="text-3xl font-mono text-white">8,492</p>
          <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
            <Icon name="ArrowTrendingUpIcon" size={12} />
            +12% vs last week
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
              Active Reports
            </h3>
            <Icon name="FlagIcon" size={20} className="text-red-900" />
          </div>
          <p className="text-3xl font-mono text-white">14</p>
          <p className="text-red-500 text-xs mt-2">Requires attention</p>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
              Server Load
            </h3>
            <Icon name="ServerStackIcon" size={20} className="text-zinc-600" />
          </div>
          <p className="text-3xl font-mono text-white">24%</p>
          <p className="text-zinc-500 text-xs mt-2">Healthy</p>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
              Incognito Rate
            </h3>
            <Icon name="ShieldCheckIcon" size={20} className="text-indigo-900" />
          </div>
          <p className="text-3xl font-mono text-white">68%</p>
          <p className="text-zinc-500 text-xs mt-2">Of total posts</p>
        </div>
      </div>

      {/* Moderation Queue Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Flagged Content</h2>
          <button className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest">
            View All
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-bold">Report ID</th>
                <th className="px-6 py-4 font-bold">Reason</th>
                <th className="px-6 py-4 font-bold">Severity</th>
                <th className="px-6 py-4 font-bold">Time</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-zinc-500">#REP-9281</td>
                <td className="px-6 py-4">Harassment</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-red-900/30 text-red-500 rounded text-xs font-bold uppercase">
                    High
                  </span>
                </td>
                <td className="px-6 py-4">2m ago</td>
                <td className="px-6 py-4">
                  <button className="text-white hover:underline">Review</button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-zinc-500">#REP-9280</td>
                <td className="px-6 py-4">Spam</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-500 rounded text-xs font-bold uppercase">
                    Low
                  </span>
                </td>
                <td className="px-6 py-4">15m ago</td>
                <td className="px-6 py-4">
                  <button className="text-white hover:underline">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
