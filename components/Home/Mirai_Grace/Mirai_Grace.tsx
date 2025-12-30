'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ImageScrollScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameObj = useRef({ frame: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef(1);

  // Memoized render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const images = imagesRef.current;

    if (!canvas || !ctx || images.length === 0) return;

    const frameIndex = Math.min(
      Math.max(0, Math.round(frameObj.current.frame)),
      images.length - 1
    );
    const img = images[frameIndex];
    if (!img || !img.complete) return;

    const dpr = dprRef.current;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Clear entire canvas buffer
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background (use buffer dimensions)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate cover-fit dimensions in display space
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgAspect;
    } else {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgAspect;
    }

    drawX = (displayWidth - drawWidth) / 2;
    drawY = (displayHeight - drawHeight) / 2;

    // Draw image scaled by DPR
    ctx.drawImage(
      img,
      drawX * dpr,
      drawY * dpr,
      drawWidth * dpr,
      drawHeight * dpr
    );
  }, []);

  // Setup canvas with proper DPR handling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Set buffer size
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Set display size
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Get fresh context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      contextRef.current = ctx;
    }

    render();
  }, [render]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const images: HTMLImageElement[] = [];
        const totalImages = 5;
        
        // IMPORTANT: Check exact case of folder name on Vercel!
        // Vercel (Linux) is case-sensitive unlike Windows/Mac
        const exts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

        for (let i = 1; i <= totalImages; i++) {
          let loaded = false;

          for (const ext of exts) {
            const imagePath = `/components/Home/Mirai_Grace/${i}${ext}`;
            
            try {
              const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error(`Failed to load ${imagePath}`));
                image.src = imagePath;
              });
              
              images.push(img);
              loaded = true;
              setLoadedCount(images.length);
              console.log(`Loaded: ${imagePath}`);
              break;
            } catch {
              continue;
            }
          }

          if (!loaded) {
            console.warn(`Could not load image ${i} with any extension`);
          }
        }

        if (images.length === 0) {
          throw new Error(
            'No images loaded. Check: 1) File paths are case-sensitive on Vercel, ' +
            '2) Files exist in /public/components/Home/Mirai_Grace/'
          );
        }

        imagesRef.current = images;
        console.log(`Successfully loaded ${images.length} images`);
        setLoading(false);

        // Setup canvas and GSAP after images are loaded
        setupCanvas();
        initGSAP();

      } catch (err) {
        console.error('Image loading error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading images');
        setLoading(false);
      }
    };

    const initGSAP = () => {
      const section = sectionRef.current;
      if (!section || imagesRef.current.length === 0) return;

      ScrollTrigger.getAll().forEach(t => t.kill());
      frameObj.current.frame = 0;

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: render,
        },
      }).to(frameObj.current, {
        frame: imagesRef.current.length - 1,
        ease: 'none',
        snap: 'frame',
      });

      render();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };

    loadImages();

    const handleResize = () => {
      setupCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [render, setupCanvas]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: '100vh' }}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
          <div className="text-white text-lg">Loading images...</div>
          <div className="text-white/60 text-sm mt-2">{loadedCount} loaded</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-900/50">
          <div className="text-white text-lg p-4 text-center max-w-md">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </section>
  );
}