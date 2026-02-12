'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PrivacySettings {
  profileVisibility: 'minimal' | 'private' | 'community';
  showReflectionPoints: boolean;
  showAchievements: boolean;
  allowDirectMessages: boolean;
  dataSharing: boolean;
}

export default function PrivacyControls() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'minimal',
    showReflectionPoints: false,
    showAchievements: true,
    allowDirectMessages: true,
    dataSharing: false,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleToggle = (key: keyof PrivacySettings) => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVisibilityChange = (value: 'minimal' | 'private' | 'community') => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, profileVisibility: value }));
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-4xl mx-auto text-center text-zinc-500">Loading settings...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Privacy Controls</h2>
          <p className="text-sm text-zinc-500">Control who can see your profile and activity</p>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="mb-4">
              <h3 className="text-white font-medium mb-1">Profile Visibility</h3>
              <p className="text-sm text-zinc-500">
                Control how much of your profile is visible to others
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  value: 'minimal',
                  label: 'Minimal',
                  description: 'Only handle and basic activity visible (default)',
                },
                {
                  value: 'private',
                  label: 'Private',
                  description: 'Only you can see your full profile',
                },
                {
                  value: 'community',
                  label: 'Community Visible',
                  description: 'Full profile visible to community members',
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-4 p-4 border border-white/[0.05] rounded-sm cursor-pointer hover:border-white/10 transition-colors"
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={settings.profileVisibility === option.value}
                    onChange={() =>
                      handleVisibilityChange(option.value as 'minimal' | 'private' | 'community')
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors ${
                      settings.profileVisibility === option.value
                        ? 'border-primary'
                        : 'border-zinc-600'
                    }`}
                  >
                    {settings.profileVisibility === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{option.label}</h4>
                    <p className="text-sm text-zinc-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Show Reflection Points */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.showReflectionPoints}
                onChange={() => handleToggle('showReflectionPoints')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                  settings.showReflectionPoints
                    ? 'border-primary bg-primary'
                    : 'border-zinc-600 group-hover:border-white'
                }`}
              >
                {settings.showReflectionPoints && (
                  <Icon name="CheckIcon" size={12} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Show Reflection Points</h3>
                <p className="text-sm text-zinc-500">
                  Display your reflection points on your profile (always private by default)
                </p>
              </div>
            </label>
          </div>

          {/* Show Achievements */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.showAchievements}
                onChange={() => handleToggle('showAchievements')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                  settings.showAchievements
                    ? 'border-primary bg-primary'
                    : 'border-zinc-600 group-hover:border-white'
                }`}
              >
                {settings.showAchievements && (
                  <Icon name="CheckIcon" size={12} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Show Cosmetic Achievements</h3>
                <p className="text-sm text-zinc-500">
                  Display earned badges and achievements on your profile
                </p>
              </div>
            </label>
          </div>

          {/* Allow Direct Messages */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.allowDirectMessages}
                onChange={() => handleToggle('allowDirectMessages')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                  settings.allowDirectMessages
                    ? 'border-primary bg-primary'
                    : 'border-zinc-600 group-hover:border-white'
                }`}
              >
                {settings.allowDirectMessages && (
                  <Icon name="CheckIcon" size={12} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Allow Direct Messages</h3>
                <p className="text-sm text-zinc-500">
                  Let community members send you private messages
                </p>
              </div>
            </label>
          </div>

          {/* Data Sharing */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.dataSharing}
                onChange={() => handleToggle('dataSharing')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                  settings.dataSharing
                    ? 'border-primary bg-primary'
                    : 'border-zinc-600 group-hover:border-white'
                }`}
              >
                {settings.dataSharing && <Icon name="CheckIcon" size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Anonymous Usage Analytics</h3>
                <p className="text-sm text-zinc-500">
                  Help improve LowKey by sharing anonymous usage data
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
