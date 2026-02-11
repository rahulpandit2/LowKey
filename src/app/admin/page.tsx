import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ModerationQueue from "./components/ModerationQueue";
import HelpChannelOversight from "./components/HelpChannelOversight";
import AdminStats from "./components/AdminStats";

export const metadata: Metadata = {
  title: "Admin Dashboard - LowKey",
  description:
    "Moderation tools for LowKey administrators. Review flagged content, oversee Help channel, and maintain community standards.",
};

export default function AdminPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-16 px-6 md:px-12 border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">
              Admin <span className="text-zinc-600 italic">Dashboard</span>
            </h1>
            <p className="text-lg text-zinc-400 font-light">
              Moderation tools and community oversight
            </p>
          </div>
        </div>

        <AdminStats />
        <ModerationQueue />
        <HelpChannelOversight />
      </main>
      <Footer />
    </>
  );
}