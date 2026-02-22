'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white">
                <div className="min-h-screen flex items-center justify-center px-6">
                    <div className="max-w-lg text-center">
                        <div className="w-12 h-[1px] bg-white/20 mx-auto mb-8" />

                        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-6"
                            style={{ fontFamily: 'system-ui, sans-serif' }}>
                            Critical Error
                        </p>

                        <h1 className="text-4xl md:text-5xl text-white mb-4"
                            style={{ fontFamily: 'Georgia, serif' }}>
                            Something broke <span className="text-zinc-600" style={{ fontStyle: 'italic' }}>badly</span>
                        </h1>

                        <p className="text-sm text-zinc-400 leading-relaxed mb-10 max-w-md mx-auto"
                            style={{ fontFamily: 'system-ui, sans-serif' }}>
                            A critical error occurred that prevented the page from rendering entirely. We&apos;re sorry about that.
                        </p>

                        {error.digest && (
                            <p className="text-[10px] text-zinc-700 mb-6"
                                style={{ fontFamily: 'monospace' }}>
                                Error ID: {error.digest}
                            </p>
                        )}

                        <button
                            onClick={reset}
                            className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all"
                            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}
                        >
                            Try Again
                        </button>

                        <div className="w-6 h-[1px] bg-white/10 mx-auto mt-12" />
                    </div>
                </div>
            </body>
        </html>
    );
}
