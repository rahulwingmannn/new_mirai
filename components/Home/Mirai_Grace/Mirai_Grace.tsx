'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollVideoComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const imagesRef = useRef<(HTMLImageElement | ImageBitmap)[]>([]);
  const currentFrameRef = useRef(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) return;

    // Create GSAP context for proper cleanup
    contextRef.current = gsap.context(() => {}, container);

    const render = (frame?: number) => {
      const ctx = canvas.getContext('2d');
      const images = imagesRef.current;
      
      if (!ctx || images.length === 0) return;

      const frameIndex = Math.max(0, Math.min(
        Math.round(frame ?? currentFrameRef.current),
        images.length - 1
      ));
      
      const img = images[frameIndex];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      // Get image dimensions
      const imgWidth = 'naturalWidth' in img ? img.naturalWidth : img.width;
      const imgHeight = 'naturalHeight' in img ? img.naturalHeight : img.height;

      // Cover scaling
      const scale = Math.max(displayWidth / imgWidth, displayHeight / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const x = (displayWidth - scaledWidth) / 2;
      const y = (displayHeight - scaledHeight) / 2;

      // Clear and draw
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    };

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    const loadImages = async (): Promise<number> => {
      setLoading(true);
      setError(null);
      
      const images: (HTMLImageElement | ImageBitmap)[] = [];
      const totalImages = 5;
      const extensions = ['gif', 'png', 'jpg', 'jpeg', 'webp'];

      for (let i = 1; i <= totalImages; i++) {
        let loaded = false;
        
        for (const ext of extensions) {
          if (loaded) break;
          
          // Adjust these paths to match your actual image locations
          const paths = [
            `/components/Home/Mirai_Grace/${i}.${ext}`,
            `/images/Mirai_Grace/${i}.${ext}`,
            `/Mirai_Grace/${i}.${ext}`,
          ];
          
          for (const imagePath of paths) {
            if (loaded) break;
            
            try {
              const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = () => reject();
                image.src = imagePath;
              });

              // Create ImageBitmap to freeze GIFs
              try {
                const bitmap = await createImageBitmap(img);
                images.push(bitmap);
              } catch {
                images.push(img);
              }
              
              loaded = true;
              console.log(`✓ Loaded: ${imagePath}`);
            } catch {
              // Try next path
            }
          }
        }
      }

      // If no images found, create placeholder frames for testing
      if (images.length === 0) {
        console.warn('No images found, creating test placeholders');
        for (let i = 0; i < 5; i++) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 1920;
          tempCanvas.height = 1080;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
            gradient.addColorStop(0, `hsl(${i * 72}, 60%, 20%)`);
            gradient.addColorStop(1, `hsl(${i * 72 + 36}, 60%, 40%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1920, 1080);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 200px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${i + 1}`, 960, 500);
            ctx.font = '40px Arial';
            ctx.fillText('Mirai Grace - Scroll to animate', 960, 650);
          }
          const bitmap = await createImageBitmap(tempCanvas);
          images.push(bitmap);
        }
      }

      imagesRef.current = images;
      setLoading(false);
      console.log(`Loaded ${images.length} frames`);
      return images.length;
    };

    const initScrollTrigger = (frameCount: number) => {
      if (!container || frameCount === 0) return;

      // Kill existing
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      setupCanvas();
      
      // Reset frame
      currentFrameRef.current = 0;

      contextRef.current?.add(() => {
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          // Unique ID prevents conflicts with other ScrollTriggers
          id: 'mirai-grace-scrubber',
          onUpdate: (self) => {
            currentFrameRef.current = self.progress * (frameCount - 1);
            render(currentFrameRef.current);
          },
          onRefresh: () => {
            // Re-render on refresh to ensure canvas is up to date
            render(currentFrameRef.current);
          },
        });
      });

      // Initial render
      render(0);
    };

    // Main initialization with delay to let other ScrollTriggers initialize first
    const init = async () => {
      const frameCount = await loadImages();
      
      // CRITICAL: Wait for other ScrollTriggers to initialize
      // This delay ensures RevealZoom (above) has finished setting up
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use RAF to ensure we're in the render cycle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initScrollTrigger(frameCount);
          
          // Refresh all ScrollTriggers to recalculate positions
          // This is essential when there are multiple pinned sections
          ScrollTrigger.refresh(true);
        });
      });
    };

    init();

    // Handle resize
    const handleResize = () => {
      setupCanvas();
      render(currentFrameRef.current);
      // Debounced refresh
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      contextRef.current?.revert();
      
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      
      // Clean up ImageBitmaps
      imagesRef.current.forEach((img) => {
        if ('close' in img && typeof img.close === 'function') {
          try { img.close(); } catch {}
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen"
      style={{ 
        backgroundColor: '#000',
        // Create isolated stacking context
        isolation: 'isolate',
      }}
    >
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-20">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading Mirai Grace...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/90 text-white z-20">
          <p>{error}</p>
        </div>
      )}
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}