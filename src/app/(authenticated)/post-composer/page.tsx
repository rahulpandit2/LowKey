'use client';
import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function PostComposerPage() {
  const [isIncognito, setIsIncognito] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <h1 className="text-2xl font-serif font-bold text-white mb-8">Compose</h1>
      <div
        className={`border rounded-xl p-6 transition-colors duration-500 ${isIncognito ? 'bg-zinc-900 border-indigo-500/30' : 'bg-zinc-900 border-white/10'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isIncognito ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700 text-zinc-400'}`}
            >
              <Icon name={isIncognito ? 'LockClosedIcon' : 'UserIcon'} size={20} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {isIncognito ? 'Incognito' : 'Your Profile'}
              </p>
              <button
                onClick={() => setIsIncognito(!isIncognito)}
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                {isIncognito ? 'Switch to Public' : 'Switch to Incognito'}
              </button>
            </div>
          </div>
        </div>

        <textarea
          className="w-full h-40 bg-transparent border-none focus:ring-0 text-white text-lg placeholder-zinc-600 resize-none p-0 mb-6"
          placeholder={isIncognito ? 'Share something securely...' : "What's on your mind?"}
        ></textarea>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex gap-4 text-zinc-500">
            <button className="hover:text-white">
              <Icon name="PhotoIcon" size={24} />
            </button>
            <button className="hover:text-white">
              <Icon name="LinkIcon" size={24} />
            </button>
          </div>
          <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {isIncognito && (
        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-indigo-400 mt-0.5" />
          <p className="text-xs text-indigo-200 leading-relaxed">
            Your identity is hidden. Responses will be constrained to empathy. You are safe here.
          </p>
        </div>
      )}
    </div>
  );
}
