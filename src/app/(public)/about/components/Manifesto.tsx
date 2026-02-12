import Icon from '@/components/ui/AppIcon';

interface Principle {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function Manifesto() {
  const principles: Principle[] = [
    {
      id: 'principle_leaderboards',
      title: 'No leaderboards. No vanity metrics.',
      description:
        'Your growth is private. No public point totals, no global rankings. Just personal progress.',
      icon: 'NoSymbolIcon',
    },
    {
      id: 'principle_feedback',
      title: 'Constructive feedback, not empty likes.',
      description:
        'Reactions must be thoughtful. Progressive disclosure ensures balanced, helpful responses.',
      icon: 'ChatBubbleLeftRightIcon',
    },
    {
      id: 'principle_points',
      title: 'Reflection points, not addiction loops.',
      description:
        'Points decay over time. High rewards are capped and gated by meaningful engagement, not reach.',
      icon: 'SparklesIcon',
    },
    {
      id: 'principle_privacy',
      title: 'Privacy first. Incognito when needed.',
      description:
        'Post anonymously via Help. No public profile info. Optional private follow-up links.',
      icon: 'LockClosedIcon',
    },
    {
      id: 'principle_quality',
      title: 'Quality over quantity. Slow over fast.',
      description:
        'No infinite scroll. No algorithmic urgency. Just thoughtful posts, read at your pace.',
      icon: 'ClockIcon',
    },
    {
      id: 'principle_community',
      title: 'Niche communities, not mass audiences.',
      description:
        'Find your people. Small, thoughtful groups over viral reach. Moderation by humans, not bots.',
      icon: 'UsersIcon',
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            Manifesto
            <span className="w-8 h-[1px] bg-white"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Our <span className="text-zinc-600 italic">principles.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle) => (
            <div
              key={principle.id}
              className="p-8 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <Icon
                name={principle.icon as any}
                size={32}
                className="text-primary opacity-60 mb-6"
              />
              <h4 className="text-white font-medium mb-3 text-lg">{principle.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
