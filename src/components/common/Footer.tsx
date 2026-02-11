import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

export default function Footer() {
  const footerLinks = [
    { id: "footer_about", label: "About", href: "/about" },
    { id: "footer_privacy", label: "Privacy", href: "/about#privacy" },
    { id: "footer_policy", label: "Community Policy", href: "/about#policy" },
    { id: "footer_contact", label: "Contact", href: "/about#contact" },
  ];

  const socialLinks = [
    { id: "social_github", name: "GitHub", icon: "CodeBracketIcon", href: "#" },
    { id: "social_twitter", name: "Twitter", icon: "ChatBubbleLeftIcon", href: "#" },
  ];

  return (
    <footer className="bg-background py-20 px-6 md:px-12 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        {/* Single Row Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-8">
            <span className="text-xl font-serif tracking-tight text-white">LowKey</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">
              © 2026 The Good Internet Project
            </span>
          </div>

          {/* Links */}
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

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label={social.name}
              >
                <Icon name={social.icon as any} size={20} variant="outline" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}