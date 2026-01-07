"use client";

import { useEffect, useRef, useCallback, useState, memo, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// ============================================
// Constants
// ============================================
const DEFAULT_BUILDING_IMAGE = '/images/gateway/reveal.png';
const DEFAULT_WINDOW_IMAGE = '/images/gateway/mirai.png';
const DEFAULT_SHAPE_IMAGE = '/images/gateway/shape-two.png';

// Hotspot data moved outside component to prevent recreation
const HOTSPOT_DATA = [
  {
    id: 'skypods',
    title: 'SkyPods',
    subtitle: 'Floors 29-32',
    description: 'The top floors of the Mirai building are a collection of 16 exclusive SkyPods 100 metres above the ground.',
    style: { top: '27%', right: '47%' },
  },
  {
    id: 'residencies',
    title: 'Residencies',
    subtitle: 'Level 35',
    description: 'An exclusive rooftop sanctuary featuring panoramic 360-degree views of the city skyline.',
    style: { top: '30%', right: '40%' },
  },
  {
    id: 'clubhouse',
    title: 'Clubhouse',
    subtitle: 'Levels 3-4',
    description: 'A world-class wellness destination spanning two floors featuring infinity pools and private suites.',
    style: { top: '210%', right: '40%' },
  },
  {
    id: 'podium',
    title: 'Podium Level',
    subtitle: 'Gardens',
    description: 'Landscaped terraces and secret gardens create tranquil retreats within the urban landscape.',
    style: { top: '220%', right: '40%' },
  },
] as const;

// ============================================
// Hotspot Component (Memoized)
// ============================================
interface HotspotProps {
  title: string;
  subtitle: string;
  description: string;
  position: 'left' | 'right';
  hideIconOnOpen?: boolean;
}

const Hotspot = memo<HotspotProps>(({ title, subtitle, description, position, hideIconOnOpen = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldHideIcon = isHovered && hideIconOnOpen;

  const containerStyle = useMemo(() => ({
    transform: 'translateZ(0)',
    willChange: 'transform, opacity'
  }), []);

  const iconStyle = useMemo(() => ({
    backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    border: '1.5px solid rgba(255, 255, 255, 0.5)',
    boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.3)' : '0 0 10px rgba(0,0,0,0.5)',
    opacity: (position === 'right' && isHovered) || shouldHideIcon ? 0 : 1,
    pointerEvents: ((position === 'right' && isHovered) || shouldHideIcon ? 'none' : 'auto') as const,
    transform: (position === 'right' && isHovered) || shouldHideIcon ? 'translateX(8px) scale(0.92)' : 'none',
  }), [isHovered, position, shouldHideIcon]);

  const labelStyle = useMemo(() => ({
    opacity: isHovered ? 0 : 1,
    transform: isHovered ? (position === 'left' ? 'translateX(12px)' : 'translateX(-12px)') : 'translateX(0)',
    willChange: 'transform, opacity' as const,
  }), [isHovered, position]);

  const cardContainerStyle = useMemo(() => ({
    maxWidth: isHovered ? '400px' : '0px',
    opacity: isHovered ? 1 : 0,
    marginLeft: position === 'left' ? '-15px' : '0',
    marginRight: position === 'right' ? '-15px' : '0',
    paddingLeft: position === 'left' ? '25px' : '0',
    paddingRight: position === 'right' ? '25px' : '0',
    pointerEvents: 'auto' as const,
    willChange: 'max-width, opacity' as const,
  }), [isHovered, position]);

  const cardStyle = useMemo(() => ({
    minWidth: '300px',
    backgroundColor: 'rgba(10, 10, 10, 0.90)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  }), []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className={`flex items-center ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={containerStyle}
    >
      {/* Icon Circle */}
      <div
        className="relative z-20 flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-500 ease-out shrink-0"
        style={iconStyle}
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
        style={labelStyle}
      >
        <h3 className="text-white text-base font-normal tracking-[0.15em] uppercase whitespace-nowrap" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
          {title}
        </h3>
        <p className="text-white/60 text-[11px] tracking-[0.1em] uppercase whitespace-nowrap mt-0.5" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
          {subtitle}
        </p>
      </div>

      {/* Expanded Content Card */}
      <div className="overflow-hidden transition-all duration-300 ease-out" style={cardContainerStyle}>
        <div className="py-6 px-7 rounded-xl" style={cardStyle}>
          <h3 className="text-white text-lg font-normal tracking-[0.2em] uppercase mb-1">{title}</h3>
          <p className="text-white/50 text-xs tracking-[0.15em] uppercase mb-4">{subtitle}</p>
          <p className="text-white/85 text-sm font-light leading-[1.7] tracking-[0.02em]">{description}</p>
        </div>
      </div>
    </div>
  );
});

Hotspot.displayName = 'Hotspot';

// ============================================
// Main Zoom Component
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

function RevealZoom({
  buildingImage = DEFAULT_BUILDING_IMAGE,
  windowImage = DEFAULT_WINDOW_IMAGE,
  shapeImage = DEFAULT_SHAPE_IMAGE,
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
  const shapeRef = useRef<HTMLImageElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Refs arrays for cleaner iteration
  const pointerOuterRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const pointerInnerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const needsDrawRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isLockedRef = useRef(true);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const animState = useRef({
    scale: 1,
    panY: 0,
    lastScale: -1,
    lastPanY: -1,
  });

  // Resolve image sources once
  const resolvedBuildingSrc = useMemo(() =>
    typeof buildingImage === 'string' ? buildingImage : buildingImage.src,
    [buildingImage]
  );
  const resolvedWindowSrc = useMemo(() =>
    typeof windowImage === 'string' ? windowImage : windowImage.src,
    [windowImage]
  );
  const resolvedShapeSrc = useMemo(() =>
    typeof shapeImage === 'string' ? shapeImage : shapeImage.src,
    [shapeImage]
  );

  // Initial mount setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    isLockedRef.current = true;
    setIsMounted(true);
  }, []);

  // Unlock on user interaction
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

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img || !imageLoaded) return;

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

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      canvasCtxRef.current = ctx;
    }
    drawCanvas();
  }, [drawCanvas]);

  // Load window image
  useEffect(() => {
    if (!isMounted) return;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.src = resolvedWindowSrc;
    return () => {
      img.onload = null;
    };
  }, [resolvedWindowSrc, isMounted]);

  // Setup canvas when image loads
  useEffect(() => {
    if (imageLoaded && isMounted) setupCanvas();
  }, [imageLoaded, setupCanvas, isMounted]);

  // Handle resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupCanvas();
        timelineRef.current?.invalidate();
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [setupCanvas]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Animation Timeline
  useEffect(() => {
    if (typeof window === 'undefined' || !imageLoaded || !isMounted) return;

    gsap.registerPlugin(ScrollTrigger);
    timelineRef.current?.kill();

    // Initial States
    gsap.set(shapeRef.current, { opacity: 1, force3D: true });
    gsap.set(buildingRef.current, { scale: 1, opacity: 1, force3D: true, z: 0 });
    gsap.set(textRef.current, { opacity: 0, y: 60 });
    gsap.set(pointerInnerRefs.current, { opacity: 0, scale: 0.8, force3D: true });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    timelineRef.current = tl;

    // PHASE 1: BUILDING ZOOM (0 - 8)
    tl.to(shapeRef.current, { opacity: 0, duration: 2.0, ease: "power1.out" }, 0);
    tl.to(textRef.current, { opacity: 1, y: 0, duration: 2.2, ease: "power2.out" }, 1.5);
    tl.to(buildingRef.current, {
      scale: buildingZoomScale,
      duration: 8.0,
      ease: "power1.inOut",
      force3D: true
    }, 0);

    // PHASE 2: TRANSITION (8 - 10)
    tl.to(buildingRef.current, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, 8);
    tl.to(textRef.current, { opacity: 0, y: -40, duration: 1.2, ease: "power1.in" }, 8);

    // PHASE 3: WINDOW ZOOM (10 - 12)
    tl.to(animState.current, {
      scale: windowZoomScale,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: scheduleCanvasDraw,
    }, 10);

    // PHASE 4: PAN & HOTSPOTS (12 - 25)
    tl.to(animState.current, {
      panY: windowMoveDistance,
      duration: 13.0,
      ease: "sine.inOut",
      onUpdate: () => {
        scheduleCanvasDraw();

        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const displayHeight = canvas.clientHeight;
        const { scale, panY } = animState.current;

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

        // Update pointers (skip index 1 which is fixed)
        [0, 2, 3].forEach(i => {
          const ref = pointerOuterRefs.current[i];
          if (ref) ref.style.transform = transformStyle;
        });
      },
    }, 12);

    // Hotspot reveal animations
    const revealHotspot = (index: number, time: number, hideTime?: number) => {
      const ref = pointerInnerRefs.current[index];
      tl.to(ref, { opacity: 1, scale: 1, duration: 1.4, ease: "back.out(1.4)" }, time);
      tl.to(ref, { opacity: 0, scale: 0.95, duration: 1.0, ease: "power1.in" }, hideTime ?? time + 3.0);
    };

    revealHotspot(0, 13);
    revealHotspot(1, 14, 20.0);
    revealHotspot(2, 21);
    revealHotspot(3, 25);

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        if (!isLockedRef.current) tl.progress(self.progress);
      }
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [imageLoaded, isMounted, buildingZoomScale, windowZoomScale, windowMoveDistance, scrollDistance, scheduleCanvasDraw]);

  // Memoized styles
  const shapeStyle = useMemo(() => ({
    zIndex: 100,
    height: 'auto',
    objectFit: 'contain' as const,
    willChange: 'opacity' as const,
    backfaceVisibility: 'hidden' as const
  }), []);

  const buildingStyle = useMemo(() => ({
    willChange: 'transform, opacity' as const,
    backfaceVisibility: 'hidden' as const,
    transform: 'translateZ(0)'
  }), []);

  if (!isMounted) return <section className="w-full h-screen bg-black" />;

  return (
    <section ref={wrapperRef} className="relative w-full bg-black overflow-hidden" style={{ minHeight: '100vh', zIndex: 50 }}>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">

        {/* Shape Overlay */}
        <img
          ref={shapeRef}
          src={resolvedShapeSrc}
          alt=""
          decoding="async"
          loading="eager"
          className="absolute top-0 left-1/2 w-full max-w-[100vw] -translate-x-1/2 pointer-events-none"
          style={shapeStyle}
        />

        {/* Main Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

        {/* Hotspots */}
        {HOTSPOT_DATA.map((hotspot, index) => (
          <div
            key={hotspot.id}
            ref={el => { pointerOuterRefs.current[index] = el; }}
            className="absolute"
            style={{ zIndex: 20, ...hotspot.style, willChange: 'transform' }}
          >
            <div
              ref={el => { pointerInnerRefs.current[index] = el; }}
              className="opacity-0 scale-90 origin-center"
            >
              <Hotspot
                title={hotspot.title}
                subtitle={hotspot.subtitle}
                position="left"
                description={hotspot.description}
              />
            </div>
          </div>
        ))}

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
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
            style={buildingStyle}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(RevealZoom);
