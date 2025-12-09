
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, DrawingUtils, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Camera, MousePointer2, GripVertical, Minimize2, Maximize2, X, Info, AlertCircle, Loader2, Hand } from 'lucide-react';

// --- SMOOTHING UTILITY ---
// Simple Low Pass Filter to remove jitter from webcam data
class LowPassFilter {
  x: number;
  y: number;
  alpha: number;

  constructor(alpha = 0.15) {
    this.x = 0;
    this.y = 0;
    this.alpha = alpha;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
  }

  update(targetX: number, targetY: number) {
    this.x += (targetX - this.x) * this.alpha;
    this.y += (targetY - this.y) * this.alpha;
    return { x: this.x, y: this.y };
  }
}

const GestureController: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorVisualRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<'pointer' | 'scroll' | 'click'>('pointer');
  const [showInstructions, setShowInstructions] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Logic state
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const lastHoveredElementRef = useRef<Element | null>(null);
  
  // Physics & State
  const smoother = useRef(new LowPassFilter(0.15)); // 0.15 = smooth but responsive
  const scrollState = useRef({ 
    active: false, 
    anchorY: 0.5, // Normalized 0-1
    speed: 0 
  });
  const clickState = useRef({ 
    isPinching: false, 
    pinchStartTime: 0,
    hasClicked: false 
  });

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        
        if (!isMounted) return;

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.6, // Higher confidence to reduce ghost hands
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load MediaPipe:", error);
        setErrorMessage("AI Model Init Failed. Refresh?");
      }
    };
    init();

    return () => {
        isMounted = false;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.dispatchEvent(new CustomEvent('gesture-mode', { detail: false }));
    };
  }, []);

  const enableCam = async () => {
    if (!handLandmarkerRef.current) return;
    setErrorMessage(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          frameRate: { ideal: 30 } 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
            predictWebcam();
            setPermissionGranted(true);
            setShowInstructions(true);
            window.dispatchEvent(new CustomEvent('gesture-mode', { detail: true }));
        });
      }
    } catch (err) {
      console.error("Webcam denied", err);
      setErrorMessage("Camera blocked. Check permissions.");
    }
  };

  // --- UTILS ---
  const getDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isFingerCurled = (landmarks: NormalizedLandmark[], tipIdx: number, pipIdx: number, wristIdx: number = 0) => {
      // Robust check: Is Tip closer to Wrist than PIP is?
      const tipToWrist = getDistance(landmarks[tipIdx], landmarks[wristIdx]);
      const pipToWrist = getDistance(landmarks[pipIdx], landmarks[wristIdx]);
      return tipToWrist < pipToWrist;
  };

  const simulateEvents = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    
    // Always fire mousemove to trigger tilt/hover effects
    if (el) {
        el.dispatchEvent(new MouseEvent('mousemove', { 
            bubbles: true, 
            view: window, 
            clientX: x, 
            clientY: y 
        }));
    }

    if (el !== lastHoveredElementRef.current) {
        if (lastHoveredElementRef.current) {
            lastHoveredElementRef.current.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, view: window }));
            lastHoveredElementRef.current.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, view: window }));
        }
        if (el) {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window, clientX: x, clientY: y }));
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, view: window, clientX: x, clientY: y }));
        }
        lastHoveredElementRef.current = el;
    }
  };

  // --- MAIN LOOP ---
  const predictWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      let startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        const result = handLandmarkerRef.current?.detectForVideo(video, startTimeMs);

        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (result?.landmarks && result.landmarks.length > 0) {
          setHandDetected(true);
          const landmarks = result.landmarks[0];
          
          // --- GESTURE RECOGNITION ---
          
          // 1. Check Scroll (Fist)
          // Index, Middle, Ring, Pinky curled?
          const indexCurled = isFingerCurled(landmarks, 8, 6);
          const middleCurled = isFingerCurled(landmarks, 12, 10);
          const ringCurled = isFingerCurled(landmarks, 16, 14);
          const pinkyCurled = isFingerCurled(landmarks, 20, 18);
          
          const isFist = middleCurled && ringCurled && pinkyCurled; // Index is optional, sometimes used for pointing
          
          // 2. Check Click (Pinch)
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const pinchDist = getDistance(thumbTip, indexTip);
          const isPinching = pinchDist < 0.05; // 5% of screen width approx

          // --- MODE SWITCHING ---
          
          if (isFist && !scrollState.current.active) {
              setMode('scroll');
              scrollState.current.active = true;
              // Set anchor at current hand height (use wrist as stable point)
              scrollState.current.anchorY = landmarks[0].y; 
          } else if (!isFist && scrollState.current.active) {
              setMode('pointer');
              scrollState.current.active = false;
          }

          // --- LOGIC EXECUTION ---

          if (scrollState.current.active) {
              // SCROLL MODE (Joystick)
              const currentY = landmarks[0].y; // Wrist Y
              const diff = currentY - scrollState.current.anchorY;
              
              // Deadzone of 5%
              if (Math.abs(diff) > 0.05) {
                  // Hand moved UP (smaller Y) -> Scroll Down? No, Hand Up -> Page Up usually.
                  // Let's map: Hand Up (Negative Diff) -> Scroll Up (Negative Scroll)
                  // Hand Down (Positive Diff) -> Scroll Down (Positive Scroll)
                  
                  // Multiplier for speed
                  const speed = diff * 40; 
                  window.scrollBy(0, speed);
              }
              
              // Update Visual Anchor Bar
              if (scrollAnchorRef.current) {
                  // Position the anchor visually at the start point
                  // We can't really move the anchor, but we can show the deviation
                  const offset = diff * 200; // visual pixels
                  scrollAnchorRef.current.style.transform = `translateY(${offset}px)`;
                  scrollAnchorRef.current.style.opacity = '1';
              }

          } else {
              // POINTER MODE
              if (scrollAnchorRef.current) scrollAnchorRef.current.style.opacity = '0';

              // Map Index Tip (8) to screen
              // Mirror X
              const rawX = 1 - landmarks[8].x;
              const rawY = landmarks[8].y;
              
              // Overscan to reach edges (1.4x)
              const scale = 1.4;
              const targetX = (rawX - 0.5) * scale * window.innerWidth + window.innerWidth / 2;
              const targetY = (rawY - 0.5) * scale * window.innerHeight + window.innerHeight / 2;
              
              const clampedX = Math.max(0, Math.min(window.innerWidth, targetX));
              const clampedY = Math.max(0, Math.min(window.innerHeight, targetY));

              // Smooth
              const smoothPos = smoother.current.update(clampedX, clampedY);
              
              // Update Cursor
              if (cursorVisualRef.current) {
                  cursorVisualRef.current.style.transform = `translate3d(${smoothPos.x}px, ${smoothPos.y}px, 0)`;
              }

              // Hover Events
              simulateEvents(smoothPos.x, smoothPos.y);

              // Click Logic
              if (isPinching) {
                  if (!clickState.current.isPinching) {
                      clickState.current.isPinching = true;
                      clickState.current.pinchStartTime = Date.now();
                      setMode('click');
                  } else {
                      // Holding pinch... check if long press or drag?
                  }
              } else {
                  if (clickState.current.isPinching) {
                      // Released!
                      clickState.current.isPinching = false;
                      setMode('pointer');
                      
                      // Trigger click on release (standard UI behavior)
                      const el = document.elementFromPoint(smoothPos.x, smoothPos.y);
                      if (el) {
                          (el as HTMLElement).click();
                          
                          // Visual Ripple
                          const ripple = document.createElement('div');
                          ripple.className = 'fixed rounded-full border-2 border-neon-purple z-[10001] animate-ping pointer-events-none';
                          ripple.style.left = `${smoothPos.x}px`;
                          ripple.style.top = `${smoothPos.y}px`;
                          ripple.style.width = '10px';
                          ripple.style.height = '10px';
                          ripple.style.transform = 'translate(-50%, -50%)';
                          document.body.appendChild(ripple);
                          setTimeout(() => ripple.remove(), 600);
                      }
                  }
              }
          }

          // --- DEBUG DRAWING ---
          if (ctx) {
             const drawingUtils = new DrawingUtils(ctx);
             drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: "#00f3ff",
                lineWidth: 2
             });
             // Draw Index Tip bigger
             const tip = landmarks[8];
             ctx.beginPath();
             ctx.arc(tip.x * canvas.width, tip.y * canvas.height, 5, 0, 2 * Math.PI);
             ctx.fillStyle = isPinching ? "#bc13fe" : "#ffffff";
             ctx.fill();
          }

        } else {
          setHandDetected(false);
          // Hide cursor if no hand
          if (cursorVisualRef.current) cursorVisualRef.current.style.opacity = '0';
        }
      } else {
          // If we have a hand, ensure cursor is visible
          if (handDetected && cursorVisualRef.current) cursorVisualRef.current.style.opacity = '1';
      }
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <>
    {/* --- GESTURE CONTROLS UI --- */}
    <div className={`fixed bottom-6 left-6 z-[9999] transition-all duration-300 flex flex-col items-start gap-2 font-sans`}>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 mb-2 backdrop-blur">
           <AlertCircle size={12} />
           {errorMessage}
        </div>
      )}

      {!isLoaded && (
         <div className="bg-black/80 text-neon-blue px-4 py-2 rounded-full border border-neon-blue/20 text-xs font-mono flex items-center gap-2 animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            LOADING AI VISION...
         </div>
      )}

      {isLoaded && !permissionGranted && !errorMessage && (
        <button 
          onClick={enableCam}
          className="flex items-center gap-2 bg-black/80 hover:bg-neon-blue/20 text-white px-5 py-3 rounded-full border border-white/20 transition-all backdrop-blur-md group hover:border-neon-blue shadow-lg shadow-neon-blue/10"
        >
          <Camera size={18} className="text-neon-blue group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono tracking-wider font-bold">ENABLE GESTURE CONTROL</span>
        </button>
      )}

      {permissionGranted && (
        <div className="relative group">
          {/* Header Bar */}
          <div className="absolute -top-10 left-0 flex items-center gap-2">
             <button 
               onClick={() => setIsMinimized(!isMinimized)}
               className="bg-black/90 text-white p-2 rounded hover:text-neon-blue transition-colors border border-white/10"
             >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
             </button>
             <button 
               onClick={() => setShowInstructions(true)}
               className="bg-black/90 text-white p-2 rounded hover:text-neon-blue transition-colors border border-white/10"
               title="Show Instructions"
             >
                <Info size={14} />
             </button>
             <div className={`text-[10px] font-mono px-3 py-1 rounded border ${handDetected ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>
                {handDetected ? 'TRACKING ACTIVE' : 'NO HAND FOUND'}
             </div>
          </div>

          <div className={`relative bg-black rounded-xl border border-neon-blue/30 overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all duration-300 ${isMinimized ? 'w-0 h-0 border-0 opacity-0' : 'w-52 h-40'}`}>
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-60" 
              autoPlay 
              playsInline
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
            />
            
            {/* Mode Overlay */}
            <div className="absolute bottom-2 left-2 right-2 px-3 py-2 bg-black/70 backdrop-blur-md rounded-lg text-neon-blue border border-neon-blue/20 flex items-center justify-between">
               <span className="text-[10px] font-mono tracking-wider text-white/70">MODE</span>
               {mode === 'pointer' && <div className="flex items-center gap-1 text-neon-blue"><MousePointer2 size={12} /><span className="text-[9px] font-bold">POINTER</span></div>}
               {mode === 'scroll' && <div className="flex items-center gap-1 text-green-400"><GripVertical size={12} /><span className="text-[9px] font-bold">SCROLL</span></div>}
               {mode === 'click' && <div className="flex items-center gap-1 text-neon-purple"><div className="w-2 h-2 rounded-full bg-neon-purple"></div><span className="text-[9px] font-bold">CLICK</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* --- INSTRUCTIONS MODAL --- */}
    {showInstructions && (
      <div className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-[2rem] max-w-2xl w-full relative shadow-2xl">
          <button 
             onClick={() => setShowInstructions(false)}
             className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>

          <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
            <Hand className="text-neon-blue" size={32} />
            Gesture Commands
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
             <InstructionCard 
               icon={<MousePointer2 size={24} />} 
               title="Point" 
               desc="Raise your Index Finger. Keep palm open."
               color="text-neon-blue"
               borderColor="border-neon-blue/30"
             />
             <InstructionCard 
               icon={<div className="w-4 h-4 rounded-full bg-current"></div>} 
               title="Click" 
               desc="Pinch Thumb & Index finger together, then release."
               color="text-neon-purple"
               borderColor="border-neon-purple/30"
             />
             <InstructionCard 
               icon={<GripVertical size={24} />} 
               title="Scroll" 
               desc="Make a FIST. Move hand Up/Down like a joystick."
               color="text-green-500"
               borderColor="border-green-500/30"
             />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
             <p className="flex items-center gap-2">
                <AlertCircle size={14} className="text-yellow-500" />
                Ensure your hand is well-lit and visible.
             </p>
             <button 
                onClick={() => setShowInstructions(false)}
                className="px-8 py-3 bg-white text-black font-bold font-mono rounded-full hover:bg-neon-blue hover:scale-105 transition-all"
             >
                INITIALIZE
             </button>
          </div>
        </div>
      </div>
    )}

    {/* --- VISUAL CURSOR --- */}
    {permissionGranted && (
        <div 
            ref={cursorVisualRef}
            className="fixed pointer-events-none z-[10000] will-change-transform flex items-center justify-center transition-opacity duration-300"
            style={{ 
                left: 0, 
                top: 0,
                width: '0px',
                height: '0px',
                transform: `translate3d(-100px, -100px, 0)`,
                opacity: 0 
            }}
        >
            {/* Pointer Graphic */}
            <div className={`
                relative transition-all duration-200 ease-out flex items-center justify-center
                ${mode === 'scroll' ? 'opacity-0' : 'opacity-100'} 
            `}>
                 <div className={`w-8 h-8 rounded-full border-2 ${mode === 'click' ? 'border-neon-purple bg-neon-purple/20 scale-75' : 'border-neon-blue'}`}></div>
                 <div className="absolute w-1 h-1 bg-white rounded-full"></div>
            </div>

            {/* Scroll Anchor/Joystick Graphic */}
            <div 
                ref={scrollAnchorRef}
                className={`
                   absolute flex flex-col items-center justify-center transition-opacity duration-300
                   ${mode === 'scroll' ? 'opacity-100' : 'opacity-0'}
                `}
            >
                 <div className="w-[2px] h-20 bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
                 <div className="w-12 h-12 rounded-full border-2 border-green-500 border-dashed animate-[spin_3s_linear_infinite] flex items-center justify-center bg-black/50 backdrop-blur-sm absolute">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 </div>
                 <div className="absolute left-8 bg-green-500/10 text-green-500 text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap">
                    MOVE HAND UP/DOWN
                 </div>
            </div>
        </div>
    )}
    </>
  );
};

const InstructionCard = ({ icon, title, desc, color, borderColor }: any) => (
    <div className={`p-6 bg-white/5 rounded-2xl border ${borderColor} hover:bg-white/10 transition-colors flex flex-col items-center text-center gap-4`}>
        <div className={`p-4 rounded-full bg-white/5 ${color}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white text-xl mb-2">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default GestureController;
