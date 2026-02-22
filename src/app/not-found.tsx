import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* Decorative line */}
        <div className="w-12 h-[1px] bg-white/20 mx-auto mb-8" />

        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-6">
          Page not found
        </p>

        <h1 className="text-6xl md:text-8xl font-serif text-white mb-4">
          4<span className="text-zinc-700">0</span>4
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-10 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. The internet is vast — let&apos;s get you back on track.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-zinc-300 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/communities"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-white px-6 py-3 border border-white/[0.08] hover:border-white/20 transition-all"
          >
            Explore Communities
          </Link>
        </div>

        {/* Bottom decoration */}
        <div className="w-6 h-[1px] bg-white/10 mx-auto mt-12" />
      </div>
    </div>
  );
}
