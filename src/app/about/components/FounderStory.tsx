export default function FounderStory() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Why this <span className="text-zinc-600 italic">project?</span>
          </h2>
        </div>

        <div className="space-y-8 text-lg text-zinc-400 font-light leading-relaxed">
          <p>
            I hated the idea of being called perfect. It suggested no room for improvement. I
            wanted guidance, not praise.
          </p>
          <p>
            Every social platform seemed designed to extract performance: post something, get
            likes, feel validated (or not), repeat. The cycle was exhausting. The feedback was
            hollow.
          </p>
          <p>
            I started asking: what if engagement wasn't about numbers? What if feedback was
            structured to be constructive, not critical? What if we could share vulnerably without
            fear of public judgment?
          </p>
          <div className="border-l-2 border-primary pl-8 py-4">
            <p className="text-2xl md:text-3xl font-serif italic text-white">
              "I realize perfection is an illusion, but it can become more real than yesterday."
            </p>
            <p className="text-sm text-zinc-500 uppercase tracking-widest mt-4">— Rahul Pandit</p>
          </div>
          <p>
            LowKey is the answer. A place where thoughtful adults can think out loud, get real
            feedback, and grow—without the noise of likes, leaderboards, or performance metrics.
          </p>
          <p>This is the Good Internet.</p>
        </div>
      </div>
    </section>
  );
}