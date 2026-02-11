export default function ReflectionPoints() {
  const pointCategories = [
    {
      id: "points_foundational",
      title: "Foundational",
      points: 142,
      description: "Read, bookmark, quiet engagement",
      color: "text-zinc-400",
    },
    {
      id: "points_medium",
      title: "Medium",
      points: 38,
      description: "Quality perspectives, constructive feedback",
      color: "text-primary",
    },
    {
      id: "points_high",
      title: "High",
      points: 5,
      description: "Capped rewards, meaningful downstream engagement",
      color: "text-accent",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Reflection Points</h2>
          <p className="text-sm text-zinc-500">
            Points are private. No public leaderboards. Just personal progress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pointCategories?.map((category) => (
            <div
              key={category?.id}
              className="p-8 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-4xl font-serif ${category?.color}`}>{category?.points}</span>
                <span className="text-sm text-zinc-500 uppercase tracking-widest">points</span>
              </div>
              <h3 className="text-white font-medium mb-2">{category?.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{category?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}