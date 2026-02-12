'use client';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-2">Settings</h1>
      <p className="text-zinc-400 mb-12">Manage your account and preferences.</p>

      <div className="space-y-2">
        {/* Account Section */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-zinc-900">
            <h2 className="font-bold text-zinc-300 text-sm uppercase tracking-wider">Account</h2>
          </div>
          <div className="divide-y divide-white/5">
            <Link
              href="/settings/account"
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Icon name="UserIcon" size={20} className="text-zinc-500" />
                <div>
                  <p className="text-white font-medium">Personal Information</p>
                  <p className="text-xs text-zinc-500">Update your name, email, and phone.</p>
                </div>
              </div>
              <Icon name="ChevronRightIcon" size={16} className="text-zinc-600" />
            </Link>
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Icon name="LockClosedIcon" size={20} className="text-zinc-500" />
                <div>
                  <p className="text-white font-medium">Security</p>
                  <p className="text-xs text-zinc-500">Password and 2FA.</p>
                </div>
              </div>
              <Icon name="ChevronRightIcon" size={16} className="text-zinc-600" />
            </Link>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden mt-8">
          <div className="p-4 border-b border-white/5 bg-zinc-900">
            <h2 className="font-bold text-zinc-300 text-sm uppercase tracking-wider">Privacy</h2>
          </div>
          <div className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Icon name="EyeIcon" size={20} className="text-zinc-500" />
                <div>
                  <p className="text-white font-medium">Default Post Visibility</p>
                  <p className="text-xs text-zinc-500">Choose who can see your posts by default.</p>
                </div>
              </div>
              <select className="bg-black border border-white/20 rounded px-2 py-1 text-sm text-zinc-300">
                <option>Public</option>
                <option>Followers</option>
                <option>Only Me</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Icon name="ShieldCheckIcon" size={20} className="text-zinc-500" />
                <div>
                  <p className="text-white font-medium">Allow Incognito Messages</p>
                  <p className="text-xs text-zinc-500">Receive DMs from incognito users?</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 p-6 border border-red-500/20 bg-red-500/5 rounded-xl">
          <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded transition-all text-sm font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
