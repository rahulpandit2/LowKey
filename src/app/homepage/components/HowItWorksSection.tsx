import Icon from "@/components/ui/AppIcon";

interface PostType {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export default function HowItWorksSection() {
  const postTypes: PostType[] = [
    {
      id: "post_thought",
      title: "Thought",
      description: "Share an idea or perspective",
      icon: "LightBulbIcon",
      prompt: "What is the core idea I'm sharing?",
    },
    {
      id: "post_problem",
      title: "Problem",
      description: "Seek help on a challenge",
      icon: "QuestionMarkCircleIcon",
      prompt: "What is the problem?",
    },
    {
      id: "post_achievement",
      title: "Achievement",
      description: "Celebrate a milestone",
      icon: "TrophyIcon",
      prompt: "What did you achieve?",
    },
    {
      id: "post_dilemma",
      title: "Dilemma",
      description: "Navigate a difficult choice",
      icon: "ScaleIcon",
      prompt: "What is the decision you face?",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            How It Works
            <span className="w-8 h-[1px] bg-white"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Four ways to share. <br />
            <span className="text-zinc-600 italic">One thoughtful flow.</span>
          </h3>
        </div>

        {/* Post Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {postTypes.map((type) => (
            <div
              key={type.id}
              className="group relative p-8 md:p-12 h-[300px] flex flex-col justify-between bg-card border border-white/[0.05] rounded-sm hover:bg-zinc-900/20 transition-colors duration-700"
            >
              <div className="flex justify-between items-start">
                <Icon
                  name={type.icon as any}
                  size={32}
                  className="text-primary opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div>
                <h4 className="text-2xl font-serif italic text-white mb-2">{type.title}</h4>
                <p className="text-zinc-500 text-sm font-light mb-4">{type.description}</p>
                <p className="text-zinc-600 text-xs italic">"{type.prompt}"</p>
                <div className="h-[1px] w-full bg-zinc-800 group-hover:bg-white/30 transition-colors mt-6"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="border-t border-white/[0.08] pt-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="PencilIcon" size={20} className="text-white" />
              </div>
              <p className="text-sm text-zinc-400">Compose</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-white" />
              </div>
              <p className="text-sm text-zinc-400">Engage</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="SparklesIcon" size={20} className="text-white" />
              </div>
              <p className="text-sm text-zinc-400">Reflect</p>
            </div>
            <Icon name="ArrowRightIcon" size={20} className="text-zinc-600 hidden md:block" />
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="HeartIcon" size={20} className="text-white" />
              </div>
              <p className="text-sm text-zinc-400">Help (Incognito)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}