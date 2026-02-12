'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type LoginMethod = 'email' | 'handle';

export default function LoginForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;

    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful (prototype - no backend)');
    }, 1500);
  };

  const isFormValid = () => {
    if (loginMethod === 'email') {
      return email.includes('@') && password.length >= 6;
    } else {
      return handle.length >= 3 && password.length >= 6;
    }
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md px-6 py-32">
        <div className="text-center text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-6 py-32 fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 leading-tight">
          Welcome <span className="text-zinc-600 italic">back</span>
        </h1>
        <p className="text-lg text-zinc-400 font-light">
          Sign in to continue your thoughtful journey
        </p>
      </div>

      {/* Login Method Selector */}
      <div className="flex gap-2 mb-8 p-1 bg-zinc-900 border border-white/[0.05] rounded-sm">
        <button
          onClick={() => setLoginMethod('email')}
          className={`flex-1 py-3 text-sm font-medium uppercase tracking-[0.2em] rounded-sm transition-all ${
            loginMethod === 'email' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setLoginMethod('handle')}
          className={`flex-1 py-3 text-sm font-medium uppercase tracking-[0.2em] rounded-sm transition-all ${
            loginMethod === 'handle' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          Handle
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email or Handle Input */}
        {loginMethod === 'email' ? (
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="handle" className="block text-sm text-zinc-400 mb-2">
              Handle
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
              <input
                id="handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="yourhandle"
                className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm pl-12 pr-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>
        )}

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="w-full px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Privacy Note */}
      <div className="mt-12 p-4 border border-white/[0.05] rounded-sm bg-card">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="text-white text-sm font-medium mb-1">Privacy First</h3>
            <p className="text-xs text-zinc-500">
              Your login is secure. We never share your data. Pseudonymous by design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
