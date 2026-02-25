import Link from 'next/link';
import { getOne } from '@/lib/db';

type SocialLink = { enabled: boolean; url: string };

async function getSocialLinks(): Promise<Record<string, SocialLink>> {
  try {
    const row = await getOne<{ value: string }>(
      `SELECT value FROM site_settings WHERE key = 'social_links'`,
      []
    );
    return row ? JSON.parse(row.value) : {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const social = await getSocialLinks();

  const footerLinks = [
    { id: 'footer_about', label: 'About', href: '/about' },
    { id: 'footer_privacy', label: 'Privacy', href: '/privacy-policy' },
    { id: 'footer_policy', label: 'Community Policy', href: '/guidelines#community-policy' },
    { id: 'footer_contact', label: 'Contact', href: '/contact' },
  ];

  // Only render a social link if it is enabled and has a URL
  const socialLinks: { id: string; label: string; href: string }[] = [];
  if (social.github?.enabled && social.github.url) {
    socialLinks.push({ id: 'social_github', label: 'GitHub', href: social.github.url });
  }
  if (social.x?.enabled && social.x.url) {
    socialLinks.push({ id: 'social_x', label: 'X', href: social.x.url });
  }
  if (social.linkedin?.enabled && social.linkedin.url) {
    socialLinks.push({ id: 'social_linkedin', label: 'LinkedIn', href: social.linkedin.url });
  }
  if (social.instagram?.enabled && social.instagram.url) {
    socialLinks.push({ id: 'social_instagram', label: 'Instagram', href: social.instagram.url });
  }

  return (
    <footer className="bg-background py-20 px-6 md:px-12 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-8">
            <span className="text-xl font-serif tracking-tight text-white">LowKey</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">
              © 2026 The Good Internet Project
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest">
            {footerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links — only if admin enabled */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-5">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
