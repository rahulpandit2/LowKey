import type { Metadata } from 'next';

import TrendingCommunities from './components/TrendingCommunities';
import SimilarCommunities from './components/SimilarCommunities';
import CreateCommunity from './components/CreateCommunity';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Directory - LowKey',
  description:
    'Discover thoughtful communities on LowKey. Find your people. No noisy metrics, just quality engagement and niche groups.',
};

export default function CommunityDirectoryPage() {
  return (
    <>
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-32 px-6 md:px-12 border-b border-white/[0.08] text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
            Communities
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
            Find your people. No noise. Just thoughtful groups focused on quality engagement over
            viral reach.
          </p>
        </div>

        <TrendingCommunities />
        <SimilarCommunities />
        <CreateCommunity />

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-background text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Join a <span className="text-zinc-600 italic">community.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Start engaging with thoughtful people. Share ideas, get feedback, and grow without the
            noise.
          </p>
          <Link
            href="/homepage"
            className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Explore All Communities
          </Link>
        </section>
      </main>
    </>
  );
}
