import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PrivacyControls from "./components/PrivacyControls";
import NotificationPreferences from "./components/NotificationPreferences";
import AccountSettings from "./components/AccountSettings";

export const metadata: Metadata = {
  title: "Settings - LowKey",
  description:
    "Manage your LowKey settings: privacy controls, notification preferences, account details, and more.",
};

export default function SettingsPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        {/* Page Header */}
        <div className="py-16 px-6 md:px-12 border-b border-white/[0.08]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">
              Your <span className="text-zinc-600 italic">Settings</span>
            </h1>
            <p className="text-lg text-zinc-400 font-light">
              Manage privacy, notifications, and account preferences
            </p>
          </div>
        </div>

        <PrivacyControls />
        <NotificationPreferences />
        <AccountSettings />
      </main>
      <Footer />
    </>
  );
}