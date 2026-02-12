"use client";
import React, { useState } from 'react';
import Icon from "@/components/ui/AppIcon";
import Link from 'next/link';

export default function SearchPage() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <div className="max-w-3xl mx-auto">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">Search LowKey</h1>
                    <div className="relative">
                        <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-4 top-3.5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search people, communities, or topics..."
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-lg shadow-white/5"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
                    {['all', 'communities', 'posts', 'people'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-white text-white'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="space-y-8">
                    {/* Community Result */}
                    {(activeTab === 'all' || activeTab === 'communities') && (
                        <section>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Communities</h3>
                            <div className="space-y-4">
                                <Link href="/communities/design-ethics" className="block bg-zinc-900/50 border border-white/5 p-4 rounded-xl hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-xl">🎨</div>
                                        <div>
                                            <h4 className="font-bold text-white">Design Ethics</h4>
                                            <p className="text-sm text-zinc-400">1.2k members • 50 posts/day</p>
                                        </div>
                                        <button className="ml-auto bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase hover:bg-white/20">View</button>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* People Result */}
                    {(activeTab === 'all' || activeTab === 'people') && (
                        <section>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">People</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-2">
                                    <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
                                    <div>
                                        <p className="font-bold text-white text-sm">Sarah Jenkins</p>
                                        <p className="text-zinc-500 text-xs">@sarahj • Product Designer</p>
                                    </div>
                                    <button className="ml-auto text-zinc-400 hover:text-white p-2 border border-white/10 rounded-full"><Icon name="PlusIcon" size={14} /></button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Post Result */}
                    {(activeTab === 'all' || activeTab === 'posts') && (
                        <section>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Posts</h3>
                            <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                                    <p className="font-bold text-white text-sm">Alex R.</p>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">How do we build truly private social networks?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                    I've been thinking a lot about the architecture of LowKey and similar projects.
                                    The key seems to be in data minimization...
                                </p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
