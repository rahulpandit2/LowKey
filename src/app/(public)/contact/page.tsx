'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const REASONS = [
  { value: 'query', label: 'General Query' },
  { value: 'support', label: 'Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'report', label: 'Report' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    reason: 'query',
    message: '',
    consent_emails: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ first_name: '', last_name: '', email: '', reason: 'query', message: '', consent_emails: false });
      } else {
        setStatus('error');
        setErrorMsg(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not reach our servers. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Get in <span className="text-zinc-600 italic">touch.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            We are listening. Questions, feedback, or concerns — real humans are reading these.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Support</h3>
              <p className="text-zinc-500 mb-4 text-sm">For account issues and technical help.</p>
              <a
                href="mailto:support@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1 text-sm"
              >
                support@lowkey.com
              </a>
            </div>

            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Safety</h3>
              <p className="text-zinc-500 mb-4 text-sm">Report violations or request content review.</p>
              <a
                href="mailto:safety@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1 text-sm"
              >
                safety@lowkey.com
              </a>
            </div>

            <div className="p-8 border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white mb-2">Legal &amp; Privacy</h3>
              <p className="text-zinc-500 mb-4 text-sm">Data requests and legal inquiries.</p>
              <a
                href="mailto:legal@lowkey.com"
                className="text-white hover:text-zinc-300 transition-colors border-b border-white/20 pb-1 text-sm"
              >
                legal@lowkey.com
              </a>
            </div>

            <div className="p-6 border border-white/[0.05] bg-white/[0.01]">
              <p className="text-zinc-600 text-sm">
                We aim to respond within 2 business days. For urgent safety concerns, please contact your local emergency services.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-white/[0.08] p-8 md:p-12 bg-zinc-900/50">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-10 h-[1px] bg-white/20 mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-white mb-3">Message received.</h3>
                <p className="text-zinc-400 text-sm">
                  We will get back to you within 2 business days.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                      placeholder="First"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                      placeholder="Last"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                    Reason
                  </label>
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm appearance-none"
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-zinc-900 border border-white/[0.1] p-3 text-white focus:outline-none focus:border-white/40 transition-colors resize-none text-sm"
                    placeholder="How can we help?"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="consent_emails"
                    checked={form.consent_emails}
                    onChange={handleChange}
                    className="mt-0.5 accent-white"
                  />
                  <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                    I consent to receive email replies about this enquiry.
                  </span>
                </label>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-semibold uppercase tracking-[0.2em] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
