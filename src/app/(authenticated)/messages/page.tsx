'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { messages as msgApi } from '@/lib/api';

type Thread = {
    id: string;
    other_user_username: string;
    other_user_display_name: string | null;
    other_user_avatar_url: string | null;
    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;
    is_incognito: boolean;
};

type Msg = {
    id: string;
    sender_id: string;
    sender_username: string;
    sender_display_name: string | null;
    body: string;
    created_at: string;
    is_read: boolean;
};

function timeAgo(date: string | null) {
    if (!date) return '';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default function MessagesPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<string | null>(null);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [newDmUser, setNewDmUser] = useState('');
    const [showNewDm, setShowNewDm] = useState(false);

    useEffect(() => {
        msgApi.threads().then((res) => {
            if (res.data) setThreads(res.data as Thread[]);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (selectedThread) {
            msgApi.getThread(selectedThread).then((res) => {
                if (res.data) setMessages(res.data as Msg[]);
            });
        }
    }, [selectedThread]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        if (selectedThread) {
            msgApi.reply(selectedThread, messageInput).then((res) => {
                if (res.data) {
                    setMessages((prev) => [...prev, res.data as Msg]);
                    setMessageInput('');
                }
            });
        }
    };

    const handleNewDm = () => {
        if (!newDmUser.trim() || !messageInput.trim()) return;
        msgApi.send({ recipient_username: newDmUser, message: messageInput }).then((res) => {
            if (res.data) {
                const d = res.data as { thread_id: string };
                setSelectedThread(d.thread_id);
                setShowNewDm(false);
                setNewDmUser('');
                setMessageInput('');
                // Refresh threads
                msgApi.threads().then((r) => {
                    if (r.data) setThreads(r.data as Thread[]);
                });
            }
        });
    };

    const selectedThreadData = threads.find((t) => t.id === selectedThread);

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Thread List */}
            <div className={`w-full md:w-[360px] border-r border-white/[0.05] flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 block mb-1">Direct</span>
                        <h1 className="font-serif text-2xl text-white">Messages</h1>
                    </div>
                    <button
                        onClick={() => setShowNewDm(!showNewDm)}
                        className="w-8 h-8 border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
                    >
                        <Icon name="PlusIcon" size={16} />
                    </button>
                </div>

                {showNewDm && (
                    <div className="p-4 border-b border-white/[0.05] bg-white/[0.02]">
                        <input
                            type="text"
                            value={newDmUser}
                            onChange={(e) => setNewDmUser(e.target.value)}
                            placeholder="Username..."
                            className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                        />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse flex gap-3">
                                    <div className="w-11 h-11 bg-white/5 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-white/5 rounded w-1/2 mb-2"></div>
                                        <div className="h-2 bg-white/5 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : threads.length === 0 ? (
                        <div className="p-12 text-center">
                            <Icon name="ChatBubbleLeftRightIcon" size={36} className="text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm">No messages yet</p>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <button
                                key={thread.id}
                                onClick={() => setSelectedThread(thread.id)}
                                className={`w-full p-4 flex items-center gap-3 text-left transition-colors border-b border-white/[0.03] ${selectedThread === thread.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className="w-11 h-11 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center">
                                    {thread.is_incognito ? (
                                        <Icon name="LockClosedIcon" size={16} className="text-indigo-400" />
                                    ) : (
                                        <span className="text-sm text-zinc-500 font-medium">
                                            {(thread.other_user_display_name || thread.other_user_username || '?')[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm truncate ${thread.unread_count > 0 ? 'text-white font-medium' : 'text-zinc-400'}`}>
                                            {thread.other_user_display_name || thread.other_user_username}
                                        </span>
                                        <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                                            {timeAgo(thread.last_message_at)}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${thread.unread_count > 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                        {thread.last_message || 'No messages yet'}
                                    </p>
                                </div>
                                {thread.unread_count > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {thread.unread_count}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
                {selectedThread && selectedThreadData ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/[0.05] flex items-center gap-4">
                            <button onClick={() => setSelectedThread(null)} className="md:hidden text-zinc-400 hover:text-white">
                                <Icon name="ArrowLeftIcon" size={20} />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-sm text-zinc-500">
                                    {(selectedThreadData.other_user_display_name || selectedThreadData.other_user_username || '?')[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-sm font-medium text-white">
                                    {selectedThreadData.other_user_display_name || selectedThreadData.other_user_username}
                                </h2>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-600">Direct Message</p>
                            </div>
                            <button className="text-zinc-600 hover:text-white transition-colors">
                                <Icon name="EllipsisHorizontalIcon" size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => {
                                const isMine = msg.sender_username !== selectedThreadData.other_user_username;
                                return (
                                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-4 py-3 text-sm ${isMine
                                                ? 'bg-white text-black'
                                                : 'bg-zinc-900 border border-white/[0.05] text-zinc-300'
                                            }`}>
                                            {msg.body}
                                            <p className={`text-[10px] mt-1 ${isMine ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                                {timeAgo(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/[0.05]">
                            <div className="flex items-center gap-3 border border-white/10 px-4 py-2 focus-within:border-white/30 transition-colors">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-zinc-600 text-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    className={`transition-colors ${messageInput.trim() ? 'text-white' : 'text-zinc-700'}`}
                                >
                                    <Icon name="PaperAirplaneIcon" size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Icon name="ChatBubbleLeftRightIcon" size={48} className="text-zinc-800 mb-4" />
                        <p className="text-zinc-500 font-serif text-lg">Your Messages</p>
                        <p className="text-zinc-600 text-sm mt-1">Select a conversation to start</p>
                    </div>
                )}
            </div>
        </div>
    );
}
