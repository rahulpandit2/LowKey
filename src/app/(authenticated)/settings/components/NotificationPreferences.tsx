'use client';


import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NotificationSettings {
  emailDigest: boolean;
  emailReplies: boolean;
  emailMentions: boolean;
  inAppReplies: boolean;
  inAppMentions: boolean;
  inAppAchievements: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function NotificationPreferences() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailDigest: true,
    emailReplies: true,
    emailMentions: false,
    inAppReplies: true,
    inAppMentions: true,
    inAppAchievements: true,
    digestFrequency: 'weekly',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFrequencyChange = (value: 'daily' | 'weekly' | 'monthly') => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, digestFrequency: value }));
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-4xl mx-auto text-center text-zinc-500">Loading preferences...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-t border-white/[0.08]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Notification Preferences</h2>
          <p className="text-sm text-zinc-500">Choose how and when you want to be notified</p>
        </div>

        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-serif text-white mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.emailDigest}
                    onChange={() => handleToggle('emailDigest')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.emailDigest
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.emailDigest && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Activity Digest</h4>
                    <p className="text-sm text-zinc-500 mb-3">
                      Receive periodic summaries of your activity and engagement
                    </p>
                    {settings.emailDigest && (
                      <select
                        value={settings.digestFrequency}
                        onChange={(e) =>
                          handleFrequencyChange(e.target.value as 'daily' | 'weekly' | 'monthly')
                        }
                        className="bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  </div>
                </label>
              </div>

              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.emailReplies}
                    onChange={() => handleToggle('emailReplies')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.emailReplies
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.emailReplies && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Replies to Your Posts</h4>
                    <p className="text-sm text-zinc-500">
                      Get notified when someone responds to your posts
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.emailMentions}
                    onChange={() => handleToggle('emailMentions')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.emailMentions
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.emailMentions && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Mentions</h4>
                    <p className="text-sm text-zinc-500">
                      Get notified when someone mentions your handle
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* In-App Notifications */}
          <div>
            <h3 className="text-lg font-serif text-white mb-4">In-App Notifications</h3>
            <div className="space-y-4">
              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.inAppReplies}
                    onChange={() => handleToggle('inAppReplies')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.inAppReplies
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.inAppReplies && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Replies</h4>
                    <p className="text-sm text-zinc-500">
                      Show in-app notifications for replies to your posts
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.inAppMentions}
                    onChange={() => handleToggle('inAppMentions')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.inAppMentions
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.inAppMentions && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Mentions</h4>
                    <p className="text-sm text-zinc-500">
                      Show in-app notifications when you're mentioned
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.inAppAchievements}
                    onChange={() => handleToggle('inAppAchievements')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                      settings.inAppAchievements
                        ? 'border-primary bg-primary'
                        : 'border-zinc-600 group-hover:border-white'
                    }`}
                  >
                    {settings.inAppAchievements && (
                      <Icon name="CheckIcon" size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">Achievements</h4>
                    <p className="text-sm text-zinc-500">
                      Show notifications when you earn new achievements
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
