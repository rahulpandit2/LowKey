'use client';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const isMe = true; // Mock

  return (
    <main className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="py-32 px-6 md:px-12 border-b border-white/[0.08] text-center">
        <div className="max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-white/[0.08] overflow-hidden relative group">
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-600"></div>
              {isMe && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Icon name="CameraIcon" size={24} className="text-white" />
                </div>
              )}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">
            Rahul <span className="text-zinc-600 italic">Pandit</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light mb-8">@rahulpandit</p>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Building the internet I want to see. Less noise, more signal. Currently working on LowKey.
          </p>

          {/* Stats */}
          <div className="flex gap-12 justify-center mb-10">
            <div>
              <p className="text-2xl font-serif text-white">142</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Following</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-white">8.5k</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-white">56</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Posts</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button className="px-10 py-3 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all">
              Edit Profile
            </button>
            <button className="px-6 py-3 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <div className="flex gap-12 border-b border-white/[0.08] mb-12">
          <button className="pb-4 text-white border-b-2 border-white text-sm font-semibold uppercase tracking-[0.2em]">Posts</button>
          <button className="pb-4 text-zinc-500 hover:text-white text-sm font-semibold uppercase tracking-[0.2em] transition-colors">Replies</button>
          <button className="pb-4 text-zinc-500 hover:text-white text-sm font-semibold uppercase tracking-[0.2em] transition-colors">Saved</button>
        </div>

        {/* Post Cards */}
        <div className="space-y-8">
          {[1, 2, 3].map((post) => (
            <article key={post} className="border border-white/[0.05] p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">
                  {post === 1 ? 'Thought' : post === 2 ? 'Achievement' : 'Dilemma'}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-600">2 days ago</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-3 leading-tight">
                {post === 1
                  ? 'The ethics of infinite scroll patterns'
                  : post === 2
                    ? 'Shipped the first version of LowKey'
                    : 'Open source vs. funded startup'}
              </h3>
              <p className="text-zinc-400 font-light leading-relaxed mb-6">
                {post === 1
                  ? 'Just finished reading a paper on how intermittent variable rewards trigger dopamine loops. We really need to rethink how we design feed interfaces...'
                  : post === 2
                    ? 'After months of iteration, the first version is live. No ads, no metrics, no manipulation. Just honest conversation.'
                    : 'Weighing the trade-offs between building in public with community ownership vs. taking funding to move faster...'}
              </p>
              <div className="flex items-center gap-6 text-zinc-500 text-sm">
                <button className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="ChatBubbleLeftIcon" size={16} /> 12
                </button>
                <button className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="BookmarkIcon" size={16} /> Save
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
