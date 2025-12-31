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
  const imagesRef = useRef<CanvasImageSource[]>([]);
  const currentFrameRef = useRef(0);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const render = (frameIndex: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context || imagesRef.current.length === 0) return;

      const clampedFrame = Math.max(0, Math.min(frameIndex, imagesRef.current.length - 1));
      const img = imagesRef.current[clampedFrame];
      if (!img) return;

      currentFrameRef.current = clampedFrame;

      if (debugRef.current) {
        debugRef.current.textContent = `frame: ${clampedFrame}`;
      }

      const dpr = window.devicePixelRatio || 1;
      const vw = canvas.width / dpr;
      const vh = canvas.height / dpr;

      const sw = (img as any).naturalWidth || (img as any).width || 0;
      const sh = (img as any).naturalHeight || (img as any).height || 0;

      if (sw === 0 || sh === 0) return;

      const scale = Math.max(vw / sw, vh / sh);
      const w = sw * scale;
      const h = sh * scale;
      const x = (vw - w) / 2;
      const y = (vh - h) / 2;

      context.clearRect(0, 0, vw, vh);
      context.fillStyle = 'black';
      context.fillRect(0, 0, vw, vh);
      context.drawImage(img as CanvasImageSource, x, y, w, h);
    };

    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (context) {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const initGSAP = () => {
      if (!sectionRef.current || !canvasRef.current) return;

      setCanvasSize();

      // Kill any existing ScrollTriggers first
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // Create GSAP context for cleanup
      ctx = gsap.context(() => {
        const totalFrames = imagesRef.current.length;

        // Use ScrollTrigger directly without timeline
        // This gives us direct control over progress -> frame mapping
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Map scroll progress (0-1) to frame index (0 to totalFrames-1)
            const frameIndex = Math.round(self.progress * (totalFrames - 1));
            
            console.log('Progress:', self.progress.toFixed(3), 'Frame:', frameIndex);
            
            if (debugRef.current) {
              debugRef.current.textContent = `frame: ${frameIndex} | progress: ${(self.progress * 100).toFixed(1)}%`;
            }

            render(frameIndex);
          },
          onRefresh: (self) => {
            // Render frame 0 on refresh/init
            console.log('ScrollTrigger refreshed, progress:', self.progress);
            const frameIndex = Math.round(self.progress * (totalFrames - 1));
            render(frameIndex);
          },
        });
      }, sectionRef);

      // Initial render at frame 0
      render(0);

      // Refresh after DOM is ready
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Re-render frame 0 after refresh
        render(0);
      });

      console.log('GSAP initialized with', imagesRef.current.length, 'frames');
    };

    const loadImages = async () => {
      try {
        setLoading(true);
        const images: CanvasImageSource[] = [];
        const totalImages = 5;

        for (let i = 1; i <= totalImages; i++) {
          const exts = ['.gif', '.png', '.jpg', '.webp', '.svg'];

          for (const ext of exts) {
            const imagePath = `/components/Home/Mirai_Grace/${i}${ext}`;

            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';

              const loadedImage = await new Promise<HTMLImageElement | null>((resolve) => {
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = imagePath;
              });

              if (!loadedImage) continue;

              // Try to create ImageBitmap for better performance
              try {
                const bitmap = await createImageBitmap(loadedImage);
                images.push(bitmap);
              } catch {
                images.push(loadedImage);
              }
              
              console.log(`Loaded image ${i}${ext}`);
              break; // Successfully loaded, move to next image number
            } catch {
              continue; // Try next extension
            }
          }
        }

        if (images.length === 0) {
          throw new Error('No images found');
        }

        imagesRef.current = images;
        setLoading(false);
        console.log('All images loaded:', images.length);

        // Small delay to ensure DOM is ready
        setTimeout(initGSAP, 100);
      } catch (err) {
        console.error('Image loading error:', err);
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadImages();

    const handleResize = () => {
      setCanvasSize();
      render(currentFrameRef.current);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener('resize', handleResize);
      imagesRef.current.forEach((img) => {
        if ((img as ImageBitmap)?.close) {
          try {
            (img as ImageBitmap).close();
          } catch {}
        }
      });
    };
  }, []);

  return (
    <>
      <div ref={sectionRef} className="relative h-screen w-full bg-black">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-white">
            Loading...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900 text-white">
            Error: {error}
          </div>
        )}
        <div
          ref={debugRef}
          className="pointer-events-none fixed right-4 top-4 z-50 rounded bg-black/80 px-3 py-2 font-mono text-sm text-green-400"
        >
          frame: 0
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {/* Content after the pinned section */}
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">
        Content After Scroll Animation
      </div>
    </>
  );
}