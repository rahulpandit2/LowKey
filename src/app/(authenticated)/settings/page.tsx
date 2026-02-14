'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { settings as settingsApi, auth as authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

type SettingsData = {
  account: { username: string; email: string; phone: string | null; email_verified: boolean; mfa_enabled: boolean };
  profile: { display_name: string; bio: string; avatar_url: string; location: string; website: string; locale: string; timezone: string } | null;
  privacy: { visibility: string; default_post_visibility: string; allow_dms_from: string; show_points: boolean; show_badges: boolean; show_achievements: boolean } | null;
  security: { active_sessions: number; mfa_enabled: boolean };
  points: { balance: number } | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [msg, setMsg] = useState('');

  // Editable fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [defaultVisibility, setDefaultVisibility] = useState('public');
  const [allowDms, setAllowDms] = useState('everyone');
  const [showPoints, setShowPoints] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);

  useEffect(() => {
    settingsApi.get().then((res) => {
      if (res.data) {
        const d = res.data as SettingsData;
        setData(d);
        if (d.profile) {
          setDisplayName(d.profile.display_name || '');
          setBio(d.profile.bio || '');
          setLocation(d.profile.location || '');
          setWebsite(d.profile.website || '');
        }
        if (d.privacy) {
          setDefaultVisibility(d.privacy.default_post_visibility || 'public');
          setAllowDms(d.privacy.allow_dms_from || 'everyone');
          setShowPoints(d.privacy.show_points);
          setShowBadges(d.privacy.show_badges);
          setShowAchievements(d.privacy.show_achievements);
        }
      }
      setLoading(false);
    });
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const res = await settingsApi.update('profile', { display_name: displayName, bio, location, website });
    setMsg(res.error || 'Profile saved.');
    setSaving(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const savePrivacy = async () => {
    setSaving(true);
    const res = await settingsApi.update('privacy', {
      default_post_visibility: defaultVisibility,
      allow_dms_from: allowDms,
      show_points: showPoints,
      show_badges: showBadges,
      show_achievements: showAchievements,
    });
    setMsg(res.error || 'Privacy settings saved.');
    setSaving(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/login');
  };

  const TABS = [
    { key: 'profile', label: 'Profile', icon: 'UserIcon' },
    { key: 'privacy', label: 'Privacy', icon: 'ShieldCheckIcon' },
    { key: 'security', label: 'Security', icon: 'LockClosedIcon' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-white/30"></div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Preferences</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white">Settings</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-10 border-b border-white/[0.08] pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${activeTab === t.key
                ? 'text-white border-white'
                : 'text-zinc-500 border-transparent hover:text-white'
              }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Status */}
      {msg && (
        <div className="mb-6 py-3 px-4 border border-white/10 bg-white/[0.02] text-sm text-white">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/[0.05] p-6 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                  />
                </div>
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-8 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Default Post Visibility</label>
                <select
                  value={defaultVisibility}
                  onChange={(e) => setDefaultVisibility(e.target.value)}
                  className="w-full bg-black border-b border-white/10 py-3 text-white focus:outline-none text-sm"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers Only</option>
                  <option value="community">Community Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">Allow DMs From</label>
                <select
                  value={allowDms}
                  onChange={(e) => setAllowDms(e.target.value)}
                  className="w-full bg-black border-b border-white/10 py-3 text-white focus:outline-none text-sm"
                >
                  <option value="everyone">Everyone</option>
                  <option value="followers">Followers</option>
                  <option value="none">No one</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">Visibility Toggles</label>
                {[
                  { key: 'points', label: 'Show Points', value: showPoints, set: setShowPoints },
                  { key: 'badges', label: 'Show Badges', value: showBadges, set: setShowBadges },
                  { key: 'achievements', label: 'Show Achievements', value: showAchievements, set: setShowAchievements },
                ].map(({ key, label, value, set }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-300">{label}</span>
                    <button
                      onClick={() => set(!value)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-white' : 'bg-zinc-700'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all ${value ? 'right-[3px] bg-black' : 'left-[3px] bg-zinc-400'
                        }`}></div>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={savePrivacy}
                disabled={saving}
                className="px-8 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Privacy'}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="border border-white/[0.05] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">Active Sessions</h3>
                    <p className="text-xs text-zinc-500">You have {data?.security?.active_sessions || 0} active sessions.</p>
                  </div>
                  <span className="text-lg font-serif text-white">{data?.security?.active_sessions || 0}</span>
                </div>
              </div>
              <div className="border border-white/[0.05] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">Two-Factor Authentication</h3>
                    <p className="text-xs text-zinc-500">{data?.security?.mfa_enabled ? 'Enabled' : 'Not enabled'}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${data?.security?.mfa_enabled ? 'text-green-400 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'
                    }`}>
                    {data?.security?.mfa_enabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full py-3 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors text-xs uppercase tracking-widest"
              >
                Sign Out
              </button>

              {/* Danger Zone */}
              <div className="mt-8 p-6 border border-red-500/20 bg-red-500/[0.03]">
                <h3 className="text-red-400 font-medium text-sm mb-2">Danger Zone</h3>
                <p className="text-zinc-500 text-xs mb-4">Once your account is deleted, there is no going back.</p>
                <button className="px-6 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-xs uppercase tracking-widest">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
