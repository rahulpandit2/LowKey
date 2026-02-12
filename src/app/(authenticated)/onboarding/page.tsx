'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/20'}`}
          ></div>
          <div
            className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}
          ></div>
          <div
            className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/20'}`}
          ></div>
        </div>

        {step === 1 && (
          <div className="space-y-6 fade-in-up">
            <h1 className="text-4xl font-serif">Welcome to LowKey.</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              You're here because you want a quieter internet. LowKey is designed to help you think,
              not perform. No likes counts, no leaderboards, just real feedback.
            </p>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-start gap-4">
                <Icon name="CheckCircleIcon" size={24} className="text-white mt-1" />
                <div>
                  <h3 className="font-bold">Think. Don't Perform.</h3>
                  <p className="text-sm text-zinc-400">
                    Posts are for sharing ideas, not chasing clout.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Icon name="CheckCircleIcon" size={24} className="text-white mt-1" />
                <div>
                  <h3 className="font-bold">Constructive Feedback.</h3>
                  <p className="text-sm text-zinc-400">Replies are structured to be helpful.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 fade-in-up">
            <h1 className="text-3xl font-serif">Set Your Privacy.</h1>
            <p className="text-zinc-400">You control who sees your content.</p>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Icon name="GlobeAltIcon" size={24} className="text-zinc-400" />
                  <div>
                    <span className="block font-medium">Public</span>
                    <span className="text-xs text-zinc-500">Visible to everyone.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  defaultChecked
                  className="accent-white"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Icon name="UsersIcon" size={24} className="text-zinc-400" />
                  <div>
                    <span className="block font-medium">Followers Only</span>
                    <span className="text-xs text-zinc-500">Only people you approve.</span>
                  </div>
                </div>
                <input type="radio" name="privacy" value="followers" className="accent-white" />
              </label>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 fade-in-up">
            <h1 className="text-3xl font-serif">Your First Post.</h1>
            <p className="text-zinc-400">Share a thought, a problem, or an achievement.</p>

            <textarea
              className="w-full h-40 bg-zinc-900 border border-white/10 p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors rounded-lg resize-none"
              placeholder="What's on your mind? (Don't overthink it.)"
            ></textarea>

            <Link
              href="/feed"
              className="block w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors text-center"
            >
              Post & Finish
            </Link>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 text-zinc-500 hover:text-white uppercase tracking-widest"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
