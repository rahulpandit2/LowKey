import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ReflectionPoints from "./components/ReflectionPoints";
import CosmeticAchievements from "./components/CosmeticAchievements";
import ContributorHistory from "./components/ContributorHistory";
import ProfileSettings from "./components/ProfileSettings";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile - LowKey",
  description:
    "Your private LowKey profile. View reflection points, cosmetic achievements, contributor history, and manage settings. No public leaderboards.",
};

export default function ProfilePage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-16 px-6 md:px-12 border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">
                Your <span className="text-zinc-600 italic">Profile</span>
              </h1>
              <p className="text-lg text-zinc-400 font-light">
                Member since January 2026 · @username
              </p>
            </div>
            <div className="hidden md:block w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <span className="text-3xl text-primary font-serif">U</span>
            </div>
          </div>
        </div>

        <ReflectionPoints />
        <CosmeticAchievements />
        <ContributorHistory />
        <ProfileSettings />

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-background text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Keep <span className="text-zinc-600 italic">contributing.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Your growth is private. No public leaderboards. Just personal progress and thoughtful
            engagement.
          </p>
          <Link
            href="/post-composer"
            className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Create Post
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}