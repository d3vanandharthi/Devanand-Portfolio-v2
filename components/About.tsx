import React, { useEffect, useRef } from 'react';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!revealRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for the mask position
      revealRef.current.style.setProperty('--mouse-x', `${x}px`);
      revealRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      id="about" 
      className="relative py-32 bg-black overflow-hidden selection:bg-neon-blue selection:text-black"
    >
      <div className="max-w-7xl mx-auto px-6 relative" ref={containerRef}>
        
        {/* === LAYER 1: THE HIDDEN GEOMETRY (Dim/Wireframe) === */}
        <div className="relative z-10 opacity-20 filter grayscale pointer-events-none">
          <AboutContent />
          {/* Background Grid for "Invisible Geometry" feel */}
          <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* === LAYER 2: THE HOLOGRAPHIC REVEAL (Bright/Neon) === */}
        <div 
          ref={revealRef}
          className="absolute inset-0 z-20 top-0 left-6 right-6"
          style={{
            // The mask is a composition of:
            // 1. The Laser Beam (animation defined in tailwind/css)
            // 2. The Mouse Flashlight (radial gradient)
            maskImage: `
              linear-gradient(transparent 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,1) 55%, transparent 100%),
              radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)
            `,
            WebkitMaskImage: `
              linear-gradient(to bottom, transparent, black 48%, black 52%, transparent) 
              var(--scan-pos, 0%) / 100% 20% no-repeat,
              radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)
            `,
            // Composite allows us to add both masks together
            WebkitMaskComposite: 'source-over, source-over', // Or 'add' depending on browser, but comma-separated works as layers
            maskComposite: 'add',
            animation: 'scan-vertical 6s linear infinite'
          } as React.CSSProperties}
        >
          {/* Bright Content */}
          <div className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
             <AboutContent />
          </div>
          
          {/* Holographic Interference / Scanlines Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,243,255,0.1)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
        </div>

        {/* Decorative Scanner Elements */}
        <div className="absolute top-0 right-0 p-4 font-mono text-xs text-neon-blue/50 tracking-widest border border-neon-blue/20 rounded-bl-xl">
           SCANNING_SECTOR_04 // SYSTEM_ACTIVE
        </div>
      </div>
      
      {/* CSS for Scan Animation */}
      <style>{`
        @keyframes scan-vertical {
          0% { -webkit-mask-position: 0% 0%, 0 0; }
          50% { -webkit-mask-position: 0% 100%, 0 0; }
          100% { -webkit-mask-position: 0% 0%, 0 0; }
        }
      `}</style>
    </section>
  );
};

const AboutContent = () => (
  <div className="flex flex-col lg:flex-row gap-16 items-center">
    {/* Left: Bio */}
    <div className="flex-1 space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="h-px w-12 bg-current"></span>
        <h2 className="text-sm font-mono tracking-[0.3em] uppercase">About Protocol</h2>
      </div>
      
      <h3 className="text-4xl md:text-5xl font-bold leading-tight">
        Architecting Digital<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white opacity-80">
          Financial Ecosystems
        </span>
      </h3>
      
      <div className="space-y-6 text-lg font-light leading-relaxed max-w-2xl">
        <p>
          I am a Full-Stack .NET Developer with 4+ years of experience engineering 
          enterprise-grade solutions for Fortune 500 banking institutions. 
          My code runs the backbone of multi-billion dollar loan portfolios.
        </p>
        <p>
          Specializing in Clean Architecture and Microservices, I treat software 
          like a living organism—constantly optimizing, refactoring, and evolving. 
          From reducing deployment times by 83% to automating complex risk models, 
          I build systems that are not just functional, but resilient.
        </p>
      </div>

      <div className="pt-8 grid grid-cols-2 gap-8 font-mono text-sm opacity-80">
        <div>
           <div className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Current Status</div>
           <div>Software Engineer @ SLK Software</div>
        </div>
        <div>
           <div className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Clearance</div>
           <div>Full Stack .NET Architect</div>
        </div>
      </div>
    </div>

    {/* Right: Abstract 3D Cube/Geometry Representation */}
    <div className="flex-1 w-full flex justify-center items-center">
       <div className="relative w-64 h-64 md:w-80 md:h-80 border border-current opacity-50 rounded-full flex items-center justify-center animate-spin-slow">
          <div className="absolute inset-0 border border-current rounded-full opacity-30 scale-125"></div>
          <div className="w-48 h-48 border border-current rotate-45 flex items-center justify-center">
             <div className="w-32 h-32 border border-current rotate-45"></div>
          </div>
          {/* Data Points */}
          <div className="absolute top-0 left-1/2 w-1 h-2 bg-current"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-2 bg-current"></div>
          <div className="absolute left-0 top-1/2 w-2 h-1 bg-current"></div>
          <div className="absolute right-0 top-1/2 w-2 h-1 bg-current"></div>
       </div>
    </div>
  </div>
);

export default About;