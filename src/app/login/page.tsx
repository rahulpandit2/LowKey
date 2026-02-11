import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Login - LowKey",
  description: "Sign in to LowKey with your email or pseudonymous handle.",
};

export default function LoginPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background flex items-center justify-center">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}