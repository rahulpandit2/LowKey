'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function ServerAdminSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'check' | 'create'>('check');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          display_name: formData.displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create admin account');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/server-admin/overview');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="font-serif text-3xl text-white">LowKey</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded-sm">
              Server Admin
            </span>
          </div>
          <h1 className="text-4xl font-serif text-white mb-4">First-Time Setup</h1>
          <p className="text-zinc-400">
            Create the primary server administrator account. This account will have full access to all
            administrative functions.
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/[0.06] rounded-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm text-zinc-400 mb-2">
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm text-zinc-400 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                    })
                  }
                  placeholder="admin"
                  className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@lowkey.com"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a strong password"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-zinc-400 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold uppercase tracking-wider transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-sm">
            <div className="flex items-start gap-3">
              <Icon name="ExclamationTriangleIcon" size={20} className="text-amber-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-400 mb-1">Important</h3>
                <p className="text-xs text-amber-400/80">
                  This account will have full administrative privileges. Store credentials securely.
                  This setup page will be disabled after the first admin account is created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
