export default function ExampleHelpPost() {
  const responses = [
    {
      id: 'response_1',
      empathetic: "It sounds like you\'re carrying a lot of weight right now. That\'s tough.",
      practical: 'Try journaling for 5 minutes before bed. Just brain dump—no editing.',
      question: 'Have you talked to anyone close about this?',
    },
    {
      id: 'response_2',
      empathetic: "Spiraling is exhausting. You\'re not alone in feeling this way.",
      practical: 'Consider taking a short walk outside. Physical movement can interrupt the loop.',
      question: 'What would you tell a friend in this situation?',
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Example Help <span className="text-zinc-600 italic">post.</span>
          </h2>
        </div>

        {/* Original Post */}
        <div className="border border-white/[0.05] p-8 rounded-sm bg-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-xs text-zinc-500 uppercase">Anon</span>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Help Post</p>
              <p className="text-xs text-zinc-600">Posted 2 hours ago</p>
            </div>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            I made a mistake at work and I'm spiraling. I can't stop replaying it in my head. I know
            it's not the end of the world, but I feel stuck. How do I learn without self-punishment?
          </p>
        </div>

        {/* Responses */}
        <div className="space-y-6">
          {responses?.map((response, index) => (
            <div key={response?.id} className="border border-white/[0.05] p-8 rounded-sm bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary font-medium">{index + 1}</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Response</p>
                  <p className="text-xs text-zinc-600">From community member</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-2">
                    Empathetic Perspective
                  </p>
                  <p className="text-sm text-zinc-300">{response?.empathetic}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-2">
                    Practical Step
                  </p>
                  <p className="text-sm text-zinc-300">{response?.practical}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-2">
                    Gentle Question
                  </p>
                  <p className="text-sm text-zinc-300">{response?.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
