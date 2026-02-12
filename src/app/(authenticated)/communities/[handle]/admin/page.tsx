'use client';
import Icon from '@/components/ui/AppIcon';

export default function CommunityAdminPage({ params }: { params: { handle: string } }) {
  // Mock data
  const communityName = 'Design Ethics';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
          <Icon name="UserGroupIcon" size={32} className="text-zinc-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{communityName}</h1>
          <p className="text-zinc-500 text-sm">
            Community Admin • @{params.handle || 'design-ethics'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
          <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
            Members
          </div>
          <div className="text-2xl font-mono text-white">1,204</div>
        </div>
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
          <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
            Posts Today
          </div>
          <div className="text-2xl font-mono text-white">32</div>
        </div>
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg">
          <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
            Pending Requests
          </div>
          <div className="text-2xl font-mono text-white">5</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">General Settings</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Community Name</label>
              <input
                type="text"
                defaultValue={communityName}
                className="w-full bg-black border border-white/20 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Description</label>
              <textarea
                className="w-full h-24 bg-black border border-white/20 rounded p-2 text-white resize-none"
                defaultValue="Discussions about ethical design practices."
              ></textarea>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-white" checked />
              <label className="text-white text-sm">Require approval for new members</label>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-zinc-200">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
