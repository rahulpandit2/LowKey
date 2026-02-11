import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PostComposerInteractive from "./components/PostComposerInteractive";

export const metadata: Metadata = {
  title: "Post Composer - LowKey",
  description:
    "Create thoughtful posts on LowKey. Choose from Thought, Problem, Achievement, or Dilemma post types with guided questions.",
};

export default function PostComposerPage() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Header />
      <main className="min-h-screen pt-24 bg-background">
        <PostComposerInteractive />
      </main>
      <Footer />
    </>
  );
}