"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// Register GSAP plugin once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// 1. Hotspot Component (Optimized)
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
      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }} 
    >
      {/* Icon Circle */}
      <div 
        className="relative z-20 flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-500 ease-out shrink-0"
        style={{
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.3)' : '0 0 10px rgba(0,0,0,0.5)', 
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
      
      {/* Label */}
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
          textShadow: '0 2px 5px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 2px 5px rgba(0,0,0,0.8)',
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
            backgroundColor: 'rgba(10, 10, 10, 0.90)',
            backdropFilter: 'blur(10px)', 
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
// 2. Main Zoom Component (Optimized)
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
  scrollDistance = "+=700%",
  buildingZoomScale = 16,
  windowZoomScale = 2.5,
  windowMoveDistance = 1,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Outer refs
  const pointer1Ref = useRef<HTMLDivElement>(null);
  const pointer2Ref = useRef<HTMLDivElement>(null);
  const pointer3Ref = useRef<HTMLDivElement>(null);
  const pointer4Ref = useRef<HTMLDivElement>(null);

  // Inner refs
  const pointer1InnerRef = useRef<HTMLDivElement>(null);
  const pointer2InnerRef = useRef<HTMLDivElement>(null);
  const pointer3InnerRef = useRef<HTMLDivElement>(null);
  const pointer4InnerRef = useRef<HTMLDivElement>(null);
  
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const needsDrawRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isLockedRef = useRef(true);
  
  const [isReady, setIsReady] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  
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

  // Initialize on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Reset scroll
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    isLockedRef.current = true;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Unlock scroll on user interaction
  useEffect(() => {
    if (typeof window === 'undefined' || !isReady) return;
    
    const unlock = () => { 
      isLockedRef.current = false; 
    };
    
    window.addEventListener('wheel', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    
    return () => {
      window.removeEventListener('wheel', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [isReady]);

  // Preload all images
  useEffect(() => {
    if (!isReady) return;
    
    let loadedCount = 0;
    const totalImages = 3;
    
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setAllImagesLoaded(true);
      }
    };
    
    // Load window image for canvas
    const windowImg = new Image();
    windowImg.decoding = 'async';
    windowImg.onload = () => {
      imageRef.current = windowImg;
      checkAllLoaded();
    };
    windowImg.onerror = checkAllLoaded;
    windowImg.src = resolvedWindowSrc;
    
    // Load building image
    const buildingImg = new Image();
    buildingImg.decoding = 'async';
    buildingImg.onload = checkAllLoaded;
    buildingImg.onerror = checkAllLoaded;
    buildingImg.src = resolvedBuildingSrc;
    
    // Load shape image
    const shapeImg = new Image();
    shapeImg.decoding = 'async';
    shapeImg.onload = checkAllLoaded;
    shapeImg.onerror = checkAllLoaded;
    shapeImg.src = resolvedShapeSrc;
    
  }, [isReady, resolvedWindowSrc, resolvedBuildingSrc, resolvedShapeSrc]);

  // --- Canvas Drawing ---
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img) return;

    const { scale, panY, lastScale, lastPanY } = animState.current;
    if (Math.abs(scale - lastScale) < 0.001 && Math.abs(panY - lastPanY) < 0.001) return;
    
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

    const drawX = Math.floor((displayWidth - drawWidth) / 2);
    const extraHeight = drawHeight - displayHeight;
    const drawY = Math.floor(-extraHeight * panY);

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
  }, []);

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
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      canvasCtxRef.current = ctx;
    }
    drawCanvas();
  }, [drawCanvas]);

  // Setup canvas when images are loaded
  useEffect(() => {
    if (allImagesLoaded) {
      setupCanvas();
    }
  }, [allImagesLoaded, setupCanvas]);

  // Handle Resize
  useEffect(() => {
    if (!allImagesLoaded) return;
    
    const handleResize = () => {
      setupCanvas();
      if (timelineRef.current) {
        timelineRef.current.invalidate();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.refresh();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [allImagesLoaded, setupCanvas]);

  // ============================================
  // ANIMATION TIMELINE (Smoother building zoom)
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined' || !allImagesLoaded || !isReady) return;

    // Clean up previous instances
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    // Reset animation state
    animState.current = {
      scale: 1,
      panY: 0,
      lastScale: -1,
      lastPanY: -1,
    };

    // Initial States
    gsap.set(shapeRef.current, { opacity: 1, force3D: true });
    gsap.set(buildingRef.current, { scale: 1, opacity: 1, force3D: true, z: 0 }); 
    gsap.set(textRef.current, { opacity: 0, y: 60 });
    
    gsap.set([
      pointer1InnerRef.current, 
      pointer2InnerRef.current, 
      pointer3InnerRef.current, 
      pointer4InnerRef.current
    ], { opacity: 0, scale: 0.8, force3D: true });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    timelineRef.current = tl;

    // --- PHASE 1: BUILDING ZOOM (0 - 2.5) - Smoother easing ---
    tl.to(shapeRef.current, { opacity: 0, duration: 0.6, ease: "power1.out" }, 0);
    tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.3);
    
    tl.to(buildingRef.current, { 
      scale: buildingZoomScale, 
      duration: 2.5,
      ease: "sine.inOut",  // Smoother easing - less aggressive
      force3D: true
    }, 0);

    // --- PHASE 2: TRANSITION - Instant ---
    tl.to(buildingRef.current, { opacity: 0, duration: 0.01, ease: "none" }, 2.49);
    tl.to(textRef.current, { opacity: 0, duration: 0.01, ease: "none" }, 2.49);

    // --- PHASE 3: WINDOW ZOOM (2.5 - 3.5) ---
    tl.to(animState.current, {
      scale: windowZoomScale,
      duration: 1.0,
      ease: "sine.inOut",
      onUpdate: scheduleCanvasDraw,
    }, 2.5);

    // --- PHASE 4: PAN & HOTSPOTS (3.5 - 11) ---
    tl.to(animState.current, {
      panY: windowMoveDistance,
      duration: 7.5,
      ease: "sine.inOut",
      onUpdate: () => {
        scheduleCanvasDraw();
        
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
          
          const transformStyle = `translate3d(0, ${-panOffset}px, 0)`;
          
          if (pointer1Ref.current) pointer1Ref.current.style.transform = transformStyle;
          if (pointer3Ref.current) pointer3Ref.current.style.transform = transformStyle;
          if (pointer4Ref.current) pointer4Ref.current.style.transform = transformStyle;
        }
      },
    }, 3.5);

    // Hotspot reveal helper
    const revealHotspot = (ref: React.RefObject<HTMLDivElement | null>, time: number) => {
      tl.to(ref.current, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" }, time);
      tl.to(ref.current, { opacity: 0, scale: 0.95, duration: 0.5, ease: "power1.in" }, time + 1.8);
    };

    // Hotspot 1: appears at 4
    revealHotspot(pointer1InnerRef, 4);
    
    // Hotspot 2: appears at 5, stays longer
    tl.to(pointer2InnerRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" }, 5);
    tl.to(pointer2InnerRef.current, { opacity: 0, scale: 0.95, duration: 0.5, ease: "power1.in" }, 8);
    
    // Hotspot 3: appears at 8.5
    revealHotspot(pointer3InnerRef, 8.5);
    
    // Hotspot 4: appears at 10
    revealHotspot(pointer4InnerRef, 10);

    // Create ScrollTrigger with higher scrub value for smoother animation
    const stTimer = setTimeout(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: scrollDistance,
        pin: true,
        scrub: 2.5,  // Higher value = smoother/slower catch-up when scrolling fast
        onUpdate: (self) => {
          if (!isLockedRef.current && timelineRef.current) {
            timelineRef.current.progress(self.progress);
          }
        }
      });
    }, 50);

    return () => {
      clearTimeout(stTimer);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [allImagesLoaded, isReady, buildingZoomScale, windowZoomScale, windowMoveDistance, scrollDistance, scheduleCanvasDraw]);

  // Show loading state until ready
  if (!isReady) {
    return <section className="w-full h-screen bg-black" />;
  }

  return (
    <section 
      ref={wrapperRef} 
      className="relative w-full bg-black overflow-hidden" 
      style={{ 
        minHeight: '100vh', 
        zIndex: 50,
        opacity: allImagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        
        {/* Shape Overlay */}
        <img
          ref={shapeRef}
          src={resolvedShapeSrc}
          alt=""
          decoding="async"
          className="absolute top-0 left-1/2 w-full max-w-[100vw] -translate-x-1/2 pointer-events-none"
          style={{ 
            zIndex: 100, 
            height: 'auto', 
            objectFit: 'contain', 
            willChange: 'opacity', 
            backfaceVisibility: 'hidden' 
          }}
        />
        
        {/* Main Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full" 
          style={{ zIndex: 1 }} 
        />

        {/* HOTSPOTS */}
        <div ref={pointer1Ref} className="absolute" style={{ zIndex: 20, top: '27%', right: '47%', willChange: 'transform' }}>
          <div ref={pointer1InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="SkyPods" 
              subtitle="54th-55th Floor" 
              position="left" 
              description="The 4 Sky Pods, inspired by the elements, elevate everyday moments and transform them into something truly spectacular." 
            />
          </div>
        </div>

        <div ref={pointer2Ref} className="absolute" style={{ zIndex: 20, top: '30%', right: '40%', willChange: 'transform' }}>
          <div ref={pointer2InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Residencies" 
              subtitle="5th-53rd Floor" 
              position="left" 
              description="Live uninhibited at our magnificent residences that stretch out at 8,000+ sft each, with eight sprawling duplexes that soar even higher. " 
            />
          </div>
        </div>

        <div ref={pointer3Ref} className="absolute" style={{ zIndex: 20, top: '203%', right: '42%', willChange: 'transform' }}>
          <div ref={pointer3InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Clubhouse" 
              subtitle="G-4th Floor" 
              position="left" 
              description="The first 4 floors of Mirai are a part of its spectacular Clubhouse. Each level offers a retreat of indulgence unlike any other, accessible only to a privileged few." 
            />
          </div>
        </div>

        <div ref={pointer4Ref} className="absolute" style={{ zIndex: 20, top: '218%', left: '8%', willChange: 'transform' }}>
          <div ref={pointer4InnerRef} className="opacity-0 scale-90 origin-center">
            <Hotspot 
              title="Podium Level" 
              subtitle="Ground Floor" 
              position="left" 
              description="Discover mesmerising terrains & unique amenities at the podium of Mirai, where you experience a whole new world in itself."
            />
          </div>
        </div>

        {/* Floating Text */}
        <div ref={textRef} className="absolute top-10 right-10 md:top-16 md:right-24" style={{ zIndex: 5 }}>
          <h2 className="text-white leading-tight tracking-tight uppercase text-right" style={{ fontFamily: 'Migra', fontSize: '42px', fontWeight: 300 }}>
            Where You're Always<br />
            In Your Element
          </h2>
        </div>

        {/* Initial Building View */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          <img
            ref={buildingRef}
            src={resolvedBuildingSrc}
            alt="Building View"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              willChange: 'transform, opacity', 
              backfaceVisibility: 'hidden', 
              transform: 'translateZ(0)' 
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default RevealZoom;
