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
  const frameObj = useRef({ frame: 0 });
  const lastFrameRef = useRef<number | null>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || imagesRef.current.length === 0) return;

      const frameIndex = Math.round(frameObj.current.frame);
      const img = imagesRef.current[frameIndex];
      if (!img) return;

      if (lastFrameRef.current !== frameIndex) {
        lastFrameRef.current = frameIndex;
        console.log('Mirai_Grace render frame', frameIndex);
      }

      if (debugRef.current) {
        debugRef.current.textContent = `frame:${frameIndex}`;
      }

      const dpr = window.devicePixelRatio || 1;
      const vw = canvas.width / dpr;
      const vh = canvas.height / dpr;

      const sw = (img as any).naturalWidth || (img as any).width || 0;
      const sh = (img as any).naturalHeight || (img as any).height || 0;

      const scale = Math.max(vw / sw, vh / sh);
      const w = sw * scale;
      const h = sh * scale;
      const x = (vw - w) / 2;
      const y = (vh - h) / 2;

      ctx.clearRect(0, 0, vw, vh);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, vw, vh);
      ctx.drawImage(img as CanvasImageSource, x, y, w, h);
    };

    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const initGSAP = () => {
      const canvas = canvasRef.current;
      if (!canvas || !sectionRef.current) return;

      setCanvasSize();

      // Reset frame
      frameObj.current.frame = 0;

      // Single ScrollTrigger with timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (debugRef.current) {
              debugRef.current.textContent = `frame:${Math.round(frameObj.current.frame)} progress:${self.progress.toFixed(2)}`;
            }
          },
        },
      });

      tl.to(frameObj.current, {
        frame: imagesRef.current.length - 1,
        ease: 'none',
        onUpdate: render,
      });

      // Initial render
      render();

      // Refresh after a tick to ensure DOM is ready
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      console.log('Mirai_Grace GSAP init', imagesRef.current.length);
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
            } catch {
              images.push(loadedImage);
            }
            break;
          }
        }

        if (images.length === 0) throw new Error('No images loaded');

        imagesRef.current = images;
        setLoading(false);
        console.log('Mirai_Grace loaded', images.length);
        
        initGSAP();
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadImages();

    const handleResize = () => {
      setCanvasSize();
      ScrollTrigger.refresh();
      // Re-render current frame
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && imagesRef.current.length > 0) {
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
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
    <div ref={sectionRef} className="relative h-screen w-full">
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
        className="pointer-events-none fixed right-4 top-4 z-50 rounded bg-black/80 px-2 py-1 font-mono text-xs text-green-400"
      >
        frame:0
      </div>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}