import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - LowKey',
  description: 'How we protect your data and your right to a quiet internet.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight">
          Privacy <span className="text-zinc-600 italic">First.</span>
        </h1>

        <div className="prose prose-invert prose-lg max-w-none text-zinc-400 font-light space-y-12">
          <p className="text-xl leading-relaxed">
            Data exists to serve you, not to be sold. We collect the minimum data necessary to
            create a safe, functioning community.
          </p>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">1. What We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Account Info:</strong> Username, email, password hash.
              </li>
              <li>
                <strong>Activity:</strong> Posts, comments, and reactions.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address and login timestamps for security.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">2. No Selling</h2>
            <p>
              We do not sell your personal data to advertisers. We do not use your private content
              to train generative AI models without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">3. Data Retention</h2>
            <p>
              We keep your data only as long as your account is active. If you delete your account,
              data is erased after a 30-day recovery window.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">4. Cookies</h2>
            <p>
              We use essential cookies for login and security only. No third-party tracking cookies.
            </p>
          </section>

          <div className="pt-12 border-t border-white/[0.08]">
            <p className="text-sm text-zinc-500">Last updated: February 11, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
