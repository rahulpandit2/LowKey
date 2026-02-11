import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import OnboardingFlow from "./components/OnboardingFlow";

export const metadata: Metadata = {
  title: "Welcome - LowKey",
  description:
    "Join LowKey: Set up your pseudonymous handle, learn our posting workflow, and start your journey toward thoughtful engagement.",
};

export default function OnboardingPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        <OnboardingFlow />
      </main>
      <Footer />
    </>
  );
}