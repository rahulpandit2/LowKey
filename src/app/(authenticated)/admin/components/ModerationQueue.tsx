'use client';


import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FlaggedItem {
  id: string;
  type: 'post' | 'comment';
  author: string;
  content: string;
  reason: string;
  flagCount: number;
  timestamp: string;
}

export default function ModerationQueue() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([
    {
      id: 'flag_1',
      type: 'post',
      author: '@user123',
      content:
        'This is a sample flagged post that may contain content that violates community guidelines...',
      reason: 'Spam or misleading',
      flagCount: 3,
      timestamp: '2 hours ago',
    },
    {
      id: 'flag_2',
      type: 'comment',
      author: '@user456',
      content: 'Sample comment that was flagged for review by community members.',
      reason: 'Harassment',
      flagCount: 5,
      timestamp: '4 hours ago',
    },
    {
      id: 'flag_3',
      type: 'post',
      author: '@user789',
      content: 'Another example of content that needs moderator review based on community reports.',
      reason: 'Off-topic',
      flagCount: 2,
      timestamp: '6 hours ago',
    },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAction = (itemId: string, action: 'approve' | 'remove' | 'warn') => {
    if (!isHydrated) return;
    setFlaggedItems((prev) => prev.filter((item) => item.id !== itemId));
    alert(`Item ${action}d (prototype - no backend)`);
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">Loading queue...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Moderation Queue</h2>
          <p className="text-sm text-zinc-500">
            Review flagged content and take appropriate action
          </p>
        </div>

        {flaggedItems.length === 0 ? (
          <div className="text-center py-16 border border-white/[0.05] rounded-sm bg-card">
            <Icon name="CheckCircleIcon" size={48} className="text-primary mx-auto mb-4" />
            <p className="text-zinc-400">No pending flags. All clear!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedItems.map((item) => (
              <div
                key={item.id}
                className="p-6 border border-white/[0.05] rounded-sm bg-card hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs uppercase tracking-widest rounded-sm ${
                        item.type === 'post'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-sm text-zinc-400">{item.author}</span>
                    <span className="text-xs text-zinc-600">·</span>
                    <span className="text-xs text-zinc-600">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="FlagIcon" size={16} className="text-warning" />
                    <span className="text-sm text-warning">{item.flagCount} flags</span>
                  </div>
                </div>

                <p className="text-white mb-3 leading-relaxed">{item.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Icon name="ExclamationTriangleIcon" size={16} className="text-warning" />
                    <span className="text-sm text-zinc-500">Reason: {item.reason}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      className="px-4 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors rounded-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'warn')}
                      className="px-4 py-2 text-xs uppercase tracking-widest text-warning hover:bg-warning/10 transition-colors rounded-sm"
                    >
                      Warn User
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'remove')}
                      className="px-4 py-2 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-colors rounded-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
