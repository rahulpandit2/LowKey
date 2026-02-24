'use client';

import React, { useState } from 'react';
import Icon from "@/components/ui/AppIcon";

const mockMessages = [
    {
        id: 1,
        name: "Alex Rivera",
        email: "alex.r@example.com",
        subject: "Partnership Inquiry",
        message: "Hi LowKey team, I run a digital wellness collective and would love to discuss a potential partnership...",
        date: "2025-10-24",
        read: false,
    },
    {
        id: 2,
        name: "Sarah Chen",
        email: "sarah.c@example.com",
        subject: "Bug Report: Profile Image",
        message: "I'm having trouble uploading my profile picture. It keeps saying 'Server Error' even though the file is small.",
        date: "2025-10-23",
        read: true,
    },
    {
        id: 3,
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Feedback on Guidelines",
        message: "I think the new community guidelines are great, but maybe clarify the section on self-promotion?",
        date: "2025-10-22",
        read: true,
    },
];

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState(mockMessages);
    const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);

    const handleReadToggle = (id: number) => {
        setMessages(messages.map(m => m.id === id ? { ...m, read: !m.read } : m));
    };

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Message List */}
            <div className="w-1/3 border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-bold mb-2">Inbox</h1>
                    <div className="relative">
                        <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-3 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedMessage?.id === msg.id ? 'bg-white/10' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm ${!msg.read ? 'text-white' : 'text-zinc-400'}`}>{msg.name}</span>
                                <span className="text-xs text-zinc-600">{msg.date}</span>
                            </div>
                            <p className={`text-sm mb-1 truncate ${!msg.read ? 'text-white font-medium' : 'text-zinc-500'}`}>{msg.subject}</p>
                            <p className="text-xs text-zinc-600 truncate">{msg.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Detail */}
            <div className="flex-1 flex flex-col">
                {selectedMessage ? (
                    <>
                        <div className="p-8 border-b border-white/5">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                        <span>From: <span className="text-white">{selectedMessage.name}</span> ({selectedMessage.email})</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleReadToggle(selectedMessage.id)} className="p-2 hover:bg-white/10 rounded text-zinc-400" title="Mark as Unread">
                                        <Icon name="EnvelopeIcon" size={20} />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded text-zinc-400" title="Archive">
                                        <Icon name="ArchiveBoxIcon" size={20} />
                                    </button>
                                    <button className="p-2 hover:bg-white/10 rounded text-red-500 hover:text-red-400" title="Delete">
                                        <Icon name="TrashIcon" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-zinc-900/30">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded font-bold uppercase tracking-wide text-sm hover:bg-zinc-200 transition-colors"
                            >
                                <Icon name="PaperAirplaneIcon" size={18} />
                                Reply via Email
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <Icon name="InboxIcon" size={48} className="mb-4 opacity-20" />
                        <p>Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
}
