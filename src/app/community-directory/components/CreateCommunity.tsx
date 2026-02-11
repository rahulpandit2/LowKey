export default function CreateCommunity() {
  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="border border-white/[0.05] p-12 rounded-sm bg-card text-center">
          <h3 className="text-3xl font-serif text-white mb-4">
            Don't see your <span className="text-zinc-600 italic">community?</span>
          </h3>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Create one. Quality over quantity. Thoughtful moderation. Build a space for people who
            want to think better, together.
          </p>
          <button className="px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none">
            Create Community
          </button>
          <p className="text-xs text-zinc-600 mt-6">
            Guidelines: Focus on quality. Moderate thoughtfully. No spam or self-promotion.
          </p>
        </div>
      </div>
    </section>
  );
}