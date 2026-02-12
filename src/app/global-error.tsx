"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-black text-white flex items-center justify-center min-h-screen font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                    <p className="text-zinc-400 mb-8">{error.message}</p>
                    <button
                        onClick={() => reset()}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-wide hover:bg-zinc-200"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
