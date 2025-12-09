
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for more realistic feel
        const increment = Math.floor(Math.random() * 10) + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(onLoadingComplete, 1000); // Wait for animation to finish before unmounting/enabling scroll
      }, 500);
    }
  }, [progress, onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[10002] flex flex-col items-center justify-center bg-black text-white transition-transform duration-[1.5s] cubic-bezier(0.76, 0, 0.24, 1) ${isLoaded ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="relative">
        <span className="text-8xl md:text-9xl font-bold font-mono tracking-tighter">
          {progress}%
        </span>
        {/* Decorative line */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-neon-blue transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 font-mono text-xs text-gray-500 uppercase tracking-widest">
        {progress < 100 ? 'Initializing System Protocols...' : 'Access Granted'}
      </div>
    </div>
  );
};

export default Preloader;
