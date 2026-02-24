'use client';

import { useState, useEffect } from 'react';

type Settings = {
    site_name: string;
    site_tagline: string;
    registration_enabled: string;
    maintenance_mode: string;
    max_post_length: string;
    allow_incognito_posts: string;
    require_email_verification: string;
    announcement: string;
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        site_name: 'LowKey',
        site_tagline: 'The quiet internet.',
        registration_enabled: 'true',
        maintenance_mode: 'false',
        max_post_length: '2000',
        allow_incognito_posts: 'true',
        require_email_verification: 'false',
        announcement: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/server-admin/settings')
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (d?.data && Object.keys(d.data).length > 0) setSettings(d.data as Settings);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        const res = await fetch('/api/server-admin/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        const data = await res.json();
        setSaving(false);
        setMsg(res.ok ? 'Settings saved.' : (data.error || 'Failed to save.'));
        setTimeout(() => setMsg(''), 3000);
    };

    const toggle = (key: keyof Settings) =>
        setSettings((s) => ({ ...s, [key]: s[key] === 'true' ? 'false' : 'true' }));

    const ToggleRow = ({ label, desc, settingKey }: { label: string; desc: string; settingKey: keyof Settings }) => (
        <div className="flex items-start justify-between py-4 border-b border-white/[0.04]">
            <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
            </div>
            <button
                onClick={() => toggle(settingKey)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ml-4 ${settings[settingKey] === 'true' ? 'bg-white' : 'bg-zinc-700'}`}
            >
                <div className={`w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all ${settings[settingKey] === 'true' ? 'right-[3px] bg-black' : 'left-[3px] bg-zinc-400'}`} />
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-2xl">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-6 h-[1px] bg-white/20" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Administration</span>
                </div>
                <h1 className="font-serif text-3xl text-white">Site Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Global platform configuration.</p>
            </header>

            {msg && <div className="mb-6 p-4 border border-white/10 text-sm text-zinc-300">{msg}</div>}

            {loading ? (
                <div className="space-y-6">{Array(6).fill(0).map((_, i) => <div key={i} className="h-12 bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="space-y-10">
                    {/* Branding */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 pb-2 border-b border-white/[0.05]">Branding</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Site Name</label>
                                <input type="text" value={settings.site_name} onChange={(e) => setSettings(s => ({ ...s, site_name: e.target.value }))}
                                    className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Tagline</label>
                                <input type="text" value={settings.site_tagline} onChange={(e) => setSettings(s => ({ ...s, site_tagline: e.target.value }))}
                                    className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
                            </div>
                        </div>
                    </section>

                    {/* Feature Flags */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-2 pb-2 border-b border-white/[0.05]">Feature Flags</h2>
                        <ToggleRow label="User Registration" desc="Allow new users to sign up" settingKey="registration_enabled" />
                        <ToggleRow label="Maintenance Mode" desc="Show maintenance page to regular users" settingKey="maintenance_mode" />
                        <ToggleRow label="Incognito Posts" desc="Allow users to post anonymously" settingKey="allow_incognito_posts" />
                        <ToggleRow label="Email Verification" desc="Require email verification before login" settingKey="require_email_verification" />
                    </section>

                    {/* Limits */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 pb-2 border-b border-white/[0.05]">Limits</h2>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Max Post Length (characters)</label>
                            <input type="number" value={settings.max_post_length} onChange={(e) => setSettings(s => ({ ...s, max_post_length: e.target.value }))}
                                className="w-40 bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
                        </div>
                    </section>

                    {/* Announcement */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 pb-2 border-b border-white/[0.05]">Site Announcement</h2>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">Banner Message (leave blank to hide)</label>
                            <textarea value={settings.announcement} onChange={(e) => setSettings(s => ({ ...s, announcement: e.target.value }))} rows={3}
                                placeholder="e.g. Scheduled maintenance on Sunday..."
                                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-white/30 transition-colors resize-none" />
                        </div>
                    </section>

                    <button onClick={save} disabled={saving} className="px-8 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-100 transition-colors disabled:opacity-40">
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            )}
        </div>
    );
}
