import React, { useEffect, useRef } from 'react';
import { SectionId } from '../types';
import { ArrowRight } from 'lucide-react';
import NanotechText from './NanotechText';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Disable animation on mobile/tablets (< 768px) for better performance and UX
      if (window.innerWidth < 768) {
        if (overlayRef.current && overlayRef.current.style.clipPath !== 'none') {
          overlayRef.current.style.clipPath = 'none';
        }
        return;
      }

      if (!containerRef.current || !overlayRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Direct DOM update avoids React re-renders for high performance
      overlayRef.current.style.clipPath = `circle(250px at ${x}px ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id={SectionId.HERO}
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-black selection:bg-neon-blue selection:text-black"
    >
      {/* Background Layer: Lightweight CSS Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Subtle glowing orb in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full pointer-events-none">
        {/* Layer 1: Dimmed Text (Always Visible) */}
        <div className="flex flex-col items-start select-none opacity-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-gray-700"></div>
            <span className="font-mono text-gray-700 tracking-widest text-sm uppercase">Full Stack .NET Developer | Gen AI Developer</span>
          </div>
          <h1 className="text-5xl md:text-9xl font-bold text-gray-800 tracking-tighter leading-[0.9] mb-8">
            DEVANAND<br />
            MALLESH HARTHI
          </h1>
        </div>

        {/* Layer 2: Spotlight Reveal (Masked) */}
        <div
          ref={overlayRef}
          style={{
            // Initial state off-screen or center, updated via JS ref
            clipPath: `circle(0px at 50% 50%)`,
            transition: 'clip-path 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth tail effect
            willChange: 'clip-path' // Hardware acceleration hint
          }}
          className="absolute inset-0 z-20 flex flex-col items-start max-md:!clip-path-none"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-neon-blue shadow-[0_0_10px_#00f3ff]"></div>
            <span className="font-mono text-neon-blue tracking-widest text-sm uppercase drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
              Full Stack .NET Developer | Gen AI Developer
            </span>
          </div>
          <h1 className="text-5xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            DEVANAND<br />
            MALLESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white">HARTHI</span>
          </h1>

          {/* Interactive Nano Tech Subtitle */}
          <div className="w-full max-w-2xl h-32 pointer-events-auto">
            <NanotechText
              text=".NET DEVELOPER // GEN AI DEVELOPER"
              fontSize={24}
              color="#a0a0a0"
              textAlign="left"
            />
          </div>

          <div className="mt-8 pointer-events-auto">
            <button
              onClick={() => document.getElementById(SectionId.PROJECTS)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4 text-white font-mono hover:text-neon-blue transition-colors pl-1"
            >
              <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center group-hover:border-neon-blue group-hover:bg-neon-blue/20 transition-all backdrop-blur-md">
                <ArrowRight size={24} className="group-hover:-rotate-45 transition-transform" />
              </div>
              <span className="text-sm tracking-[0.2em]">EXPLORE WORK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-20">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section >
  );
};

export default Hero;