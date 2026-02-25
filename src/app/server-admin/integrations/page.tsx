'use client';

import { useState, useEffect } from 'react';
import Icon from "@/components/ui/AppIcon";

type Webhook = {
    id: string;
    name: string;
    url: string;
    events: string[];
    is_active: boolean;
};

export default function AdminIntegrationsPage() {
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');

    const [aws, setAws] = useState({ enabled: false, region: '', bucket: '', access_key: '', secret_key: '' });
    const [smtp, setSmtp] = useState({ enabled: false, host: '', port: '', username: '', password: '', from_email: '' });
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    const [configModal, setConfigModal] = useState<'aws' | 'smtp' | null>(null);
    const [webhookModal, setWebhookModal] = useState<Webhook | 'new' | null>(null);
    const [saving, setSaving] = useState(false);

    const [editConfig, setEditConfig] = useState<any>(null); // holds temp state for S3/SMTP
    const [editWebhook, setEditWebhook] = useState<Webhook | null>(null); // holds temp state for Webhook

    useEffect(() => {
        Promise.all([
            fetch('/api/server-admin/integrations/config').then(r => r.json()),
            fetch('/api/server-admin/integrations/webhooks').then(r => r.json())
        ]).then(([confData, hookData]) => {
            if (confData.data) {
                setAws(confData.data.aws);
                setSmtp(confData.data.smtp);
            }
            if (hookData.data) {
                setWebhooks(hookData.data);
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
        setMsg(text);
        setMsgType(type);
        setTimeout(() => setMsg(''), 4000);
    };

    const openConfig = (type: 'aws' | 'smtp') => {
        setConfigModal(type);
        setEditConfig(type === 'aws' ? { ...aws } : { ...smtp });
    };

    const saveConfig = async () => {
        setSaving(true);
        const res = await fetch('/api/server-admin/integrations/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: configModal, config: editConfig })
        });
        const data = await res.json();
        setSaving(false);

        if (res.ok) {
            if (configModal === 'aws') setAws(editConfig);
            if (configModal === 'smtp') setSmtp(editConfig);
            setConfigModal(null);
            showMsg(data.data?.message || 'Config saved.', 'ok');
        } else {
            showMsg(data.error || 'Failed to save config.', 'err');
        }
    };

    const openWebhook = (wh: Webhook | 'new') => {
        setWebhookModal(wh);
        if (wh === 'new') {
            setEditWebhook({ id: '', name: '', url: '', events: [], is_active: true });
        } else {
            setEditWebhook({ ...wh });
        }
    };

    const saveWebhook = async () => {
        setSaving(true);
        const res = await fetch('/api/server-admin/integrations/webhooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editWebhook)
        });
        const data = await res.json();
        setSaving(false);

        if (res.ok) {
            setWebhookModal(null);
            if (!editWebhook?.id) {
                // simple reload on new
                const refresh = await fetch('/api/server-admin/integrations/webhooks').then(r => r.json());
                setWebhooks(refresh.data || []);
            } else {
                setWebhooks(prev => prev.map(w => w.id === editWebhook.id ? editWebhook : w));
            }
            showMsg('Webhook saved.', 'ok');
        } else {
            showMsg(data.error || 'Failed to save webhook.', 'err');
        }
    };

    const deleteWebhook = async (id: string) => {
        if (!confirm('Delete this webhook?')) return;
        const res = await fetch('/api/server-admin/integrations/webhooks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setWebhooks(prev => prev.filter(w => w.id !== id));
            showMsg('Webhook deleted.', 'ok');
            if (webhookModal && typeof webhookModal !== 'string' && webhookModal.id === id) {
                setWebhookModal(null);
            }
        } else {
            showMsg('Failed to delete.', 'err');
        }
    };

    return (
        <div className="p-8 max-w-5xl">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
                <p className="text-zinc-500 text-sm">Manage third-party connections and webhooks.</p>
            </header>

            {msg && (
                <div className={`mb-6 p-4 border text-sm ${msgType === 'ok' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/[0.04]' : 'border-red-500/20 text-red-400 bg-red-500/[0.04]'}`}>
                    {msg}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    <div className="h-32 bg-white/[0.03] animate-pulse rounded-xl" />
                    <div className="h-32 bg-white/[0.03] animate-pulse rounded-xl" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* AWS Card */}
                        <div className={`border ${aws.enabled ? 'bg-zinc-900 border-green-500/20' : 'bg-black border-white/5'} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${aws.enabled ? 'bg-white' : 'bg-zinc-800'} rounded-full flex items-center justify-center`}>
                                        <Icon name="CloudIcon" size={20} className={aws.enabled ? 'text-black' : 'text-zinc-600'} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">AWS S3 Storage</h3>
                                        <p className={`text-xs font-bold uppercase ${aws.enabled ? 'text-green-500' : 'text-zinc-600'}`}>
                                            {aws.enabled ? 'Connected' : 'Disabled'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">Used for storing user uploads, avatars, and media files securely in the cloud.</p>
                            <button onClick={() => openConfig('aws')} className="w-full bg-zinc-800 text-white py-2 rounded text-sm font-bold uppercase tracking-widest hover:bg-zinc-700">Configure</button>
                        </div>

                        {/* SMTP Card */}
                        <div className={`border ${smtp.enabled ? 'bg-zinc-900 border-blue-500/20' : 'bg-black border-white/5'} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${smtp.enabled ? 'bg-blue-500' : 'bg-zinc-800'} rounded-full flex items-center justify-center text-white`}>
                                        <Icon name="EnvelopeIcon" size={20} className={smtp.enabled ? 'text-white' : 'text-zinc-600'} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">SMTP Server</h3>
                                        <p className={`text-xs font-bold uppercase ${smtp.enabled ? 'text-blue-500' : 'text-zinc-600'}`}>
                                            {smtp.enabled ? 'Connected' : 'Disabled'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">Dispatch transactional emails like password resets and welcome emails.</p>
                            <button onClick={() => openConfig('smtp')} className="w-full bg-zinc-800 text-white py-2 rounded text-sm font-bold uppercase tracking-widest hover:bg-zinc-700">Configure</button>
                        </div>
                    </div>

                    {/* Webhooks List */}
                    <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden mt-10">
                        <div className="p-4 border-b border-white/5 bg-zinc-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Webhooks</h3>
                            <button onClick={() => openWebhook('new')} className="text-xs bg-white text-black px-4 py-1.5 rounded font-bold uppercase tracking-wider hover:bg-zinc-200 shadow-sm">+ Add Webhook</button>
                        </div>
                        {webhooks.length === 0 ? (
                            <div className="p-10 text-center text-zinc-500 text-sm">
                                No webhooks configured.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {webhooks.map(w => (
                                    <div key={w.id} className="p-5 flex items-center justify-between hover:bg-white/[0.01]">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${w.is_active ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                                                <p className="text-white font-medium text-sm">{w.name}</p>
                                            </div>
                                            <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-mono bg-black/50 px-2 py-0.5 rounded border border-white/5 w-fit">
                                                {w.events.length} Events Subscribed
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openWebhook(w)} className="text-xs text-white uppercase tracking-wider bg-zinc-800 px-4 py-2 border border-white/10 hover:bg-zinc-700">Configure</button>
                                            <button onClick={() => deleteWebhook(w.id)} className="text-xs text-red-500 uppercase tracking-wider hover:text-red-400">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* AWS/SMTP CONFIG MODAL */}
            {configModal && editConfig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfigModal(null)} />
                    <div className="relative bg-zinc-900 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden shadow-black/50">
                        <div className="p-6 border-b border-white/5 bg-zinc-800/20">
                            <h2 className="text-lg font-serif text-white">{configModal === 'aws' ? 'Configure AWS S3' : 'Configure SMTP'}</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3 mb-6 p-4 border border-white/5 bg-black/50">
                                <input
                                    type="checkbox"
                                    id="enabled_flag"
                                    checked={editConfig.enabled}
                                    onChange={(e) => setEditConfig({ ...editConfig, enabled: e.target.checked })}
                                />
                                <label htmlFor="enabled_flag" className="text-sm text-white font-bold cursor-pointer">Enable this integration</label>
                            </div>

                            {configModal === 'aws' ? (
                                <>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Region</label>
                                        <input type="text" value={editConfig.region} onChange={e => setEditConfig({ ...editConfig, region: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="us-east-1" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Bucket Name</label>
                                        <input type="text" value={editConfig.bucket} onChange={e => setEditConfig({ ...editConfig, bucket: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="lowkey-assets" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Access Key ID</label>
                                        <input type="text" value={editConfig.access_key} onChange={e => setEditConfig({ ...editConfig, access_key: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Secret Access Key</label>
                                        <input type="password" value={editConfig.secret_key} onChange={e => setEditConfig({ ...editConfig, secret_key: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="Leave blank to keep existing" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">SMTP Host</label>
                                        <input type="text" value={editConfig.host} onChange={e => setEditConfig({ ...editConfig, host: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="smtp.sendgrid.net" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Port</label>
                                            <input type="text" value={editConfig.port} onChange={e => setEditConfig({ ...editConfig, port: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="587" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">From Email</label>
                                            <input type="text" value={editConfig.from_email} onChange={e => setEditConfig({ ...editConfig, from_email: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="noreply@domain.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Username</label>
                                        <input type="text" value={editConfig.username} onChange={e => setEditConfig({ ...editConfig, username: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Password</label>
                                        <input type="password" value={editConfig.password} onChange={e => setEditConfig({ ...editConfig, password: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="Leave blank to keep existing" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-4 border-t border-white/5 bg-zinc-900 flex justify-end gap-4">
                            <button onClick={() => setConfigModal(null)} className="px-5 py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={saveConfig} disabled={saving} className="px-5 py-2 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">Save Integration</button>
                        </div>
                    </div>
                </div>
            )}

            {/* WEBHOOK MODAL */}
            {webhookModal && editWebhook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setWebhookModal(null)} />
                    <div className="relative bg-zinc-900 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden shadow-black/50">
                        <div className="p-6 border-b border-white/5 bg-zinc-800/20">
                            <h2 className="text-lg font-serif text-white">{editWebhook.id ? 'Edit Webhook' : 'New Webhook'}</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3 mb-6 p-4 border border-white/5 bg-black/50">
                                <input
                                    type="checkbox"
                                    id="wh_active"
                                    checked={editWebhook.is_active}
                                    onChange={(e) => setEditWebhook({ ...editWebhook, is_active: e.target.checked })}
                                />
                                <label htmlFor="wh_active" className="text-sm text-white font-bold cursor-pointer">Active Endpoint</label>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Webhook Name</label>
                                <input type="text" value={editWebhook.name} onChange={e => setEditWebhook({ ...editWebhook, name: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none" placeholder="Discord Notifications" />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Callback URL</label>
                                <input type="text" value={editWebhook.url} onChange={e => setEditWebhook({ ...editWebhook, url: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-2 text-white text-sm focus:border-white/30 outline-none font-mono tracking-tighter" placeholder="https://api.external.com/v1/hook" />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Subscribed Events</label>
                                <div className="p-4 border border-white/10 bg-black space-y-3">
                                    {['user.signup', 'post.created', 'post.reported'].map(evt => (
                                        <div key={evt} className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={`evt_${evt}`}
                                                checked={editWebhook.events.includes(evt)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setEditWebhook({
                                                        ...editWebhook,
                                                        events: checked
                                                            ? [...editWebhook.events, evt]
                                                            : editWebhook.events.filter(e => e !== evt)
                                                    });
                                                }}
                                            />
                                            <label htmlFor={`evt_${evt}`} className="text-xs font-mono text-zinc-400 cursor-pointer select-none">{evt}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-zinc-900 flex justify-end gap-4">
                            {editWebhook.id && (
                                <button onClick={() => deleteWebhook(editWebhook.id)} className="px-5 py-2 text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors mr-auto">Delete</button>
                            )}
                            <button onClick={() => setWebhookModal(null)} className="px-5 py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={saveWebhook} disabled={saving || !editWebhook.name || !editWebhook.url} className="px-5 py-2 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">Save Webhook</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
