'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FlowDiagram() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const postTypes = [
    {
      id: 'thought',
      title: 'Thought',
      icon: 'LightBulbIcon',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 'problem',
      title: 'Problem',
      icon: 'QuestionMarkCircleIcon',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'achievement',
      title: 'Achievement',
      icon: 'TrophyIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      id: 'dilemma',
      title: 'Dilemma',
      icon: 'ScaleIcon',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  const engagementFlows = [
    {
      id: 'quiet',
      title: 'Quiet Engagement',
      description: 'Bookmark with private note',
      icon: 'BookmarkIcon',
    },
    {
      id: 'perspective',
      title: 'Perspective',
      description: 'One-sentence structured view',
      icon: 'ChatBubbleLeftIcon',
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Constructive (3 fields)',
      icon: 'PencilSquareIcon',
    },
    {
      id: 'share',
      title: 'Share',
      description: 'Choose intent (celebrate, collaborate, reference, inspire)',
      icon: 'ShareIcon',
    },
  ];

  if (!isHydrated) {
    return (
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">Loading...</div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Flow Diagram */}
        <div className="space-y-16">
          {/* Step 1: Post Composer */}
          <div
            className="fade-in-up"
            onMouseEnter={() => setActiveStep(1)}
            onMouseLeave={() => setActiveStep(null)}
          >
            <div className="text-center mb-8">
              <span className="text-xs text-zinc-600 uppercase tracking-widest">Step 1</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mt-2">
                Post <span className="text-zinc-600 italic">Composer</span>
              </h2>
            </div>
            <div
              className={`p-8 border rounded-sm transition-all duration-300 ${
                activeStep === 1 ? 'border-primary bg-primary/5' : 'border-white/[0.05] bg-card'
              }`}
            >
              <div className="flex items-center justify-center gap-4">
                <Icon name="PencilSquareIcon" size={32} className="text-primary" />
                <div className="text-center">
                  <h3 className="text-xl text-white font-medium mb-2">Start Your Post</h3>
                  <p className="text-sm text-zinc-500">
                    Choose a post type to begin your thoughtful contribution
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center">
            <Icon name="ArrowDownIcon" size={32} className="text-zinc-700" />
          </div>

          {/* Step 2: Post Types */}
          <div
            className="fade-in-up delay-100"
            onMouseEnter={() => setActiveStep(2)}
            onMouseLeave={() => setActiveStep(null)}
          >
            <div className="text-center mb-8">
              <span className="text-xs text-zinc-600 uppercase tracking-widest">Step 2</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mt-2">
                Post <span className="text-zinc-600 italic">Types</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {postTypes.map((type, index) => (
                <div
                  key={type.id}
                  className={`p-6 border rounded-sm transition-all duration-300 hover:scale-105 ${
                    activeStep === 2
                      ? `${type.borderColor} ${type.bgColor}`
                      : 'border-white/[0.05] bg-card'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full ${type.bgColor} flex items-center justify-center`}
                    >
                      <Icon name={type.icon as any} size={24} className={type.color} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{type.title}</h3>
                      <p className="text-xs text-zinc-500">Guided questions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="flex justify-center">
            <Icon name="ArrowDownIcon" size={32} className="text-zinc-700" />
          </div>

          {/* Step 3: Engagement Flows */}
          <div
            className="fade-in-up delay-100"
            onMouseEnter={() => setActiveStep(3)}
            onMouseLeave={() => setActiveStep(null)}
          >
            <div className="text-center mb-8">
              <span className="text-xs text-zinc-600 uppercase tracking-widest">Step 3</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mt-2">
                Engagement <span className="text-zinc-600 italic">Flows</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engagementFlows.map((flow, index) => (
                <div
                  key={flow.id}
                  className={`p-6 border rounded-sm transition-all duration-300 hover:border-primary ${
                    activeStep === 3
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/[0.05] bg-card'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={flow.icon as any} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">{flow.title}</h3>
                      <p className="text-sm text-zinc-500">{flow.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Principles */}
          <div className="mt-24 pt-16 border-t border-white/[0.08]">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-12 text-center">
              Design <span className="text-zinc-600 italic">Principles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="ShieldCheckIcon" size={28} className="text-primary" />
                </div>
                <h3 className="text-white font-medium mb-2">Privacy First</h3>
                <p className="text-sm text-zinc-500">
                  Pseudonymous by default. No public metrics. Your growth is private.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="ChatBubbleLeftRightIcon" size={28} className="text-primary" />
                </div>
                <h3 className="text-white font-medium mb-2">Guided Interaction</h3>
                <p className="text-sm text-zinc-500">
                  Structured questions help you articulate clearly and engage thoughtfully.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="SparklesIcon" size={28} className="text-primary" />
                </div>
                <h3 className="text-white font-medium mb-2">Meaningful Engagement</h3>
                <p className="text-sm text-zinc-500">
                  Multiple engagement types ensure every interaction adds value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
