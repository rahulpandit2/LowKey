import type { Metadata } from 'next';

import HeroSection from './components/HeroSection';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import FeedbackSection from './components/FeedbackSection';
import PrivacySection from './components/PrivacySection';
import CommunitySection from './components/CommunitySection';
import CTASection from './components/CTASection';

export const metadata: Metadata = {
  title: 'LowKey — The Good Internet Project',
  description:
    "Think. Don't perform. LowKey is a private-first social platform for honest sharing, real feedback, and quiet growth — without likes, leaderboards, or performance pressure.",
  keywords: [
    'social platform', 'anonymous posting', 'mental health community', 'honest feedback',
    'private social media', 'incognito help', 'thoughtful discussion', 'LowKey'
  ],
  openGraph: {
    title: 'LowKey — The Good Internet Project',
    description: "Think. Don't perform. A quieter internet for thoughtful adults.",
    type: 'website',
    siteName: 'LowKey',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LowKey — The Good Internet Project',
    description: "Think. Don't perform. A quieter internet for thoughtful adults.",
  },
};

export default function Homepage() {
  return (
    <>
      <main>
        <HeroSection />

        {/* Scrolling Marquee */}
        <div className="border-b border-white/[0.08] bg-background py-6 overflow-hidden">
          <div className="scrolling-text-container">
            <div className="scrolling-text text-zinc-600 font-normal tracking-[0.2em] text-xs uppercase">
              <span className="mx-12">Thoughtful Feedback</span> /
              <span className="mx-12">No Leaderboards</span> /
              <span className="mx-12">Privacy First</span> /
              <span className="mx-12">Quiet Engagement</span> /
              <span className="mx-12">Thoughtful Feedback</span> /
              <span className="mx-12">No Leaderboards</span> /
              <span className="mx-12">Privacy First</span> /
              <span className="mx-12">Quiet Engagement</span>
            </div>
          </div>
        </div>

        <PhilosophySection />
        <HowItWorksSection />
        <FeedbackSection />
        <PrivacySection />
        <CommunitySection />
        <CTASection />
      </main>
    </>
  );
}
