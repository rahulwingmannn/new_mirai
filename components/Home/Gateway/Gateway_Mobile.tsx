"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// 1. Types & Interfaces
// ============================================
interface ZoomRevealProps {
  buildingImage?: string | StaticImageData;
  windowImage?: string | StaticImageData;
  shapeImage?: string | StaticImageData;
  scrollDistance?: string;
  buildingZoomScale?: number;
}

interface HotspotProps {
  title: string;
  subtitle: string;
  description: string;
  position: 'left' | 'right' | 'center';
}

// Helper to handle Next.js StaticImageData vs String
const getImageSrc = (img: string | StaticImageData): string => {
  if (typeof img === 'string') return img;
  return img.src;
};

// ============================================
// 2. Mobile Hotspot Component
// ============================================
function MobileHotspot({ title, subtitle, description, position }: HotspotProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: TouchEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.hotspot-container')) setIsExpanded(false);
    };
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="hotspot-container relative flex flex-col" 
         style={{ alignItems: position === 'right' ? 'flex-end' : position === 'center' ? 'center' : 'flex-start' }}>
      <button 
        onClick={handleTap}
        className="relative z-20 flex items-center justify-center w-12 h-12 rounded-full border border-white/50 transition-all duration-300"
        style={{ 
          backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.6)',
          boxShadow: isExpanded ? '0 0 25px rgba(255,255,255,0.5)' : '0 0 15px rgba(0,0,0,0.5)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" className="transition-transform duration-300"
             style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <line x1="12" y1="5" x2="12" y2="19" stroke={isExpanded ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke={isExpanded ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mt-2 transition-all duration-300" 
           style={{ opacity: isExpanded ? 0 : 1, textAlign: position === 'right' ? 'right' : 'left' }}>
        <h3 className="text-white text-[12px] uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="absolute top-[60px] z-[100] transition-all duration-300"
           style={{ 
             opacity: isExpanded ? 1 : 0, 
             pointerEvents: isExpanded ? 'auto' : 'none',
             right: position === 'right' ? 0 : 'auto',
             left: position === 'left' ? 0 : position === 'center' ? '50%' : 'auto',
             transform: position === 'center' ? 'translateX(-50%)' : 'none'
           }}>
        <div className="p-4 rounded-xl min-w-[240px] max-w-[280px] bg-black/90 backdrop-blur-md border border-white/15 shadow-2xl">
          <h3 className="text-white text-[14px] uppercase tracking-widest mb-1">{title}</h3>
          <p className="text-white/50 text-[10px] uppercase mb-2">{subtitle}</p>
          <p className="text-white/85 text-[13px] font-light leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 3. Main Mobile Zoom Component
// ============================================
export function RevealZoomMobile({
  buildingImage = '/images/gateway/girlmobile.png',
  windowImage = '/images/gateway/Buildingmobile.png',
  shapeImage = '/images/gateway/shape-two.png',
  scrollDistance = "+=400%",
  buildingZoomScale = 12,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLImageElement>(null);
  
  const hotspotRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // Canvas drawing logic
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawW = canvas.width, drawH = canvas.height;
    if (imgAspect > canvasAspect) drawW = canvas.height * imgAspect;
    else drawH = canvas.width / imgAspect;

    ctx.drawImage(img, (canvas.width - drawW) / 2, (canvas.height - drawH) / 2, drawW, drawH);
  }, []);

  useEffect(() => {
    const windowImg = new Image();
    windowImg.onload = () => {
      imageRef.current = windowImg;
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        drawCanvas();
      }
      setAllImagesLoaded(true);
    };
    // Use the helper function here to fix the "never" error
    windowImg.src = getImageSrc(windowImage);
  }, [windowImage, drawCanvas]);

  // Animation Timeline
  useEffect(() => {
    if (!allImagesLoaded) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: scrollDistance,
        pin: true,
        scrub: 1,
        onUpdate: () => drawCanvas()
      }
    });

    // Reset initial states
    gsap.set(hotspotRefs.map(r => r.current), { opacity: 0, scale: 0.5 });

    // 1. Zoom and Fade Building
    tl.to(shapeRef.current, { opacity: 0, duration: 1 }, 0);
    tl.to(textRef.current, { opacity: 1, y: 0, duration: 1 }, 0.2);
    
    tl.fromTo(buildingRef.current, 
      { scale: 1, opacity: 1 },
      { scale: buildingZoomScale, duration: 3, ease: "power2.inOut" }, 
      0
    );

    tl.to(buildingRef.current, { opacity: 0, duration: 1, ease: "power1.inOut" }, 2.5);
    tl.to(textRef.current, { opacity: 0, duration: 1 }, 2.5);

    // 2. Reveal Hotspots
    hotspotRefs.forEach((ref, i) => {
      tl.to(ref.current, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 3.5 + (i * 0.5));
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [allImagesLoaded, buildingZoomScale, scrollDistance, drawCanvas]);

  return (
    <section ref={wrapperRef} className="relative w-full h-screen bg-black overflow-hidden" style={{ opacity: allImagesLoaded ? 1 : 0 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      <img
        ref={buildingRef}
        src={getImageSrc(buildingImage)}
        alt="Building"
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
      />

      <img ref={shapeRef} src={getImageSrc(shapeImage)} className="absolute top-0 left-0 w-full z-50 pointer-events-none" alt="" />

      <div ref={textRef} className="absolute top-1/4 left-0 w-full px-6 z-20 opacity-0 translate-y-10 text-center">
        <h2 className="text-white text-3xl uppercase font-light tracking-tighter">
          Where You're Always<br />In Your Element
        </h2>
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none">
        <div ref={hotspotRefs[0]} className="absolute top-[20%] right-[10%] pointer-events-auto">
          <MobileHotspot title="SkyPods" subtitle="54th Floor" position="right" description="Elevate everyday moments into something spectacular." />
        </div>
        <div ref={hotspotRefs[1]} className="absolute top-[45%] left-[10%] pointer-events-auto">
          <MobileHotspot title="Residences" subtitle="5th Floor" position="left" description="Magnificent residences at 8,000+ sft each." />
        </div>
        <div ref={hotspotRefs[2]} className="absolute bottom-[25%] right-[15%] pointer-events-auto">
          <MobileHotspot title="Clubhouse" subtitle="G-4th Floor" position="right" description="A spectacular Clubhouse for a privileged few." />
        </div>
        <div ref={hotspotRefs[3]} className="absolute bottom-[10%] left-[15%] pointer-events-auto">
          <MobileHotspot title="Podium" subtitle="Ground" position="left" description="Discover mesmerizing terrains and unique amenities." />
        </div>
      </div>
    </section>
  );
}

export default RevealZoomMobile;
