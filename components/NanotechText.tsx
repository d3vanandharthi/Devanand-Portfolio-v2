import React, { useEffect, useRef } from 'react';

interface NanotechTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center';
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  force: number;
  angle: number;
  distance: number;
  friction: number;
  ease: number;

  constructor(x: number, y: number, color: string) {
    this.x = Math.random() * 800; // Start random
    this.y = Math.random() * 600;
    this.originX = x;
    this.originY = y;
    this.size = 2;
    this.dx = 0;
    this.dy = 0;
    this.vx = 0;
    this.vy = 0;
    this.force = 0;
    this.angle = 0;
    this.distance = 0;
    this.friction = 0.98;
    this.ease = 0.1;
  }

  update(mouse: { x: number; y: number; radius: number }) {
    this.dx = mouse.x - this.x;
    this.dy = mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -mouse.radius / this.distance;

    if (this.distance < mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }
}

const NanotechText: React.FC<NanotechTextProps> = ({ 
  text, 
  fontSize = 30, 
  color = '#ffffff',
  textAlign = 'left' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container?.clientWidth || 600;
    canvas.height = container?.clientHeight || 200;

    let particles: Particle[] = [];
    
    // Draw text to offscreen canvas to get pixel data
    ctx.font = `bold ${fontSize}px "ui-monospace", monospace`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    
    const textWidth = ctx.measureText(text).width;
    let startX = 0;
    
    if (textAlign === 'center') {
        startX = (canvas.width - textWidth) / 2;
    } else {
        startX = 0; 
    }
    
    ctx.fillText(text, startX, canvas.height / 2);

    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear canvas to start animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create particles from pixel data
    for (let y = 0, y2 = textCoordinates.height; y < y2; y += 2) { // Skip pixels for performance
      for (let x = 0, x2 = textCoordinates.width; x < x2; x += 2) {
        if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
          particles.push(new Particle(x, y, color));
        }
      }
    }

    const mouse = {
      x: 0,
      y: 0,
      radius: 3000 // Interaction radius squared
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = color;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse);
        // Draw tiny rects
        ctx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
      }
      requestAnimationFrame(animate);
    };
    
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [text, fontSize, color, textAlign]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default NanotechText;