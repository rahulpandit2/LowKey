export default function Comparison() {
  const comparisons = [
    {
      id: 'comp_twitter',
      platform: 'Twitter',
      them: 'Likes, retweets, quote dunks',
      us: 'Quiet bookmarks, structured perspectives',
    },
    {
      id: 'comp_reddit',
      platform: 'Reddit',
      them: 'Upvotes, karma farming',
      us: 'Capped reflection points, no leaderboards',
    },
    {
      id: 'comp_linkedin',
      platform: 'LinkedIn',
      them: 'Performative posts, engagement bait',
      us: 'Authentic sharing, thoughtful feedback',
    },
    {
      id: 'comp_instagram',
      platform: 'Instagram',
      them: 'Public follower counts, influencer culture',
      us: 'Private profiles, minimal visibility',
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            How we're <span className="text-zinc-600 italic">different.</span>
          </h2>
        </div>

        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/[0.08]">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Platform</div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Them</div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">LowKey</div>
          </div>

          {/* Comparison Rows */}
          {comparisons?.map((comp) => (
            <div
              key={comp?.id}
              className="grid grid-cols-3 gap-4 p-6 border-b border-white/[0.08] hover:bg-zinc-900/20 transition-colors"
            >
              <div className="text-white font-medium">{comp?.platform}</div>
              <div className="text-zinc-500 text-sm">{comp?.them}</div>
              <div className="text-primary text-sm font-medium">{comp?.us}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
