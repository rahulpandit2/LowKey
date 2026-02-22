'use client';

import { useEffect, useState } from 'react';

interface Policy {
  id: string;
  doc_type: string;
  title: string;
  body: string;
  version_number: number;
  published_at: string;
}

const policyOrder = [
  'terms_of_use',
  'privacy_policy',
  'community_guidelines',
  'content_policy',
  'platform_mechanics',
];

const policyIcons: Record<string, string> = {
  terms_of_use: '§',
  privacy_policy: '🔒',
  community_guidelines: '🤝',
  content_policy: '📝',
  platform_mechanics: '⚙️',
};

export default function GuidelinesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/policies')
      .then((r) => r.json())
      .then((data) => {
        const items = data.data || [];
        // Sort by defined order
        items.sort(
          (a: Policy, b: Policy) =>
            policyOrder.indexOf(a.doc_type) - policyOrder.indexOf(b.doc_type)
        );
        setPolicies(items);
        if (items.length > 0) setActiveTab(items[0].doc_type);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = policies.find((p) => p.doc_type === activeTab);

  return (
    <div className="min-h-screen bg-background py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Think. <span className="text-zinc-600 italic">Don't perform.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl border-l-2 border-white/20 pl-6">
            LowKey is designed for conversation, not broadcast. These guidelines keep this space
            thoughtful, safe, and human.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No published guidelines yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar Tabs */}
            <nav className="space-y-1 lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-zinc-600" />
                Policies
              </p>
              {policies.map((p) => (
                <button
                  key={p.doc_type}
                  onClick={() => setActiveTab(p.doc_type)}
                  className={`w-full text-left px-4 py-3 text-sm transition-all rounded-sm border ${activeTab === p.doc_type
                      ? 'bg-white/5 text-white border-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                    }`}
                >
                  <span className="mr-3">{policyIcons[p.doc_type] || '📄'}</span>
                  {p.title}
                </button>
              ))}
            </nav>

            {/* Content */}
            {active && (
              <article className="min-w-0">
                <div className="mb-8 pb-6 border-b border-white/[0.08]">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                    {active.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 uppercase tracking-widest">
                    <span>Version {active.version_number}</span>
                    {active.published_at && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>
                          {new Date(active.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-zinc-400 font-light leading-relaxed">
                  {active.body.split('\n\n').map((section, i) => {
                    // Handle headers
                    if (section.startsWith('# ')) {
                      return (
                        <h3 key={i} className="text-2xl font-serif text-white mt-10 mb-4">
                          {section.replace('# ', '')}
                        </h3>
                      );
                    }
                    if (section.startsWith('## ')) {
                      return (
                        <h4 key={i} className="text-xl font-serif text-white mt-8 mb-3">
                          {section.replace('## ', '')}
                        </h4>
                      );
                    }
                    // Handle bullet lists
                    if (section.includes('\n- ') || section.startsWith('- ')) {
                      const items = section
                        .split('\n')
                        .filter((l) => l.startsWith('- '))
                        .map((l) => l.replace('- ', ''));
                      return (
                        <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                          {items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    // Regular paragraphs
                    return (
                      <p key={i} className="mb-4">
                        {section}
                      </p>
                    );
                  })}
                </div>
              </article>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
