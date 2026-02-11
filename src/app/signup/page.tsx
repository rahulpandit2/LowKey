import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SignupForm from "./components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up - LowKey",
  description: "Join LowKey and start your thoughtful journey with email or pseudonymous handle.",
};

export default function SignupPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background flex items-center justify-center">
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}