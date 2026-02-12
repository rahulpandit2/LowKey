import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - LowKey',
  description: 'Reach out to the LowKey team. Support, feedback, or reporting issues.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Get in <span className="text-zinc-600 italic">touch.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            We are listening. Questions, feedback, or just want to say hello?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Support</h3>
              <p className="text-zinc-500 mb-4">For account issues and technical help.</p>
              <a
                href="mailto:support@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1"
              >
                support@lowkey.com
              </a>
            </div>

            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Legal & Privacy</h3>
              <p className="text-zinc-500 mb-4">For data requests and legal inquiries.</p>
              <a
                href="mailto:legal@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1"
              >
                legal@lowkey.com
              </a>
            </div>

            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Community</h3>
              <p className="text-zinc-500 mb-4">Report violations or appeal decisions.</p>
              <a
                href="mailto:safety@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1"
              >
                safety@lowkey.com
              </a>
            </div>
          </div>

          {/* Simple Form Placeholder */}
          <div className="border border-white/[0.08] p-8 md:p-12 bg-zinc-900/50">
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Subject
                </label>
                <select className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors">
                  <option>General Inquiry</option>
                  <option>Support Request</option>
                  <option>Feedback & Suggestions</option>
                  <option>Report Content</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-semibold uppercase tracking-[0.2em] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
