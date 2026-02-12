"use client";
import Icon from "@/components/ui/AppIcon";

export default function AdminSettingsPage() {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
                <p className="text-zinc-500 text-sm">Global configuration and metadata.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <section className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Icon name="GlobeAltIcon" size={20} />
                            General Info
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">Site Name</label>
                                <input type="text" defaultValue="LowKey" className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">Support Email</label>
                                <input type="email" defaultValue="support@lowkey.com" className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white" />
                            </div>
                        </div>
                    </section>

                    <section className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Icon name="BellIcon" size={20} />
                            Announcements
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-1">Banner Message</label>
                                <input type="text" placeholder="System maintenance scheduled..." className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-white" />
                                <span className="text-sm text-zinc-400">Show global banner</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Icon name="WrenchScrewdriverIcon" size={20} />
                            Feature Flags
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/50 rounded border border-white/5">
                                <div>
                                    <p className="text-white text-sm font-medium">Public Registrations</p>
                                    <p className="text-xs text-zinc-500">Allow new users to sign up.</p>
                                </div>
                                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/50 rounded border border-white/5">
                                <div>
                                    <p className="text-white text-sm font-medium">New Composer (Beta)</p>
                                    <p className="text-xs text-zinc-500">Enable rich text features.</p>
                                </div>
                                <div className="w-10 h-5 bg-zinc-700 rounded-full relative cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                <button className="bg-white text-black px-6 py-3 rounded font-bold uppercase tracking-widest text-sm hover:bg-zinc-200">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
