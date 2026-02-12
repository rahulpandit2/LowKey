"use client";

import { useEffect } from "react";

export default function Error({
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-zinc-500 mb-8 max-w-md">{error.message}</p>
            <button
                onClick={() => reset()}
                className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-wide hover:bg-zinc-200"
            >
                Try again
            </button>
        </div>
    );
}
