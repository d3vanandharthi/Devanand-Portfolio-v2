import React from 'react';

interface MarqueeProps {
  text: string;
  reverse?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, reverse = false }) => {
  return (
    <div className="relative flex overflow-x-hidden border-y border-white/5 py-8 bg-black">
      <div 
        className={`animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap flex items-center gap-8`}
      >
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="text-8xl md:text-9xl font-bold uppercase tracking-tighter text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
          >
            {text} <span className="text-neon-blue mx-4">•</span>
          </span>
        ))}
      </div>

      <div 
        className={`absolute top-0 animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap flex items-center gap-8`}
        style={{ left: reverse ? '-100%' : '100%' }}
      >
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="text-8xl md:text-9xl font-bold uppercase tracking-tighter text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
          >
            {text} <span className="text-neon-blue mx-4">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;