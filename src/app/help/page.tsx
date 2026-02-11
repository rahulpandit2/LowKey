import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HowItWorks from "./components/HowItWorks";
import ResponderGuidelines from "./components/ResponderGuidelines";
import PrivacyGuarantees from "./components/PrivacyGuarantees";
import ExampleHelpPost from "./components/ExampleHelpPost";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

export const metadata: Metadata = {
  title: "Help (Incognito) - LowKey",
  description:
    "Get anonymous support on LowKey. Post vulnerably without public profile visibility. Constrained empathetic responses ensure thoughtful, helpful feedback.",
};

export default function HelpPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-32 px-6 md:px-12 border-b border-white/[0.08] text-center">
          <div className="mb-6">
            <Icon name="LockClosedIcon" size={48} className="text-primary mx-auto opacity-60" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
            Help <span className="text-zinc-600 italic">(Incognito)</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
            Get support without the spotlight. Post anonymously, receive constrained empathetic
            responses, and mark helpful replies privately.
          </p>
        </div>

        <HowItWorks />
        <ResponderGuidelines />
        <PrivacyGuarantees />
        <ExampleHelpPost />

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-background text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Need help? <span className="text-zinc-600 italic">Post anonymously.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Your identity is protected. Responses are constrained to be empathetic and constructive.
            No public profile info.
          </p>
          <Link
            href="/post-composer"
            className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Create Help Post
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}