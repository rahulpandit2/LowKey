export default function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="min-h-screen py-32 px-6 md:px-12 bg-background flex items-center border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Quote Side */}
        <div className="relative group">
          <div className="aspect-[3/4] overflow-hidden bg-zinc-900 relative rounded-sm border border-white/[0.05]">
            {/* Founder Image */}
            <img 
              src="/assets/images/founder.jpg" 
              alt="Rahul Pandit - Founder" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white text-2xl md:text-3xl font-serif italic mb-4">
                "I realize perfection is an illusion, but it can become more real than it was
                yesterday."
              </p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2">
                — Rahul Pandit
              </p>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl text-white mb-10 leading-none font-serif">
            The Good <br />
            <span className="text-zinc-600 italic">Internet.</span>
          </h2>
          <div className="space-y-8 border-l border-white/10 pl-8">
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              I used to dread the word 'perfect.' Not because I was humble, but because it felt like
              a dead end—and I was nowhere near finished.
            </p>
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              There were nights when the silence was deafening. I was full of self-doubt, facing
              conflicts I didn't know how to resolve, and honestly, making some of the worst
              decisions of my life. When I finally reached out for help, the internet didn't offer
              me a place to talk; it offered me rehab. It felt like the world decided that if a man
              is struggling, he must be an addict, not just a human being in need of a sounding
              board.
            </p>
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              I built LowKey because I needed a place that didn't exist: a space for 'emotional
              support' that isn't a clinical diagnosis. No leaderboards to 'win' at life, no vanity
              metrics to chase. Just quiet, honest engagement for people who want to think better,
              together.
            </p>
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              This is the Good Internet. It’s for the days when you don't have the answers, but
              you're brave enough to ask the questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
