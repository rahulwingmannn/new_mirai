'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ImageScrollScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Store static canvas-friendly image sources (ImageBitmap or HTMLImageElement).
  const imagesRef = useRef<CanvasImageSource[]>([]);
  const frameObj = useRef({ frame: 0 }); // Object for GSAP to animate

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const images: CanvasImageSource[] = [];
        const totalImages = 5;

        for (let i = 1; i <= totalImages; i++) {
          // Prefer GIF frames in the public folder (fallback to svg/png/jpg/webp).
          // We create a static ImageBitmap snapshot on load so animated GIFs don't autonomously play
          // between scroll updates — rendering is triggered by GSAP's onUpdate.
          const exts = ['.gif', '.png', '.jpg', '.webp', '.svg'];
          let loaded = false;
          for (const ext of exts) {
            const imagePath = `/components/Home/Mirai_Grace/${i}${ext}`;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            const loadedImage = await new Promise<HTMLImageElement | null>((resolve) => {
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              img.src = imagePath;
            });
            if (!loadedImage) continue;
            try {
              const bitmap = await createImageBitmap(loadedImage);
              images.push(bitmap);
            } catch (e) {
              // Fallback to using the HTMLImageElement directly if ImageBitmap not available
              images.push(loadedImage);
            }
            loaded = true;
            break;
          }
        }
        if (images.length === 0) throw new Error("No images loaded");
        imagesRef.current = images;
        setLoading(false);
        console.log('Mirai_Grace loaded', images.length);
        initGSAP();

        // Do NOT start a continuous RAF loop; rendering is driven by GSAP onUpdate (scroll)
        // so GIFs won't animate independently when the page is idle.
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || imagesRef.current.length === 0) return;

      const img = imagesRef.current[Math.round(frameObj.current.frame)];
      if (!img) return;

      const vw = canvas.width / (window.devicePixelRatio || 1);
      const vh = canvas.height / (window.devicePixelRatio || 1);
      const sw = ('naturalWidth' in img ? (img as HTMLImageElement).naturalWidth : (img as ImageBitmap).width) || (img as any).width || 0;
      const sh = ('naturalHeight' in img ? (img as HTMLImageElement).naturalHeight : (img as ImageBitmap).height) || (img as any).height || 0;
      const scale = Math.max(vw / sw, vh / sh);
      const w = sw * scale;
      const h = sh * scale;
      const x = (vw - w) / 2;
      const y = (vh - h) / 2;

      ctx.clearRect(0, 0, vw, vh);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, vw, vh);
      ctx.drawImage(img as any, x, y, w, h);
    };

    const initGSAP = () => {
      const canvas = canvasRef.current;
      if (!canvas || !sectionRef.current) return;

      // Set canvas size
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.getContext('2d')?.scale(dpr, dpr);

      // Create GSAP Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%", // Scroll length
          pin: true,     // GSAP handles pinning instead of CSS sticky
          scrub: 0.5,    // Smooth transition between frames
          onUpdate: render,
          // Prevent the "black gap" by ensuring the pin remains active
          anticipatePin: 1, 
        }
      });

      // Animate frame property from 0 to last index
      tl.to(frameObj.current, {
        frame: imagesRef.current.length - 1,
        snap: "frame", // Optional: snap to whole numbers
        ease: "none",
        onUpdate: render
      });

      // Initial render
      render();
    };

    loadImages();

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.getContext('2d')?.scale(dpr, dpr);
      render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', handleResize);
      // Close any ImageBitmaps to free memory
      imagesRef.current.forEach((img) => {
        if ((img as ImageBitmap)?.close) {
          try { (img as ImageBitmap).close(); } catch {}
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* GSAP will "pin" this entire section */}
      <div ref={sectionRef} className="relative w-full h-screen bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Canvas forced to stay inside viewport */}
        <canvas 
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />
      </div>
      
      {/* Spacer below to ensure content follows correctly after unpinning */}
      <div className="h-px bg-black" />
    </div>
  );
}