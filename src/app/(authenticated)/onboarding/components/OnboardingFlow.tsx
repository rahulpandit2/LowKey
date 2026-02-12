'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type OnboardingStep = 'welcome' | 'email' | 'handle' | 'demo' | 'complete';

export default function OnboardingFlow() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const checkHandleAvailability = (value: string) => {
    if (value.length < 3) {
      setHandleAvailable(null);
      return;
    }
    // Simulate availability check
    setTimeout(() => {
      setHandleAvailable(value.length >= 3 && !value.includes('admin'));
    }, 300);
  };

  const handleNext = () => {
    if (!isHydrated) return;

    if (currentStep === 'welcome') setCurrentStep('email');
    else if (currentStep === 'email' && email) setCurrentStep('handle');
    else if (currentStep === 'handle' && handle && handleAvailable) setCurrentStep('demo');
    else if (currentStep === 'demo') setCurrentStep('complete');
  };

  const handleBack = () => {
    if (!isHydrated) return;

    if (currentStep === 'email') setCurrentStep('welcome');
    else if (currentStep === 'handle') setCurrentStep('email');
    else if (currentStep === 'demo') setCurrentStep('handle');
  };

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-32">
        <div className="text-center text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-32">
      {/* Progress Indicator */}
      <div className="mb-16">
        <div className="flex items-center justify-center gap-2">
          {['welcome', 'email', 'handle', 'demo', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === step
                    ? 'bg-primary w-8'
                    : index <
                        ['welcome', 'email', 'handle', 'demo', 'complete'].indexOf(currentStep)
                      ? 'bg-primary/50'
                      : 'bg-white/10'
                }`}
              />
              {index < 4 && <div className="w-8 h-[1px] bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Step */}
      {currentStep === 'welcome' && (
        <div className="text-center fade-in-up">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Welcome to <span className="text-zinc-600 italic">LowKey</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light mb-12 max-w-2xl mx-auto">
            A quieter internet for thoughtful adults. No vanity metrics. No performative posting.
            Just real feedback and quiet growth.
          </p>
          <div className="space-y-6 text-left max-w-xl mx-auto mb-12">
            <div className="flex items-start gap-4">
              <Icon name="ShieldCheckIcon" size={24} className="text-primary mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Pseudonymous by Default</h3>
                <p className="text-sm text-zinc-500">
                  Choose a handle. No real names required. Privacy first.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-primary mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Guided Posting</h3>
                <p className="text-sm text-zinc-500">
                  Answer thoughtful questions. We help you articulate clearly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="SparklesIcon" size={24} className="text-primary mt-1" />
              <div>
                <h3 className="text-white font-medium mb-1">Private Growth</h3>
                <p className="text-sm text-zinc-500">
                  Reflection points are yours alone. No public leaderboards.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Email Step */}
      {currentStep === 'email' && (
        <div className="fade-in-up">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight text-center">
            What's your <span className="text-zinc-600 italic">email?</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light mb-12 text-center">
            We'll use this for account recovery and important updates. Never shared publicly.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="px-8 py-3 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!email || !email.includes('@')}
              className="px-12 py-3 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Handle Step */}
      {currentStep === 'handle' && (
        <div className="fade-in-up">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight text-center">
            Choose your <span className="text-zinc-600 italic">handle</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light mb-12 text-center">
            This is how you'll appear to others. Pseudonymous by design. Change it anytime.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  setHandle(value);
                  checkHandleAvailability(value);
                }}
                placeholder="yourhandle"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm pl-12 pr-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
              />
              {handleAvailable !== null && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  {handleAvailable ? (
                    <Icon name="CheckCircleIcon" size={20} className="text-primary" />
                  ) : (
                    <Icon name="XCircleIcon" size={20} className="text-red-500" />
                  )}
                </div>
              )}
            </div>
            {handle.length > 0 && handle.length < 3 && (
              <p className="text-xs text-zinc-500 mt-2">Handle must be at least 3 characters</p>
            )}
            {handleAvailable === false && handle.length >= 3 && (
              <p className="text-xs text-red-500 mt-2">Handle not available. Try another.</p>
            )}
            {handleAvailable === true && (
              <p className="text-xs text-primary mt-2">Handle available!</p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="px-8 py-3 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!handle || !handleAvailable}
              className="px-12 py-3 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Demo Step */}
      {currentStep === 'demo' && (
        <div className="fade-in-up">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight text-center">
            How <span className="text-zinc-600 italic">posting</span> works
          </h2>
          <p className="text-lg text-zinc-400 font-light mb-12 text-center">
            We guide you through thoughtful questions. No blank text boxes.
          </p>
          <div className="space-y-6 mb-12">
            {/* Post Type Selection Demo */}
            <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Choose a Post Type</h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    Thought, Problem, Achievement, or Dilemma. Each has guided questions.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Thought', 'Problem', 'Achievement', 'Dilemma'].map((type) => (
                      <div
                        key={type}
                        className="p-3 border border-white/[0.05] rounded-sm bg-zinc-900/50 text-center"
                      >
                        <span className="text-xs text-zinc-400">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Guided Questions Demo */}
            <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">Answer Guided Questions</h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    We ask specific questions to help you articulate clearly.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 border border-white/[0.05] rounded-sm bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 mb-2">What is the core idea?</p>
                      <div className="h-2 bg-white/5 rounded-full" />
                    </div>
                    <div className="p-3 border border-white/[0.05] rounded-sm bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 mb-2">What evidence led you here?</p>
                      <div className="h-2 bg-white/5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Option Demo */}
            <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Choose Privacy Level</h3>
                  <p className="text-sm text-zinc-500">
                    Convert to Help channel for anonymous support, or keep it public for feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="px-8 py-3 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-12 py-3 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <div className="text-center fade-in-up">
          <div className="mb-8">
            <Icon name="CheckCircleIcon" size={64} className="text-primary mx-auto" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            You're all <span className="text-zinc-600 italic">set!</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light mb-12 max-w-2xl mx-auto">
            Welcome to LowKey, @{handle}. Ready to start your journey toward thoughtful engagement?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-composer"
              className="inline-flex px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none justify-center"
            >
              Create First Post
            </Link>
            <Link
              href="/homepage"
              className="inline-flex px-12 py-4 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none justify-center"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
