import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FlowDiagram from "./components/FlowDiagram";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Features - LowKey",
  description:
    "Explore LowKey's thoughtful design: from post composer to engagement flows. See how we guide users through meaningful interactions.",
};

export default function ProductFeaturesPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-32 px-6 md:px-12 border-b border-white/[0.08] text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
            Product <span className="text-zinc-600 italic">Features</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
            A visual journey through LowKey's thoughtful design. From post composer to engagement flows.
          </p>
        </div>

        <FlowDiagram />

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-background text-center border-t border-white/[0.08]">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Ready to <span className="text-zinc-600 italic">explore?</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Experience the flow yourself. Start composing thoughtful posts today.
          </p>
          <Link
            href="/post-composer"
            className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Try Post Composer
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}