'use client';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const isMe = true; // Mock

  return (
    <div className="pb-20">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-white/10 relative">
        {isMe && (
          <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors">
            <Icon name="PhotoIcon" size={20} className="text-white" />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-black overflow-hidden relative group">
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-600"></div>
              {isMe && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Icon name="CameraIcon" size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-white">Rahul Pandit</h1>
              <p className="text-zinc-400">@rahulpandit</p>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <button className="px-6 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
              Edit Profile
            </button>
            <button className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
              <Icon name="ShareIcon" size={20} />
            </button>
          </div>
        </div>

        {/* Bio & Stats */}
        <div className="mb-12">
          <p className="text-zinc-300 max-w-lg leading-relaxed mb-6">
            Building the internet I want to see. Less noise, more signal. Currently working on
            LowKey.
          </p>
          <div className="flex gap-6 text-sm">
            <div className="flex gap-1">
              <span className="font-bold text-white">142</span>
              <span className="text-zinc-500">Following</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-white">8.5k</span>
              <span className="text-zinc-500">Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8">
          <button className="pb-4 text-white border-b-2 border-white font-medium">Posts</button>
          <button className="pb-4 text-zinc-500 hover:text-white transition-colors">Replies</button>
          <button className="pb-4 text-zinc-500 hover:text-white transition-colors">Media</button>
          <button className="pb-4 text-zinc-500 hover:text-white transition-colors">Likes</button>
        </div>

        {/* Content Placeholder */}
        <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
          <p className="text-zinc-500 mb-2">No posts yet</p>
          <p className="text-xs text-zinc-600">But lots of potential.</p>
        </div>
      </div>
    </div>
  );
}
