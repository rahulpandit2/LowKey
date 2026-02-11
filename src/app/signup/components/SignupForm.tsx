"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";
import Link from "next/link";

export default function SignupForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const checkHandleAvailability = (value: string) => {
    if (value.length < 3) {
      setHandleAvailable(null);
      return;
    }
    // Simulate availability check
    setTimeout(() => {
      setHandleAvailable(value.length >= 3 && !value.includes("admin"));
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully (prototype - no backend)");
    }, 1500);
  };

  const isFormValid = () => {
    return (
      email.includes("@") &&
      handle.length >= 3 &&
      handleAvailable &&
      password.length >= 6 &&
      password === confirmPassword &&
      agreedToTerms
    );
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Weak", color: "text-red-500" };
    if (password.length < 10) return { label: "Medium", color: "text-amber-500" };
    return { label: "Strong", color: "text-primary" };
  };

  const passwordStrength = getPasswordStrength();

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
          Join <span className="text-zinc-600 italic">LowKey</span>
        </h1>
        <p className="text-lg text-zinc-400 font-light">
          Start your thoughtful journey. No vanity metrics. Just real growth.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
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
          <p className="text-xs text-zinc-500 mt-2">
            Used for account recovery. Never shared publicly.
          </p>
        </div>

        {/* Handle Input */}
        <div>
          <label htmlFor="handle" className="block text-sm text-zinc-400 mb-2">
            Choose Your Handle
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
            <input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                setHandle(value);
                checkHandleAvailability(value);
              }}
              placeholder="yourhandle"
              className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm pl-12 pr-12 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
              required
            />
            {handleAvailable !== null && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {handleAvailable ? (
                  <Icon name="CheckCircleIcon" size={20} className="text-primary" />
                ) : (
                  <Icon name="XCircleIcon" size={20} className="text-red-500" />
                )}
              </div>
            )}
          </div>
          {handle.length > 0 && handle.length < 3 && (
            <p className="text-xs text-zinc-500 mt-2">Handle must be at least 3 characters</p>
          )}
          {handleAvailable === false && handle.length >= 3 && (
            <p className="text-xs text-red-500 mt-2">Handle not available. Try another.</p>
          )}
          {handleAvailable === true && (
            <p className="text-xs text-primary mt-2">Handle available!</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <Icon name={showPassword ? "EyeSlashIcon" : "EyeIcon"} size={20} />
            </button>
          </div>
          {passwordStrength && (
            <p className={`text-xs mt-2 ${passwordStrength.color}`}>
              Password strength: {passwordStrength.label}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-zinc-400 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full bg-zinc-900 border border-white/[0.05] rounded-sm px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
            required
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
          )}
          {confirmPassword.length > 0 && password === confirmPassword && (
            <p className="text-xs text-primary mt-2">Passwords match</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 bg-zinc-900 border border-white/[0.05] rounded-sm focus:ring-primary"
            required
          />
          <label htmlFor="terms" className="text-xs text-zinc-500">
            I agree to the{" "}
            <Link href="/about#policy" className="text-primary hover:text-primary/80">
              Community Policy
            </Link>{" "}
            and{" "}
            <Link href="/about#privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="w-full px-12 py-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold uppercase tracking-[0.2em] transition-all rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Privacy Features */}
      <div className="mt-12 space-y-4">
        <div className="p-4 border border-white/[0.05] rounded-sm bg-card">
          <div className="flex items-start gap-3">
            <Icon name="ShieldCheckIcon" size={20} className="text-primary mt-1" />
            <div>
              <h3 className="text-white text-sm font-medium mb-1">Pseudonymous by Default</h3>
              <p className="text-xs text-zinc-500">
                Your handle is your identity. No real names required.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 border border-white/[0.05] rounded-sm bg-card">
          <div className="flex items-start gap-3">
            <Icon name="EyeSlashIcon" size={20} className="text-primary mt-1" />
            <div>
              <h3 className="text-white text-sm font-medium mb-1">No Public Metrics</h3>
              <p className="text-xs text-zinc-500">
                Your growth is private. No leaderboards or vanity metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}