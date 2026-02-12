"use client";
import React from 'react';
import Icon from "@/components/ui/AppIcon";

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 pb-20">
            <div className="max-w-2xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <button className="text-zinc-500 hover:text-white text-sm font-medium">Mark all as read</button>
                </header>

                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`p-4 rounded-xl flex gap-4 items-start ${i < 3 ? 'bg-zinc-900/40 border border-white/10' : 'hover:bg-zinc-900/20'}`}>
                            <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center shrink-0">
                                <Icon name={i % 2 === 0 ? "HeartIcon" : "ChatBubbleLeftIcon"} size={18} className={i % 2 === 0 ? "text-pink-500" : "text-blue-500"} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white mb-1">
                                    <span className="font-bold">Sarah Jenkins</span> {i % 2 === 0 ? "liked your post" : "commented on your post"}: "The future of the internet..."
                                </p>
                                <p className="text-xs text-zinc-500">2 hours ago</p>
                            </div>
                            {i < 3 && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
