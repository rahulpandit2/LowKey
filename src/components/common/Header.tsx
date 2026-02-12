'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'nav_about', label: 'About', href: '/about' },
    { id: 'nav_features', label: 'Features', href: '/features' },
    { id: 'nav_how_it_works', label: 'How It Works', href: '/#how-it-works' },
    { id: 'nav_community', label: 'Community', href: '/communities' },
    { id: 'nav_guidelines', label: 'Guidelines', href: '/guidelines' },
    { id: 'nav_help', label: 'Help', href: '/help' },
  ];

  return (
    <header
      className={`fixed z-50 w-full top-0 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.08]'
          : 'mix-blend-difference'
      }`}
    >
      <nav className="w-full px-6 md:px-12 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-serif font-medium text-xl tracking-tight text-white group-hover:opacity-70 transition-opacity">
            LowKey
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12 text-[10px] font-medium tracking-[0.2em] uppercase text-white/60">
          {navLinks?.map((link) => (
            <Link
              key={link?.id}
              href={link?.href}
              className={`hover:text-white transition-colors duration-300 relative group ${
                pathname === link?.href ? 'text-white' : ''
              }`}
            >
              {link?.label}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${
                  pathname === link?.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:text-zinc-300 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all rounded-none"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          <Icon name={mobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} variant="outline" />
        </button>
      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-white/[0.08] px-6 py-6">
          <div className="flex flex-col gap-6 text-sm font-medium text-white/60">
            {navLinks?.map((link) => (
              <Link
                key={link?.id}
                href={link?.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`hover:text-white transition-colors ${
                  pathname === link?.href ? 'text-white' : ''
                }`}
              >
                {link?.label}
              </Link>
            ))}
            <Link
              href="/post-composer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all rounded-none text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
