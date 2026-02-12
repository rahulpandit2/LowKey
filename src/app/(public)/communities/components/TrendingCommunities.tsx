import Icon from '@/components/ui/AppIcon';

interface Community {
  id: string;
  name: string;
  members: string;
  description: string;
}

export default function TrendingCommunities() {
  const communities: Community[] = [
    {
      id: 'trending_writers',
      name: 'Reflective Writers',
      members: '2.3k members',
      description: 'Share essays, get thoughtful feedback on structure and clarity',
    },
    {
      id: 'trending_makers',
      name: 'Indie Makers',
      members: '1.8k members',
      description: 'Build in public, receive constructive critiques on products',
    },
    {
      id: 'trending_parents',
      name: 'Mindful Parents',
      members: '980 members',
      description: 'Navigate parenting challenges with empathy, no judgment',
    },
    {
      id: 'trending_learners',
      name: 'Learning in Public',
      members: '3.1k members',
      description: 'Share progress, celebrate growth, get feedback on learning paths',
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Trending Communities</h2>
          <p className="text-sm text-zinc-500">Active, thoughtful groups with quality engagement</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {communities.map((community) => (
            <div
              key={community.id}
              className="group p-8 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-primary transition-colors">
                {community.name}
              </h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                {community.members}
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{community.description}</p>
              <div className="flex items-center justify-between">
                <button className="text-sm text-white hover:text-primary transition-colors font-medium">
                  Join Community
                </button>
                <Icon
                  name="ArrowRightIcon"
                  size={16}
                  className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
