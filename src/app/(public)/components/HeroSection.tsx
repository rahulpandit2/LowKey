import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function HeroSection() {
  return (
    <div className="min-h-[800px] flex flex-col md:px-12 border-white/[0.08] w-full h-screen border-b pt-20 pr-6 pl-6 relative justify-center">
      {/* Background Treatment (Optional Abstract Pattern) */}
      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-40 mix-blend-screen hidden md:block">
        <img
          src="/assets/images/founder.jpg"
          alt="LowKey Founder"
          className="w-full h-full object-cover grayscale opacity-50 mask-image-gradient"
          style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-8 fade-in-up">
            <div className="w-12 h-[1px] bg-white/40"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Est. 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight fade-in-up delay-100">
            <span className="block font-serif">LowKey</span>
            <span className="block text-zinc-500 font-light text-5xl md:text-6xl mt-4">
              The Good Internet Project
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/80 font-light mt-8 fade-in-up delay-200">
            Think. Don't perform.
          </p>
        </div>

        <div className="lg:col-span-4 fade-in-up delay-300">
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xs mb-10 text-justify">
            A quieter internet. Share ideas, get real feedback, and grow without the noise of likes,
            leaderboards, or performance metrics.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/post-composer"
              className="group flex items-center justify-between border-b border-white/20 pb-4 hover:border-white transition-colors"
            >
              <span className="text-xs uppercase tracking-widest text-white">Get Started</span>
              <Icon
                name="ArrowUpRightIcon"
                size={16}
                className="text-white transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#philosophy"
              className="group flex items-center justify-between border-b border-white/20 pb-4 hover:border-white transition-colors"
            >
              <span className="text-xs uppercase tracking-widest text-white">Learn More</span>
              <Icon
                name="ArrowUpRightIcon"
                size={16}
                className="text-white transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 flex justify-between items-end mix-blend-difference text-white">
        <div className="hidden md:block text-[10px] uppercase tracking-widest">01 — Intro</div>
        <div className="animate-bounce">
          <Icon name="ChevronDownIcon" size={20} />
        </div>
      </div>
    </div>
  );
}
