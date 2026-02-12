import type { Metadata } from 'next';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Feed | LowKey',
  description: 'Your personalized feed.',
};

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      handle: '@sarahj',
      content:
        'Does anyone else feel like optimization culture is destroying hobbies? I used to just run. Now I have to track, measure, and improve. I miss just... running.',
      time: '2h ago',
      type: 'thought',
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      author: 'Anon User',
      handle: '@incognito',
      content:
        "I'm terrified of my promotion. I've been working for this for 3 years but now that it's here, I feel like I'm going to be exposed as a fraud.",
      time: '4h ago',
      type: 'incognito',
      likes: 156,
      comments: 42,
    },
    {
      id: 3,
      author: 'David Chen',
      handle: '@dchen',
      content:
        "Just finished the 'Quiet Engagement' module. The idea that we can interact without everything being a public performance is refreshing.",
      time: '5h ago',
      type: 'achievement',
      likes: 8,
      comments: 1,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 md:px-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Home</h1>
        <div className="flex gap-2">
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Icon name="AdjustmentsHorizontalIcon" size={24} />
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Composer Placeholder */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
          <span className="text-zinc-500">Share a thought, problem, or win...</span>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <article key={post.id} className="bg-black border-b border-white/10 py-6">
            <div className="flex items-start gap-4">
              {post.type === 'incognito' ? (
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Icon name="LockClosedIcon" size={20} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {post.type === 'incognito' ? 'Incognito' : post.author}
                  </span>
                  <span className="text-zinc-500 text-sm">
                    {post.type === 'incognito' ? '' : post.handle}
                  </span>
                  <span className="text-zinc-600 text-xs">• {post.time}</span>
                </div>

                <p className="text-zinc-300 leading-relaxed text-base mb-4">{post.content}</p>

                <div className="flex items-center gap-6 text-zinc-500">
                  <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                    <Icon name="HeartIcon" size={18} />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <Icon name="ChatBubbleLeftIcon" size={18} />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="ml-auto hover:text-white transition-colors">
                    <Icon name="ShareIcon" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
