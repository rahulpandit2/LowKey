"use client";
import React, { use } from 'react';
import Icon from "@/components/ui/AppIcon";
import Link from 'next/link';

// Mock data generator for community
const getCommunityData = (handle: string) => ({
    name: handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    handle: handle,
    description: "A thoughtful space for discussing the ethical implications of modern design and technology. Join us for deep dives into user privacy, dark patterns, and humane technology.",
    members: 1240,
    posts: 856,
    cover: "bg-gradient-to-r from-purple-900 to-indigo-900",
});

export default function CommunityPage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = use(params);
    const community = getCommunityData(handle);

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Cover Image */}
            <div className={`h-64 w-full ${community.cover} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative">
                {/* Header */}
                <div className="-mt-12 flex justify-between items-end mb-8 relative z-10">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-zinc-900 border-4 border-black flex items-center justify-center text-4xl shadow-xl">
                            🎨
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl font-bold text-white mb-1">{community.name}</h1>
                            <div className="flex items-center gap-4 text-zinc-400 text-sm">
                                <span>@{community.handle}</span>
                                <span>•</span>
                                <span>{community.members.toLocaleString()} members</span>
                            </div>
                        </div>
                    </div>
                    <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors mb-2">
                        Join Community
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="font-bold text-white mb-4">About</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                {community.description}
                            </p>
                            <div className="space-y-3 text-sm text-zinc-500">
                                <div className="flex items-center gap-3">
                                    <Icon name="GlobeAltIcon" size={18} />
                                    <span>Public Community</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="ChartBarIcon" size={18} />
                                    <span>Top 5% active</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="font-bold text-white mb-4">Moderators</h3>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-black"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="col-span-2 space-y-6">
                        {/* Mock Posts */}
                        {[1, 2, 3].map((post) => (
                            <div key={post} className="bg-zinc-900/30 border border-white/5 rounded-xl p-6 hover:bg-zinc-900/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
                                    <div>
                                        <p className="font-bold text-white text-sm">User {post}</p>
                                        <p className="text-xs text-zinc-500">2h ago</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">The ethics of infinite scroll patterns</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                    Just finished reading a paper on how intermittent variable rewards trigger dopamine loops.
                                    We really need to rethink how we design feed interfaces...
                                </p>
                                <div className="flex items-center gap-6 text-zinc-500 text-sm">
                                    <button className="flex items-center gap-2 hover:text-white"><Icon name="HeartIcon" size={18} /> 24</button>
                                    <button className="flex items-center gap-2 hover:text-white"><Icon name="ChatBubbleLeftIcon" size={18} /> 5</button>
                                    <button className="ml-auto hover:text-white"><Icon name="ShareIcon" size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
