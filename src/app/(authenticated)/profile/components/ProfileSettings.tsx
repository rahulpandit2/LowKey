'use client';


import { useState, useEffect } from 'react';

export default function ProfileSettings() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: 'minimal',
    emailDigest: true,
    pointsDecay: false,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleToggle = (key: string) => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">Loading settings...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Settings</h2>
          <p className="text-sm text-zinc-500">
            Manage your privacy, notifications, and preferences.
          </p>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Profile Visibility */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-medium mb-1">Profile Visibility</h3>
                <p className="text-sm text-zinc-500">
                  Currently set to: <span className="text-white">{settings.profileVisibility}</span>
                </p>
              </div>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, profileVisibility: e.target.value }))
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value="minimal">Minimal (default)</option>
              <option value="private">Private (only you)</option>
              <option value="community">Community visible</option>
            </select>
          </div>

          {/* Email Digest */}
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
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Email Digest</h3>
                <p className="text-sm text-zinc-500">Receive weekly summary of activity</p>
              </div>
            </label>
          </div>

          {/* Points Decay Opt-Out */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.pointsDecay}
                onChange={() => handleToggle('pointsDecay')}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-sm mt-0.5 flex items-center justify-center transition-colors ${
                  settings.pointsDecay
                    ? 'border-primary bg-primary'
                    : 'border-zinc-600 group-hover:border-white'
                }`}
              >
                {settings.pointsDecay && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Opt Out of Points Decay</h3>
                <p className="text-sm text-zinc-500">
                  Keep your points from decaying during inactivity
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
