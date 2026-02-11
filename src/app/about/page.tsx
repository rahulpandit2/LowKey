import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FounderStory from "./components/FounderStory";
import Manifesto from "./components/Manifesto";
import Comparison from "./components/Comparison";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - LowKey",
  description:
    "Learn about LowKey's mission: a quieter internet for thoughtful adults. Read our manifesto and see how we're different from performative social platforms.",
};

export default function AboutPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-32 px-6 md:px-12 border-b border-white/[0.08] text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
            The Good <span className="text-zinc-600 italic">Internet.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
            A manifesto for thinking better, together. No leaderboards. No vanity metrics. Just
            real feedback and quiet growth.
          </p>
        </div>

        <FounderStory />
        <Manifesto />
        <Comparison />

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-background text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Join the <span className="text-zinc-600 italic">movement.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Ready to think better? Start posting, get real feedback, and grow without the noise.
          </p>
          <Link
            href="/post-composer"
            className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Get Started
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}