'use client';

import { useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Community {
  id: string;
  name: string;
  members: string;
  description: string;
  theme: string;
}

export default function CommunitySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const communities: Community[] = [
    {
      id: 'community_writers',
      name: 'Reflective Writers',
      members: '2.3k members',
      description: 'Share essays, get thoughtful feedback on structure and clarity',
      theme: 'bg-zinc-800',
    },
    {
      id: 'community_makers',
      name: 'Indie Makers',
      members: '1.8k members',
      description: 'Build in public, receive constructive critiques on products',
      theme: 'bg-zinc-800',
    },
    {
      id: 'community_parents',
      name: 'Mindful Parents',
      members: '980 members',
      description: 'Navigate parenting challenges with empathy, no judgment',
      theme: 'bg-zinc-800',
    },
    {
      id: 'community_learners',
      name: 'Learning in Public',
      members: '3.1k members',
      description: 'Share progress, celebrate growth, get feedback on learning paths',
      theme: 'bg-zinc-800',
    },
    {
      id: 'community_design',
      name: 'Design Critique',
      members: '1.5k members',
      description: 'Visual work, UX flows, and design thinking discussions',
      theme: 'bg-zinc-800',
    },
    {
      id: 'community_philosophy',
      name: 'Philosophy Chat',
      members: '890 members',
      description: 'Deep conversations on ethics, meaning, and human nature',
      theme: 'bg-zinc-800',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-4 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-white"></span>
              Communities
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Find your <span className="text-zinc-600 italic">people.</span>
            </h3>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Scroll left"
            >
              <Icon name="ChevronLeftIcon" size={20} className="text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Scroll right"
            >
              <Icon name="ChevronRightIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {communities.map((community) => (
            <div
              key={community.id}
              className="snap-center shrink-0 w-[320px] h-[280px] border border-white/[0.05] p-8 flex flex-col justify-between rounded-sm hover:bg-zinc-900/20 transition-colors group"
            >
              <div>
                <h4 className="text-xl font-serif text-white mb-2 group-hover:text-primary transition-colors">
                  {community.name}
                </h4>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                  {community.members}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">{community.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 uppercase tracking-wider">Join</span>
                <Icon
                  name="ArrowRightIcon"
                  size={16}
                  className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/communities"
            className="inline-flex items-center gap-2 text-sm text-white hover:text-primary transition-colors"
          >
            Explore All Communities
            <Icon name="ArrowRightIcon" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
