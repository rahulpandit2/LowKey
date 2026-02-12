export default function ResponderGuidelines() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Responder <span className="text-zinc-600 italic">guidelines.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Guidelines */}
          <div className="space-y-6 border-l border-white/10 pl-8">
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              Respond kindly. Stick to perspective, practical steps, or gentle questions. Avoid
              judgment.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primary font-medium">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Do: Empathize</h4>
                  <p className="text-sm text-zinc-500">"It sounds like you're feeling..."</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primary font-medium">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Do: Suggest Gently</h4>
                  <p className="text-sm text-zinc-500">"One thing you could try is..."</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-destructive font-medium">✗</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Don't: Judge</h4>
                  <p className="text-sm text-zinc-500">
                    "You should have..." or "Why didn't you..."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Response */}
          <div className="border border-white/[0.05] p-8 rounded-sm bg-card">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">
                Example Help Post
              </p>
              <p className="text-sm text-zinc-400 italic">
                "I made a mistake at work and I'm spiraling. I can't stop replaying it..."
              </p>
            </div>
            <div className="space-y-6 border-t border-white/[0.08] pt-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">
                  Empathetic Perspective
                </p>
                <p className="text-sm text-zinc-300">
                  It sounds like you're being really hard on yourself. Mistakes happen, and
                  replaying them doesn't change the past—but it does steal your present.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">
                  Practical Step
                </p>
                <p className="text-sm text-zinc-300">
                  One thing you could try: write down what happened, what you learned, and one small
                  action to move forward. Then close the notebook.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">
                  Gentle Question
                </p>
                <p className="text-sm text-zinc-300">
                  Have you considered talking to your manager about it? Sometimes transparency helps
                  more than hiding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
