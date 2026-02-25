import Link from 'next/link';
import { query } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

type SocialLink = { enabled: boolean; url: string };

async function getSettings(): Promise<Record<string, any>> {
  noStore();
  try {
    const res = await query<{ key: string; value: any }>(
      `SELECT key, value FROM site_settings`
    );
    const settings: Record<string, any> = {};
    for (const r of res.rows) {
      settings[r.key] = r.value;
    }
    return settings;
  } catch {
    return {};
  }
}

export default async function Footer() {
  const settings = await getSettings();
  const social = typeof settings.social_links === 'object' ? settings.social_links :
    (typeof settings.social_links === 'string' ? JSON.parse(settings.social_links || '{}') : {});

  const footerLinks = [
    { id: 'footer_about', label: 'About', href: '/about' },
    { id: 'footer_privacy', label: 'Privacy', href: '/privacy-policy' },
    { id: 'footer_policy', label: 'Community Policy', href: '/guidelines#community-policy' },
    { id: 'footer_contact', label: 'Contact', href: '/contact' },
  ];

  const socialPlatforms = [
    { key: 'github', label: 'GitHub' },
    { key: 'x', label: 'X' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'discord', label: 'Discord' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitch', label: 'Twitch' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'tiktok', label: 'TikTok' },
  ];

  const socialLinks: { id: string; label: string; href: string }[] = [];
  for (const p of socialPlatforms) {
    const link = social[p.key] as SocialLink | undefined;
    if (link?.enabled && link.url) {
      socialLinks.push({ id: `social_${p.key}`, label: p.label, href: link.url });
    }
  }

  const showBusiness = settings.show_business_info === 'true' || settings.show_business_info === true;
  const address = settings.business_address;
  const hours = settings.business_hours;

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
            <div className="flex flex-wrap items-center gap-5">
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

        {showBusiness && (address || hours) && (
          <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row gap-12 text-xs text-zinc-500">
            {address && (
              <div>
                <p className="font-serif text-white text-sm mb-2">Headquarters</p>
                <div className="whitespace-pre-line leading-relaxed">{address}</div>
              </div>
            )}
            {hours && (
              <div>
                <p className="font-serif text-white text-sm mb-2">Business Hours</p>
                <div className="whitespace-pre-line leading-relaxed">{hours}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
