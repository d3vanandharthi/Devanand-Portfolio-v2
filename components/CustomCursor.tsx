
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isHidden, setIsHidden] = useState(false); 
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    // Listen for AI Gesture Activation to hide this cursor
    const handleGestureMode = (e: CustomEvent<boolean>) => {
        setIsHidden(e.detail);
        if (e.detail) {
            document.body.style.cursor = 'none'; // Ensure system cursor is also gone
        } else {
             document.body.style.cursor = 'none';
        }
    };
    window.addEventListener('gesture-mode', handleGestureMode as EventListener);

    const handleMouseMove = (e: MouseEvent) => {
      // Even if hidden, we might want to track for resumption, but mostly we ignore
      if (isHidden) return;

      setPosition({ x: e.clientX, y: e.clientY });
      
      setIsMoving(true);
      if (timeoutId) window.clearTimeout(timeoutId);
      const newTimeout = window.setTimeout(() => setIsMoving(false), 100);
      setTimeoutId(newTimeout);

      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button';
      
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('gesture-mode', handleGestureMode as EventListener);
    };
  }, [isHidden, timeoutId]);

  if (isHidden) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-neon-blue rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{ 
          transform: `translate(${position.x - 4}px, ${position.y - 4}px) scale(${isPointer ? 0.5 : 1})` 
        }}
      />
      <div 
        className={`fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out`}
        style={{ 
          width: isMoving ? '40px' : '20px',
          height: isMoving ? '40px' : '20px',
          transform: `translate(${position.x - (isMoving ? 20 : 10)}px, ${position.y - (isMoving ? 20 : 10)}px) scale(${isPointer ? 1.5 : 1})`,
          opacity: isMoving ? 0.8 : 0.3,
          backgroundColor: isMoving ? 'rgba(255,255,255,0.1)' : 'transparent'
        }}
      />
    </>
  );
};

export default CustomCursor;
