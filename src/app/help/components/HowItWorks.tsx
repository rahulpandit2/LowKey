import Icon from "@/components/ui/AppIcon";

export default function HowItWorks() {
  const steps = [
    {
      id: "step_post",
      title: "Post Anonymously",
      description: "No profile visible. Your identity is protected.",
      icon: "LockClosedIcon",
    },
    {
      id: "step_respond",
      title: "Get Responses",
      description: "Constrained empathetic fields ensure thoughtful replies.",
      icon: "ChatBubbleLeftEllipsisIcon",
    },
    {
      id: "step_mark",
      title: "Mark Helpful",
      description: "Private recognition. No public signal.",
      icon: "HandThumbUpIcon",
    },
    {
      id: "step_contact",
      title: "Optional Contact",
      description: "Share private follow-up link if you choose.",
      icon: "UserIcon",
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            How It Works
            <span className="w-8 h-[1px] bg-white"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Four steps to <span className="text-zinc-600 italic">safe support.</span>
          </h3>
        </div>

        {/* Flow Diagram */}
        <div className="border border-white/[0.05] p-8 md:p-12 rounded-sm bg-card mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name={step.icon as any} size={24} className="text-primary" />
                </div>
                <p className="text-sm text-white font-medium mb-2">{step.title}</p>
                <p className="text-xs text-zinc-500">{step.description}</p>
                {index < steps.length - 1 && (
                  <Icon
                    name="ArrowRightIcon"
                    size={20}
                    className="text-zinc-600 hidden md:block mx-auto mt-4"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-8 border border-white/[0.05] rounded-sm bg-card hover:bg-zinc-900/20 transition-colors"
            >
              <Icon
                name={step.icon as any}
                size={32}
                className="text-primary opacity-60 mb-4"
              />
              <h4 className="text-white font-medium mb-2 text-lg">{step.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}