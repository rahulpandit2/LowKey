'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const MARKS = [
    { key: 'read_carefully', label: 'Read carefully', description: 'Worth a second read' },
    { key: 'saved_in_mind', label: 'Saved in mind', description: 'Keep this thought with me' },
    { key: 'inspired_to_reflect', label: 'Inspired to reflect', description: 'Will think on this' },
] as const;

type MarkKey = typeof MARKS[number]['key'];

interface MarkButtonProps {
    postId: string;
    activeMark?: MarkKey | null;
    onMark?: (postId: string, mark: MarkKey | null) => void;
}

export default function MarkButton({ postId, activeMark, onMark }: MarkButtonProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleMark = async (markKey: MarkKey) => {
        setOpen(false);
        const isRemoving = activeMark === markKey;
        const newMark = isRemoving ? null : markKey;
        onMark?.(postId, newMark);

        try {
            await fetch(`/api/posts/${postId}/marks`, {
                method: isRemoving ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mark: markKey }),
            });
        } catch {
            // Silently fail — optimistic update applied
        }
    };

    const activeMarkData = activeMark ? MARKS.find((m) => m.key === activeMark) : null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={activeMarkData ? `Marked: ${activeMarkData.label}` : 'Save privately'}
                title={activeMarkData ? activeMarkData.label : 'Save privately'}
                className={`text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 ${activeMarkData
                        ? 'text-amber-400/80 hover:text-amber-300'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
            >
                <Icon
                    name="BookmarkIcon"
                    size={14}
                    className={activeMarkData ? 'text-amber-400/80' : 'text-zinc-600'}
                />
                {activeMarkData && (
                    <span>{activeMarkData.label}</span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-52 border border-white/10 bg-zinc-950 shadow-2xl">
                    <div className="px-3 py-2 border-b border-white/[0.05]">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600">Private marks — only visible to you</p>
                    </div>
                    <div className="p-1">
                        {MARKS.map((m) => (
                            <button
                                key={m.key}
                                onClick={() => handleMark(m.key)}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${activeMark === m.key
                                        ? 'text-amber-400/80 bg-amber-500/[0.04]'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-widest">{m.label}</span>
                                {activeMark === m.key && (
                                    <span className="text-zinc-600 text-[9px]">Remove</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
