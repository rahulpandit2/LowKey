export default function ContributorHistory() {
  const stats = [
    { id: 'stat_posts', label: 'Your posts', value: 12 },
    { id: 'stat_perspectives', label: 'Perspectives given', value: 24 },
    { id: 'stat_feedback', label: 'Feedback given', value: 8 },
    { id: 'stat_help', label: 'Help responses (marked helpful)', value: 3 },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Contributor History</h2>
          <p className="text-sm text-zinc-500">
            This is private. Not visible to others. Just your personal activity log.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat) => (
            <div
              key={stat?.id}
              className="p-6 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <div className="text-4xl font-serif text-white mb-2">{stat?.value}</div>
              <p className="text-sm text-zinc-500">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
