'use client';

import { useState, useRef, useEffect } from 'react';

const REACTIONS = [
    { key: 'me_too', label: 'Me Too', description: 'I relate to this' },
    { key: 'interesting', label: 'Interesting', description: 'Worth exploring more' },
    { key: 'unique', label: 'Unique', description: 'I hadn\'t seen this perspective' },
    { key: 'loved_it', label: 'Loved it', description: 'This genuinely moved me' },
    { key: 'challenged_me', label: 'Challenged me', description: 'Made me reconsider' },
    { key: 'made_me_question', label: 'Made me question', description: 'Opened a new line of thinking' },
    { key: 'relatable_struggle', label: 'Relatable struggle', description: 'I\'ve been here too' },
    { key: 'motivated_me', label: 'Motivated me', description: 'Gave me energy to act' },
] as const;

type ReactionKey = typeof REACTIONS[number]['key'];

interface ReactionPickerProps {
    postId: string;
    count: number;
    userReaction?: ReactionKey | null;
    onReact?: (postId: string, reaction: ReactionKey | null) => void;
}

export default function ReactionPicker({ postId, count, userReaction, onReact }: ReactionPickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleReact = async (reactionKey: ReactionKey) => {
        setOpen(false);
        const isUnreacting = userReaction === reactionKey;
        const newReaction = isUnreacting ? null : reactionKey;

        onReact?.(postId, newReaction);

        try {
            if (isUnreacting) {
                await fetch(`/api/posts/${postId}/reactions`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reaction: reactionKey }),
                });
            } else {
                await fetch(`/api/posts/${postId}/reactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reaction: reactionKey }),
                });
            }
        } catch {
            // Silently fail — optimistic update already applied
        }
    };

    const activeReaction = userReaction
        ? REACTIONS.find((r) => r.key === userReaction)
        : null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 text-xs transition-colors group ${activeReaction
                        ? 'text-white'
                        : 'text-zinc-600 hover:text-zinc-300'
                    }`}
                aria-label={activeReaction ? `Reacted: ${activeReaction.label}` : 'Add reaction'}
                title={activeReaction ? activeReaction.label : 'React'}
            >
                {activeReaction ? (
                    <span className="px-2 py-0.5 border border-white/20 text-[10px] uppercase tracking-widest text-white bg-white/5">
                        {activeReaction.label}
                    </span>
                ) : (
                    <span className="text-[10px] uppercase tracking-widest border border-white/10 px-2 py-0.5 group-hover:border-white/30 transition-colors">
                        React
                    </span>
                )}
                {count > 0 && (
                    <span className={activeReaction ? 'text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-400'}>
                        {count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-56 border border-white/10 bg-zinc-950 shadow-2xl">
                    <div className="p-1">
                        {REACTIONS.map((r) => (
                            <button
                                key={r.key}
                                onClick={() => handleReact(r.key)}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors group flex items-center justify-between ${userReaction === r.key
                                        ? 'text-white bg-white/5'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                                    }`}
                            >
                                <span className="uppercase tracking-widest text-[10px]">{r.label}</span>
                                {userReaction === r.key && (
                                    <span className="text-zinc-600 text-[9px] uppercase tracking-widest">Remove</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
