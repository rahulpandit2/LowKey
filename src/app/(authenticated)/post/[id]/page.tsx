"use client";
import React, { use } from 'react';
import Icon from "@/components/ui/AppIcon";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-20">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <a href="/feed" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors text-sm font-medium">
                    <Icon name="ArrowLeftIcon" size={16} />
                    Back to Feed
                </a>

                {/* Original Post */}
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 mb-8 shadow-xl shadow-black/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                        <div>
                            <p className="font-bold text-white">Elena Fisher</p>
                            <p className="text-xs text-zinc-500">2 hours ago • Design Ethics</p>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">The problem with gamification in social apps</h1>
                    <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                        We've become so accustomed to red dots, badges, and streaks that we forget they are designed to exploit our psychology.
                        LowKey represents a shift away from "engagement at all costs" towards "connection when it matters".

                        What do you all think about removing public like counts entirely?
                    </p>

                    <div className="flex items-center gap-6 py-4 border-t border-white/5 text-zinc-400">
                        <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                            <Icon name="HeartIcon" size={20} />
                            <span className="font-medium">142</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                            <Icon name="ChatBubbleLeftIcon" size={20} />
                            <span className="font-medium">24 Comments</span>
                        </button>
                        <button className="ml-auto hover:text-white">
                            <Icon name="ShareIcon" size={20} />
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h3 className="font-bold text-white text-lg">Discussion</h3>

                    {/* New Comment Input */}
                    <div className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"></div>
                        <div className="flex-1">
                            <textarea
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-white/30 resize-none h-24"
                                placeholder="Add to the discussion..."
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-xs tracking-wide hover:bg-zinc-200">Reply</button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"></div>
                            <div className="flex-1">
                                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-white text-sm">Marcus Neo</span>
                                        <span className="text-xs text-zinc-500">14m ago</span>
                                    </div>
                                    <p className="text-zinc-300 text-sm">
                                        Totally agree. Public metrics turn communication into a competition. Removing them is the first step to sanity.
                                    </p>
                                </div>
                                <div className="flex gap-4 mt-2 ml-2">
                                    <button className="text-xs text-zinc-500 hover:text-white font-medium">Like</button>
                                    <button className="text-xs text-zinc-500 hover:text-white font-medium">Reply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
