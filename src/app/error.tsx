'use client';

import { logger } from '@/lib/client-logger';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error('[LowKey Error]', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="max-w-lg text-center">
                {/* Decorative line */}
                <div className="w-12 h-[1px] bg-white/20 mx-auto mb-8" />

                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-6">
                    Something went wrong
                </p>

                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                    An error <span className="text-zinc-600 italic">occurred</span>
                </h1>

                <p className="text-sm text-zinc-400 leading-relaxed mb-10 max-w-md mx-auto">
                    We encountered an unexpected issue. This has been noted. You can try again or head back to safety.
                </p>

                {error.digest && (
                    <p className="text-[10px] text-zinc-700 font-mono mb-6">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all"
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-white px-6 py-3 border border-white/[0.08] hover:border-white/20 transition-all"
                    >
                        Back to Home
                    </a>
                </div>

                {/* Bottom decoration */}
                <div className="w-6 h-[1px] bg-white/10 mx-auto mt-12" />
            </div>
        </div>
    );
}
