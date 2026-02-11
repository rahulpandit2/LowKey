import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
          Ready to think <span className="text-zinc-600 italic">better?</span>
        </h2>
        <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          Join thoughtful adults who prefer reflection over performance. No leaderboards. No vanity
          metrics. Just real feedback.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/post-composer"
            className="px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none flex items-center justify-center"
          >
            Get Started
          </Link>
          <Link
            href="/community-directory"
            className="px-12 py-4 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none flex items-center justify-center"
          >
            Explore Communities
          </Link>
        </div>
      </div>
    </section>
  );
}