export default function FeedbackSection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-medium text-white tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            Quality Feedback
            <span className="w-8 h-[1px] bg-white"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Constructive. <br />
            <span className="text-zinc-600 italic">Not critical.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Explanation */}
          <div className="space-y-6 border-l border-white/10 pl-8">
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              Feedback on LowKey follows a progressive disclosure pattern. You must answer "What's
              correct?" before you can critique. This ensures balanced, helpful responses.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primary font-medium">1</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">What's correct?</h4>
                  <p className="text-sm text-zinc-500">Start with what's working.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primary font-medium">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">What's wrong?</h4>
                  <p className="text-sm text-zinc-500">Identify gaps or issues.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primaryfont-medium">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">What can be done?</h4>
                  <p className="text-sm text-zinc-500">Suggest actionable next steps.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Example Feedback */}
          <div className="border border-white/[0.05] p-8 rounded-sm bg-card">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Example Post</p>
              <p className="text-sm text-zinc-400 italic">
                "I'm building a productivity app but struggling with user retention..."
              </p>
            </div>
            <div className="space-y-6 border-t border-white/[0.08] pt-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">What's correct?</p>
                <p className="text-sm text-zinc-300">
                  You've identified the core problem (retention) and you're seeking feedback early.
                  That's smart.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">What's wrong?</p>
                <p className="text-sm text-zinc-300">
                  You haven't shared what you've tried yet. Without that context, it's hard to give
                  specific advice.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">What can be done?</p>
                <p className="text-sm text-zinc-300">
                  Run a simple user interview (5 people). Ask: "What made you stop using the app?"
                  Share findings here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}