'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AdminStats() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const stats = [
    {
      id: 'pending_flags',
      label: 'Pending Flags',
      value: '12',
      icon: 'FlagIcon',
      color: 'text-warning',
    },
    {
      id: 'help_posts',
      label: 'Active Help Posts',
      value: '34',
      icon: 'ChatBubbleLeftRightIcon',
      color: 'text-primary',
    },
    {
      id: 'resolved_today',
      label: 'Resolved Today',
      value: '8',
      icon: 'CheckCircleIcon',
      color: 'text-success',
    },
    {
      id: 'active_users',
      label: 'Active Users (24h)',
      value: '1,247',
      icon: 'UsersIcon',
      color: 'text-accent',
    },
  ];

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">Loading stats...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 border border-white/[0.05] rounded-sm bg-card hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon name={stat.icon as any} size={24} className={stat.color} />
                <span className="text-3xl font-serif text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
