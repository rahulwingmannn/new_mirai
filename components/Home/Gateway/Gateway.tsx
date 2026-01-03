"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// ============================================
// 1. Hotspot Component
// ============================================
interface HotspotProps {
  title: string;
  subtitle: string;
  description: string;
  position: 'left' | 'right';
  hideIconOnOpen?: boolean;
}

function Hotspot({ title, subtitle, description, position, hideIconOnOpen = false }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldHideIcon = isHovered && hideIconOnOpen;

  return (
    <div 
      className={`flex items-center ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon Circle */}
      <div 
        className="relative z-20 flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-500 ease-out shrink-0"
        style={{
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          boxShadow: isHovered ? '0 0 30px rgba(255,255,255,0.2)' : '0 0 20px rgba(0,0,0,0.5)',
          opacity: (position === 'right' && isHovered) || shouldHideIcon ? 0 : 1,
          pointerEvents: (position === 'right' && isHovered) || shouldHideIcon ? 'none' : 'auto',
          transform: (position === 'right' && isHovered) || shouldHideIcon ? 'translateX(8px) scale(0.92)' : 'none',
        }}
      >
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none"
          className="transition-transform duration-500"
          style={{ transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      
      {/* Label (Always Visible until Hover) */}
      <div 
        className={`flex flex-col justify-center transition-all duration-300 ${position === 'left' ? 'ml-4' : 'mr-4'}`}
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? (position === 'left' ? 'translateX(12px)' : 'translateX(-12px)') : 'translateX(0)',
          willChange: 'transform, opacity',
        }}
      >
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '400',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          marginTop: '2px',
          whiteSpace: 'nowrap',
        }}>
          {subtitle}
        </p>
      </div>
      
      {/* Expanded Content Card */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxWidth: isHovered ? '400px' : '0px',
          opacity: isHovered ? 1 : 0,
          marginLeft: position === 'left' ? '-15px' : '0',
          marginRight: position === 'right' ? '-15px' : '0',
          paddingLeft: position === 'left' ? '25px' : '0',
          paddingRight: position === 'right' ? '25px' : '0',
          pointerEvents: 'auto',
          willChange: 'max-width, opacity',
        }}
      >
        <div 
          className="py-6 px-7 rounded-xl"
          style={{ 
            minWidth: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '400', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
            {title}
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            {subtitle}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '300', lineHeight: '1.7', letterSpacing: '0.02em' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. Main Zoom Component
// ============================================
interface ZoomRevealProps {
  buildingImage?: string | StaticImageData;
  windowImage?: string | StaticImageData;
  shapeImage?: string | StaticImageData;
  scrollDistance?: string;
  buildingZoomScale?: number;
  windowZoomScale?: number;
  windowMoveDistance?: number;
}

export function RevealZoom({
  buildingImage = '/images/gateway/reveal.png',
  windowImage = '/images/gateway/mirai.png',
  shapeImage = '/images/gateway/shape-two.png',
  scrollDistance = "+=1100%", 
  buildingZoomScale = 16,
  windowZoomScale = 2.5,
  windowMoveDistance = 1,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // --- Refs ---
  // Outer refs: Used for Position/Translation via requestAnimationFrame (performance)
  const pointer1Ref = useRef<HTMLDivElement>(null); // SkyPods
  const pointer2Ref = useRef<HTMLDivElement>(null); // Residencies
  const pointer3Ref = useRef<HTMLDivElement>(null); // Clubhouse
  const pointer4Ref = useRef<HTMLDivElement>(null); // Podium Level

  // Inner refs: Used for Scale/Opacity Animation via GSAP (avoids transform conflicts)
  const pointer1InnerRef = useRef<HTMLDivElement>(null);
  const pointer2InnerRef = useRef<HTMLDivElement>(null);
  const pointer3InnerRef = useRef<HTMLDivElement>(null);
  const pointer4InnerRef = useRef<HTMLDivElement>(null);
  
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const needsDrawRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isLockedRef = useRef(true);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const shapeRef = useRef<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const animState = useRef({
    scale: 1,
    panY: 0,
    lastScale: -1,
    lastPanY: -1,
  });

  const resolvedBuildingSrc = typeof buildingImage === 'string' ? buildingImage : buildingImage.src;
  const resolvedWindowSrc = typeof windowImage === 'string' ? windowImage : windowImage.src;
  const resolvedShapeSrc = typeof shapeImage === 'string' ? shapeImage : shapeImage.src;

  // --- Initial Lock Logic ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    isLockedRef.current = true;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return;
    const unlock = () => { isLockedRef.current = false; };
    window.addEventListener('wheel', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    return () => {
      window.removeEventListener('wheel', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [isMounted]);

  // --- Canvas Logic ---
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img || !imageLoaded) return;

    const { scale, panY, lastScale, lastPanY } = animState.current;
    if (Math.abs(scale - lastScale) < 0.0001 && Math.abs(panY - lastPanY) < 0.0001) return;
    
    animState.current.lastScale = scale;
    animState.current.lastPanY = panY;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;
    
    let drawWidth: number, drawHeight: number;
    if (imgAspect > canvasAspect) {
      drawHeight = displayHeight * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = displayWidth * scale;
      drawHeight = drawWidth / imgAspect;
    }

    const drawX = (displayWidth - drawWidth) / 2;
    const extraHeight = drawHeight - displayHeight;
    const drawY = -extraHeight * panY;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
  }, [imageLoaded]);

  const scheduleCanvasDraw = useCallback(() => {
    if (needsDrawRef.current) return;
    needsDrawRef.current = true;
    rafIdRef.current = requestAnimationFrame(() => {
      needsDrawRef.current = false;
      drawCanvas();
    });
  }, [drawCanvas]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      canvasCtxRef.current = ctx;
    }
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (!isMounted) return;
    const img = new Image();
    img.onload = () => { imageRef.current = img; setImageLoaded(true); };
    img.src = resolvedWindowSrc;
  }, [resolvedWindowSrc, isMounted]);

  useEffect(() => {
    if (imageLoaded && isMounted) setupCanvas();
  }, [imageLoaded, setupCanvas, isMounted]);

  // ============================================
  // ANIMATION TIMELINE
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined' || !imageLoaded || !isMounted) return;

    gsap.registerPlugin(ScrollTrigger);
    if (timelineRef.current) timelineRef.current.kill();

    // Initial States
    gsap.set(shapeRef.current, { opacity: 1 });
    gsap.set(buildingRef.current, { scale: 1, opacity: 1 });
    gsap.set(textRef.current, { opacity: 0, y: 60 });
    
    // Set initial scale/opacity on INNER refs for ALL hotspots
    // This allows GSAP to control fading while the Outer refs handle movement
    gsap.set([
      pointer1InnerRef.current, 
      pointer2InnerRef.current, 
      pointer3InnerRef.current, 
      pointer4InnerRef.current
    ], { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    timelineRef.current = tl;

    // --- PHASE 1: BUILDING ZOOM (0 - 8) ---
    tl.to(shapeRef.current, { opacity: 0, duration: 2.0, ease: "power1.out" }, 0);
    tl.to(textRef.current, { opacity: 1, y: 0, duration: 2.2, ease: "power2.out" }, 1.5);
    tl.to(buildingRef.current, { scale: buildingZoomScale, duration: 8.0, ease: "power1.inOut" }, 0);

    // --- PHASE 2: TRANSITION (8 - 10) ---
    tl.to(buildingRef.current, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, 8);
    tl.to(textRef.current, { opacity: 0, y: -40, duration: 1.2, ease: "power1.in" }, 8);

    // --- PHASE 3: WINDOW ZOOM (10 - 12) ---
    tl.to(animState.current, {
      scale: windowZoomScale,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: scheduleCanvasDraw,
    }, 10);

    // --- PHASE 4: PAN & HOTSPOTS (12 - 25) ---
    tl.to(animState.current, {
      panY: windowMoveDistance,
      duration: 13.0,
      ease: "sine.inOut",
      onUpdate: () => {
        scheduleCanvasDraw();
        
        // --- MOVEMENT LOGIC ---
        if (canvasRef.current && imageRef.current) {
          const canvas = canvasRef.current;
          const img = imageRef.current;
          const displayHeight = canvas.clientHeight;
          const scale = animState.current.scale;
          const panY = animState.current.panY;
          
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = canvas.clientWidth / displayHeight;
          
          let drawHeight: number;
          if (imgAspect > canvasAspect) {
            drawHeight = displayHeight * scale;
          } else {
            const drawWidth = canvas.clientWidth * scale;
            drawHeight = drawWidth / imgAspect;
          }
          
          const extraHeight = drawHeight - displayHeight;
          const panOffset = extraHeight * panY;
          
          // SkyPods, Clubhouse, Podium move with the image
          // Residencies stays FIXED in viewport
          const transformStyle = `translateY(${-panOffset}px)`;
          
          if(pointer1Ref.current) pointer1Ref.current.style.transform = transformStyle;
          // pointer2 (Residencies) - NO transform, stays fixed
          if(pointer3Ref.current) pointer3Ref.current.style.transform = transformStyle;
          if(pointer4Ref.current) pointer4Ref.current.style.transform = transformStyle;
        }
      },
    }, 12);

    // Helper: Fade In/Out for hotspots (Targets Inner Ref)
    const revealHotspot = (ref: React.RefObject<HTMLDivElement | null>, time: number) => {
      tl.to(ref.current, { opacity: 1, scale: 1, duration: 1.4, ease: "back.out(1.4)" }, time);
      tl.to(ref.current, { opacity: 0, scale: 0.95, duration: 1.0, ease: "power1.in" }, time + 3.0);
    };

    // --- HOTSPOT TIMINGS ---
    // Residencies: Fixed in viewport
    // SkyPods, Clubhouse, Podium: Move with image
    
    // 1. SkyPods (Moves - visible at start, pans out)
    revealHotspot(pointer1InnerRef, 13);
    
    // 2. Residencies (Fixed in viewport)
    // Manually reveal Residencies without auto-hide so it stays visible
    tl.to(pointer2InnerRef.current, { opacity: 1, scale: 1, duration: 1.4, ease: "back.out(1.4)" }, 14);
    // Keep Residencies visible until Clubhouse appears
    tl.to(pointer2InnerRef.current, { opacity: 0, scale: 0.95, duration: 1.0, ease: "power1.in" }, 21);
    
    // 3. Clubhouse (Moves - pans into view)
    revealHotspot(pointer3InnerRef, 21);
    
    // 4. Podium (Moves - pans into view at end)
    revealHotspot(pointer4InnerRef, 25);

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 2,
      onUpdate: (self) => {
        if (!isLockedRef.current) tl.progress(self.progress);
      }
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [imageLoaded, isMounted, buildingZoomScale, windowZoomScale, windowMoveDistance, scrollDistance, scheduleCanvasDraw]);

  if (!isMounted) return <section className="w-full h-screen bg-black" />;

  return (
    <section ref={wrapperRef} className="relative w-full bg-black overflow-hidden" style={{ minHeight: '100vh', zIndex: 50 }}>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        
        {/* Shape Overlay */}
        <img
          ref={shapeRef}
          src={resolvedShapeSrc}
          alt=""
          className="absolute top-0 left-1/2 w-full max-w-[100vw] -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 100, height: 'auto', objectFit: 'contain', willChange: 'opacity' }}
        />
        
        {/* Main Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

        {/* ========================================================= */}
        {/* HOTSPOTS                                                  */}
        {/* ========================================================= */}
        {/* 
          POSITIONING:
          - Residencies: FIXED in viewport, does not move
          - SkyPods, Clubhouse, Podium: Move WITH the image (attached to building)
        */}
        
        {/* 1. SkyPods - MOVES with image */}
        {/* Starts visible, pans up and out of view */}
        <div ref={pointer1Ref} className="absolute" style={{ zIndex: 20, top: '41%', left: '15%', willChange: 'transform' }}>
          <div ref={pointer1InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="SkyPods" 
              subtitle="Floors 29-32" 
              position="right" 
              description="The top floors of the Mirai building are a collection of 16 exclusive SkyPods 100 metres above the ground." 
            />
          </div>
        </div>

        {/* 2. Residencies - FIXED in viewport */}
        <div ref={pointer2Ref} className="absolute" style={{ zIndex: 20, top: '36%', right: '20%', willChange: 'transform' }}>
          <div ref={pointer2InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Residencies" 
              subtitle="Level 35" 
              position="left" 
              description="An exclusive rooftop sanctuary featuring panoramic 360-degree views of the city skyline." 
            />
          </div>
        </div>

        {/* 3. Clubhouse - MOVES with image */}
        {/* Starts off-screen below, pans into view */}
        <div ref={pointer3Ref} className="absolute" style={{ zIndex: 20, top: '195%', right: '32%', willChange: 'transform' }}>
          <div ref={pointer3InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Clubhouse" 
              subtitle="Levels 3-4" 
              position="left" 
              description="A world-class wellness destination spanning two floors featuring infinity pools and private suites." 
            />
          </div>
        </div>

        {/* 4. Podium Level - MOVES with image */}
        {/* Starts off-screen below, pans into view at end */}
        <div ref={pointer4Ref} className="absolute" style={{ zIndex: 20, top: '210%', left: '10%', willChange: 'transform' }}>
          <div ref={pointer4InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Podium Level" 
              subtitle="Gardens" 
              position="right" 
              description="Landscaped terraces and secret gardens create tranquil retreats within the urban landscape." 
            />
          </div>
        </div>

        {/* Floating Text */}
        <div ref={textRef} className="absolute top-1/4 right-10 md:right-24" style={{ zIndex: 5 }}>
          <h2 className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight uppercase">
            Where You're Always<br />
            <span className="font-bold">In Your Element</span>
          </h2>
        </div>

        {/* Initial Building View (Fades out) */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          <img
            ref={buildingRef}
            src={resolvedBuildingSrc}
            alt="Building View"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform, opacity' }}
          />
        </div>
      </div>
    </section>
  );
}

export default RevealZoom;