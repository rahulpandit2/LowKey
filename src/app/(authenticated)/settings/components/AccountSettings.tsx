'use client';


import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AccountSettings() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [handle, setHandle] = useState('username');
  const [email, setEmail] = useState('user@example.com');
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSaveHandle = () => {
    if (!isHydrated) return;
    setIsEditingHandle(false);
    alert('Handle updated (prototype - no backend)');
  };

  const handleSaveEmail = () => {
    if (!isHydrated) return;
    setIsEditingEmail(false);
    alert('Email updated (prototype - no backend)');
  };

  const handleExportData = () => {
    if (!isHydrated) return;
    alert('Data export initiated (prototype - no backend)');
  };

  const handleDeleteAccount = () => {
    if (!isHydrated) return;
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      alert('Account deletion initiated (prototype - no backend)');
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-4xl mx-auto text-center text-zinc-500">Loading settings...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-t border-white/[0.08]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Account Settings</h2>
          <p className="text-sm text-zinc-500">Manage your account details and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Handle */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium mb-1">Handle</h3>
                <p className="text-sm text-zinc-500">Your pseudonymous username</p>
              </div>
              {!isEditingHandle && (
                <button
                  onClick={() => setIsEditingHandle(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingHandle ? (
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) =>
                      setHandle(e?.target?.value?.toLowerCase()?.replace(/[^a-z0-9_]/g, ''))
                    }
                    className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={handleSaveHandle}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingHandle(false)}
                  className="px-6 py-2 border border-white/20 hover:border-white text-white text-sm font-medium rounded-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-white">@{handle}</p>
            )}
          </div>

          {/* Email */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium mb-1">Email Address</h3>
                <p className="text-sm text-zinc-500">Used for account recovery and notifications</p>
              </div>
              {!isEditingEmail && (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingEmail ? (
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  className="flex-1 bg-zinc-900 border border-white/[0.05] rounded-sm px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSaveEmail}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingEmail(false)}
                  className="px-6 py-2 border border-white/20 hover:border-white text-white text-sm font-medium rounded-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-white">{email}</p>
            )}
          </div>

          {/* Password */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Password</h3>
                <p className="text-sm text-zinc-500">Last changed 3 months ago</p>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Points Decay */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Points Decay</h3>
                <p className="text-sm text-zinc-500">
                  Reflection points naturally decay during inactivity to encourage consistent
                  engagement
                </p>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Opt Out
              </button>
            </div>
          </div>

          {/* Data Export */}
          <div className="p-6 border border-white/[0.05] rounded-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Export Your Data</h3>
                <p className="text-sm text-zinc-500">
                  Download a copy of all your posts, comments, and activity
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-6 py-2 border border-white/20 hover:border-white text-white text-sm font-medium rounded-sm transition-colors flex items-center gap-2"
              >
                <Icon name="ArrowDownTrayIcon" size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-6 border border-destructive/20 rounded-sm bg-destructive/5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-destructive font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-zinc-500">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-medium rounded-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
