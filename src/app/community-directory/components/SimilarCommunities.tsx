"use client";

import { useRef } from "react";
import Icon from "@/components/ui/AppIcon";

interface Community {
  id: string;
  name: string;
  members: string;
  description: string;
}

export default function SimilarCommunities() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const communities: Community[] = [
    {
      id: "similar_design",
      name: "Design Critique",
      members: "1.5k members",
      description: "Visual work, UX flows, and design thinking discussions",
    },
    {
      id: "similar_philosophy",
      name: "Philosophy Chat",
      members: "890 members",
      description: "Deep conversations on ethics, meaning, and human nature",
    },
    {
      id: "similar_tech",
      name: "Tech Ethics",
      members: "1.2k members",
      description: "Responsible AI, privacy, and technology's societal impact",
    },
    {
      id: "similar_writing",
      name: "Creative Writing",
      members: "2.1k members",
      description: "Fiction, poetry, and narrative craft with constructive feedback",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif text-white mb-2">You Might Like</h2>
            <p className="text-sm text-zinc-500">Based on your activity and interests</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Scroll left"
            >
              <Icon name="ChevronLeftIcon" size={20} className="text-white" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Scroll right"
            >
              <Icon name="ChevronRightIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {communities.map((community) => (
            <div
              key={community.id}
              className="snap-center shrink-0 w-[320px] h-[240px] border border-white/[0.05] p-6 flex flex-col justify-between rounded-sm hover:bg-zinc-900/20 transition-colors group"
            >
              <div>
                <h3 className="text-lg font-serif text-white mb-2 group-hover:text-primary transition-colors">
                  {community.name}
                </h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                  {community.members}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">{community.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 uppercase tracking-wider">Explore</span>
                <Icon
                  name="ArrowRightIcon"
                  size={16}
                  className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}