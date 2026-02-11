"use client";

import { useState, useEffect } from "react";
import PostTypeSelector from "./PostTypeSelector";
import GuidedQuestions from "./GuidedQuestions";
import EngagementPreview from "./EngagementPreview";
import HelpConversion from "./HelpConversion";

export default function PostComposerInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isHelp, setIsHelp] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handlePublish = () => {
    if (!isHydrated) return;
    alert("Post published! (This is a prototype - no backend connected)");
  };

  const handleSaveDraft = () => {
    if (!isHydrated) return;
    alert("Draft saved! (This is a prototype - no backend connected)");
  };

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-32">
        <div className="text-center text-zinc-500">Loading composer...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-32">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
          What's on your <span className="text-zinc-600 italic">mind?</span>
        </h1>
        <p className="text-lg text-zinc-400 font-light">
          Pick a post type. We'll guide you. No one wins or loses here—just thought.
        </p>
      </div>

      {/* Step 1: Post Type Selection */}
      <div className="mb-12">
        <h2 className="text-sm text-zinc-400 mb-4 uppercase tracking-widest">
          Step 1: Choose Post Type
        </h2>
        <PostTypeSelector onSelect={setSelectedType} selectedType={selectedType} />
      </div>

      {/* Step 2: Guided Questions (Progressive Disclosure) */}
      {selectedType && (
        <div className="mb-12 fade-in-up">
          <h2 className="text-sm text-zinc-400 mb-6 uppercase tracking-widest">
            Step 2: Answer Guided Questions
          </h2>
          <div className="border border-white/[0.05] p-8 rounded-sm bg-card">
            <GuidedQuestions
              postType={selectedType}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          </div>
        </div>
      )}

      {/* Step 3: Engagement Preview */}
      {selectedType && (
        <div className="mb-12 fade-in-up delay-100">
          <h2 className="text-sm text-zinc-400 mb-6 uppercase tracking-widest">
            Step 3: Engagement Options
          </h2>
          <EngagementPreview />
        </div>
      )}

      {/* Step 4: Help Conversion */}
      {selectedType && (
        <div className="mb-12 fade-in-up delay-200">
          <h2 className="text-sm text-zinc-400 mb-6 uppercase tracking-widest">
            Step 4: Privacy Option
          </h2>
          <HelpConversion isHelp={isHelp} onToggle={setIsHelp} />
        </div>
      )}

      {/* CTA Buttons */}
      {selectedType && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-300">
          <button
            onClick={handlePublish}
            className="px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none flex items-center justify-center"
          >
            Publish
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-12 py-4 border border-white/20 hover:border-white text-white text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none flex items-center justify-center"
          >
            Save Draft
          </button>
        </div>
      )}
    </div>
  );
}