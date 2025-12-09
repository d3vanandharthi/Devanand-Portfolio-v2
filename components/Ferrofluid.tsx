
import React, { useEffect, useRef } from 'react';

const Ferrofluid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Physics parameters
    const tension = 0.025;
    const dampening = 0.025; // Less dampening = more jiggle
    const spread = 0.25; // Wave propagation
    
    // Blob parameters
    const radius = 200;
    const vertexCount = 120;
    
    // Mouse state
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    
    // Simulation state
    class Vertex {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      angle: number;
      targetR: number;
      currentR: number;
      velocity: number;

      constructor(angle: number) {
        this.angle = angle;
        this.baseX = Math.cos(angle) * radius;
        this.baseY = Math.sin(angle) * radius;
        this.x = this.baseX;
        this.y = this.baseY;
        this.targetR = radius;
        this.currentR = radius;
        this.velocity = 0;
      }

      update(blobX: number, blobY: number, mouseX: number, mouseY: number) {
        // Calculate world position of this vertex
        const wx = blobX + Math.cos(this.angle) * this.currentR;
        const wy = blobY + Math.sin(this.angle) * this.currentR;

        // Mouse interaction (Magnetic pull)
        const dx = mouseX - wx;
        const dy = mouseY - wy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Spike effect: Pull out if mouse is somewhat close but not inside
        let force = 0;
        if (dist < 300) {
            force = (300 - dist) * 0.5; // Pull force
        }

        // Spring physics for radius
        const targetRadius = radius + force;
        const x = targetRadius - this.currentR;
        this.velocity += x * tension;
        this.velocity -= this.velocity * dampening;
        this.currentR += this.velocity;
      }
    }

    let vertices: Vertex[] = [];
    for (let i = 0; i < vertexCount; i++) {
      vertices.push(new Vertex((i / vertexCount) * Math.PI * 2));
    }

    // Blob position
    let blobPos = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const handleClick = () => {
      // Splash effect: violently push vertices out
      vertices.forEach(v => {
        v.velocity += (Math.random() * 100) + 50;
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow for blob center
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      
      blobPos.x += (mouse.x - blobPos.x) * 0.08;
      blobPos.y += (mouse.y - blobPos.y) * 0.08;

      // Update physics
      // Pass 1: Self update
      vertices.forEach(v => v.update(blobPos.x, blobPos.y, mouse.tx, mouse.ty));

      // Pass 2: Wave spread (neighbors affect each other)
      const leftDeltas = new Array(vertices.length);
      const rightDeltas = new Array(vertices.length);

      for (let j = 0; j < 3; j++) { // Iterations for smoothness
        for (let i = 0; i < vertices.length; i++) {
            const prev = vertices[(i - 1 + vertices.length) % vertices.length];
            const next = vertices[(i + 1) % vertices.length];
            const cur = vertices[i];

            // Neighbor pull
            const velocityProp = spread * 0.1;
            // Simplified wave propagation calculation
            // In a real spring system we'd check neighbors' displacement
        }
      }

      // Draw Ferrofluid
      ctx.save();
      ctx.beginPath();
      
      // Draw smooth curve through vertices
      const first = vertices[0];
      const startX = blobPos.x + Math.cos(first.angle) * first.currentR;
      const startY = blobPos.y + Math.sin(first.angle) * first.currentR;
      
      ctx.moveTo(startX, startY);

      for (let i = 1; i <= vertices.length; i++) {
        const curr = vertices[i % vertices.length];
        const next = vertices[(i + 1) % vertices.length];
        
        const x1 = blobPos.x + Math.cos(curr.angle) * curr.currentR;
        const y1 = blobPos.y + Math.sin(curr.angle) * curr.currentR;
        
        const x2 = blobPos.x + Math.cos(next.angle) * next.currentR;
        const y2 = blobPos.y + Math.sin(next.angle) * next.currentR;
        
        // Midpoint for quadratic curve
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        
        ctx.quadraticCurveTo(x1, y1, mx, my);
      }
      
      ctx.closePath();
      
      // Create the mask for reflection
      ctx.clip();

      // Background "Environment Map" - The Neon City Reflection
      // We draw a distorted gradient that moves relative to the blob to fake reflection
      
      // Base oily black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Reflection gradients
      const grad = ctx.createLinearGradient(
        blobPos.x - radius, blobPos.y - radius, 
        blobPos.x + radius, blobPos.y + radius
      );
      grad.addColorStop(0, '#0a0a0a');
      grad.addColorStop(0.4, '#111111');
      grad.addColorStop(0.5, '#222'); // Horizon line
      grad.addColorStop(0.55, '#000');
      grad.addColorStop(1, '#050505');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Neon Lights Reflections
      // Light 1: Cyan
      ctx.beginPath();
      ctx.arc(
        blobPos.x - 50 + (mouse.x - width/2)*0.1, 
        blobPos.y - 50 + (mouse.y - height/2)*0.1, 
        100, 0, Math.PI * 2
      );
      const light1 = ctx.createRadialGradient(
        blobPos.x - 50, blobPos.y - 50, 10,
        blobPos.x - 50, blobPos.y - 50, 120
      );
      light1.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
      light1.addColorStop(1, 'rgba(0, 243, 255, 0)');
      ctx.fillStyle = light1;
      ctx.fill();

      // Light 2: Purple
      ctx.beginPath();
      ctx.arc(
        blobPos.x + 80 + (mouse.x - width/2)*-0.05, 
        blobPos.y + 60 + (mouse.y - height/2)*-0.05, 
        150, 0, Math.PI * 2
      );
      const light2 = ctx.createRadialGradient(
        blobPos.x + 80, blobPos.y + 60, 20,
        blobPos.x + 80, blobPos.y + 60, 180
      );
      light2.addColorStop(0, 'rgba(188, 19, 254, 0.3)');
      light2.addColorStop(1, 'rgba(188, 19, 254, 0)');
      ctx.fillStyle = light2;
      ctx.fill();

      // Specular Highlight (The "Wet" look)
      ctx.beginPath();
      ctx.ellipse(
        blobPos.x - 40, blobPos.y - 60, 
        30, 15, Math.PI / 4, 0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      ctx.restore();

      // Outer Glow (for contrast against dark bg)
      // We redraw the path just for the shadow
      ctx.save();
      ctx.beginPath();
      const f = vertices[0];
      ctx.moveTo(blobPos.x + Math.cos(f.angle) * f.currentR, blobPos.y + Math.sin(f.angle) * f.currentR);
      for (let i = 1; i <= vertices.length; i++) {
        const curr = vertices[i % vertices.length];
        const next = vertices[(i + 1) % vertices.length];
        const x1 = blobPos.x + Math.cos(curr.angle) * curr.currentR;
        const y1 = blobPos.y + Math.sin(curr.angle) * curr.currentR;
        const x2 = blobPos.x + Math.cos(next.angle) * next.currentR;
        const y2 = blobPos.y + Math.sin(next.angle) * next.currentR;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, mx, my);
      }
      ctx.closePath();
      ctx.shadowColor = 'rgba(0, 243, 255, 0.1)';
      ctx.shadowBlur = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default Ferrofluid;
