'use client';

import { useEffect, useRef, useState, useCallback, useId } from 'react';
import Script from 'next/script';
import { cn, loadImageAsDataUrl } from '@/lib/utils';
import { defaultHotspots, DEFAULT_ROTATION_DURATION, HOTSPOT_PITCH } from '@/lib/hotspots';
import { getIconSvg } from '@/lib/icons';
import type { PanoramaViewerProps, PannellumViewer, HotspotData } from '@/types/panorama';
import './panorama-viewer.css';

export function PanoramaViewer({
  panoramaUrl,
  masterPlanUrl,
  preloaderGifUrl,
  label = '200M.JPG',
  hotspots = defaultHotspots,
  autoRotate = true,
  rotationDuration = DEFAULT_ROTATION_DURATION,
  initialPitch = -90,
  initialYaw = -35,
  initialHfov = 95,
  className,
}: PanoramaViewerProps) {
  const uniqueId = useId();
  const containerId = `panorama-container-${uniqueId.replace(/:/g, '')}`;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const autoSeqTokenRef = useRef<{ cancel: boolean }>({ cancel: false });
  const pitchMonitorRef = useRef<number | null>(null);
  const rotatingRef = useRef<boolean>(false);
  const isZoomingRef = useRef<boolean>(false);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setPreloaderVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const stopAutoRotation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    autoSeqTokenRef.current.cancel = true;
    rotatingRef.current = false;
    setIsRotating(false);
  }, []);

  const startAutoRotation = useCallback(() => {
    if (!viewerRef.current || rotatingRef.current || isZoomingRef.current) return;

    rotatingRef.current = true;
    setIsRotating(true);
    autoSeqTokenRef.current = { cancel: false };

    const startYaw = viewerRef.current.getYaw();
    const startTime = Date.now();

    const animate = () => {
      if (!viewerRef.current || autoSeqTokenRef.current.cancel || isZoomingRef.current) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % rotationDuration) / rotationDuration;
      const currentYaw = startYaw + progress * 360;

      viewerRef.current.setYaw(currentYaw % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [rotationDuration]);

  const handleUserInteraction = useCallback(() => {
    stopAutoRotation();
  }, [stopAutoRotation]);

  // Debounced zoom handler to prevent glitches
  const handleZoom = useCallback((delta: number) => {
    if (!viewerRef.current || isZoomingRef.current) return;
    
    isZoomingRef.current = true;
    
    // Clear any pending zoom timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    const currentHfov = viewerRef.current.getHfov();
    const minHfov = 50;
    const maxHfov = 120;
    const zoomStep = 5;
    
    let newHfov = currentHfov + (delta > 0 ? zoomStep : -zoomStep);
    newHfov = Math.max(minHfov, Math.min(maxHfov, newHfov));
    
    // Set new zoom level
    viewerRef.current.setHfov(newHfov);
    
    // Reset zooming flag after a short delay
    zoomTimeoutRef.current = setTimeout(() => {
      isZoomingRef.current = false;
    }, 150);
  }, []);

  const createHotspotTooltip = useCallback((hs: HotspotData) => {
    return (div: HTMLDivElement) => {
      div.classList.add('label-hotspot');
      if (hs.id) div.id = hs.id;
      if (hs.highlight) div.classList.add('highlight');

      const iconContainer = document.createElement('div');
      iconContainer.className = 'hotspot-icon';
      iconContainer.innerHTML = getIconSvg(hs.icon);
      div.appendChild(iconContainer);

      const connector = document.createElement('div');
      connector.className = 'hotspot-connector';
      div.appendChild(connector);

      const text = document.createElement('div');
      text.className = 'label-hotspot-text';
      text.innerHTML = `<p>${hs.title}</p><small>${hs.distance}</small>`;
      div.appendChild(text);

      const dot = document.createElement('div');
      dot.className = 'hotspot-dot';
      div.appendChild(dot);

      if (hs.link) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation();
          window.open(hs.link, '_blank');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !containerRef.current) return;

    let mounted = true;
    let panoramaObjectUrl: string | null = null;

    const initViewer = async () => {
      try {
        if (!window.pannellum) {
          await new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
              if (window.pannellum) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);
          });
        }

        if (!mounted) return;

        let panoramaDataUrl: string;
        try {
          const abs = new URL(panoramaUrl, location.href).toString();
          try {
            const resp = await fetch(abs, { credentials: 'include' });
            if (resp.ok) {
              const ct = resp.headers.get('content-type') || '';
              if (ct.startsWith('image/')) {
                const blob = await resp.blob();
                panoramaObjectUrl = URL.createObjectURL(blob);
                panoramaDataUrl = panoramaObjectUrl;
              } else {
                panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
              }
            } else {
              panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
            }
          } catch (fetchErr) {
            try {
              const proxyUrl = `/api/static-proxy?path=${encodeURIComponent(panoramaUrl)}`;
              const pr = await fetch(proxyUrl, { credentials: 'include' });
              if (pr.ok) {
                const blob = await pr.blob();
                panoramaObjectUrl = URL.createObjectURL(blob);
                panoramaDataUrl = panoramaObjectUrl;
              } else {
                panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
              }
            } catch (proxyErr) {
              panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
            }
          }
        } catch (urlErr) {
          panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
        }

        if (!mounted) return;

        if (panoramaDataUrl === panoramaUrl) {
          try {
            const proxyUrl = `/api/static-proxy?path=${encodeURIComponent(panoramaUrl)}`;
            const pr = await fetch(proxyUrl, { credentials: 'include' });
            if (pr.ok) {
              const blob = await pr.blob();
              if (panoramaObjectUrl) {
                URL.revokeObjectURL(panoramaObjectUrl);
              }
              panoramaObjectUrl = URL.createObjectURL(blob);
              panoramaDataUrl = panoramaObjectUrl;
            }
          } catch (proxyErr) {
            // ignore
          }
        }

        const hotspotConfigs = hotspots.map((hs) => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: 'label-hotspot',
          createTooltipFunc: createHotspotTooltip(hs),
        }));

        if (masterPlanUrl) {
          hotspotConfigs.unshift({
            pitch: -90,
            yaw: 0,
            cssClass: 'master-plan-hotspot',
            createTooltipFunc: (div: HTMLDivElement) => {
              div.classList.add('master-plan-hotspot');
              div.setAttribute('data-rotation-sync', 'true');

              const img = document.createElement('img');
              img.src = masterPlanUrl;
              img.style.maxWidth = '700px';
              img.style.width = 'auto';
              img.style.height = 'auto';
              img.style.pointerEvents = 'none';
              img.style.marginLeft = '25px';
              img.style.transition = 'transform 0.05s linear';
              img.setAttribute('data-master-plan-img', 'true');
              div.appendChild(img);
            },
          });
        }

        let crossOriginSetting: string | undefined;
        try {
          const check = new URL(panoramaDataUrl, location.href);
          if (check.origin !== location.origin && !panoramaDataUrl.startsWith('data:') && !panoramaDataUrl.startsWith('blob:')) {
            crossOriginSetting = 'anonymous';
          }
        } catch (e) {
          // ignore
        }

        const viewerConfig: any = {
          type: 'equirectangular',
          panorama: panoramaDataUrl,
          pitch: initialPitch,
          yaw: initialYaw,
          hfov: initialHfov,
          minHfov: 50,
          maxHfov: 120,
          autoLoad: true,
          showControls: false, // Hide default controls, we'll use custom
          compass: true,
          friction: 0.15,
          draggable: true,
          mouseZoom: false, // Disable default zoom, use custom handler
          doubleClickZoom: false,
          vaov: 180,
          haov: 360,
          backgroundColor: [0, 0, 0],
          dynamicUpdate: true,
          autoRotate: 0,
          autoRotateInactivityDelay: -1,
          autoRotateStopDelay: -1,
          orientationOnByDefault: false,
          showZoomCtrl: false,
          hotSpots: hotspotConfigs,
        };

        if (crossOriginSetting) viewerConfig.crossOrigin = crossOriginSetting;

        viewerRef.current = window.pannellum.viewer(containerId, viewerConfig);

        viewerRef.current.on('load', () => {
          if (!viewerRef.current || !mounted) return;

          viewerRef.current.setPitch(initialPitch);
          viewerRef.current.setYaw(initialYaw);
          viewerRef.current.setHfov(initialHfov);

          setIsLoading(false);

          const monitorPitch = () => {
            if (!viewerRef.current || !mounted) return;

            const yaw = viewerRef.current.getYaw();
            const hfov = viewerRef.current.getHfov();

            const masterPlanImg = document.querySelector(
              '[data-master-plan-img="true"]'
            ) as HTMLImageElement | null;

            if (masterPlanImg) {
              const baseHfov = 95;
              const scale = baseHfov / hfov;
              masterPlanImg.style.transform = `rotate(${-yaw}deg) scale(${scale})`;
            }

            pitchMonitorRef.current = requestAnimationFrame(monitorPitch);
          };

          monitorPitch();

          if (autoRotate) {
            setTimeout(() => {
              if (!viewerRef.current || autoSeqTokenRef.current.cancel || !mounted) return;

              viewerRef.current.lookAt(HOTSPOT_PITCH, initialYaw, initialHfov, 2000);

              setTimeout(() => {
                if (!autoSeqTokenRef.current.cancel && mounted) {
                  startAutoRotation();
                }
              }, 2500);
            }, 3000);
          }
        });

        viewerRef.current.on('error', (msg: unknown) => {
          console.error('Pannellum viewer error:', msg);
        });
      } catch (error) {
        console.error('Failed to initialize panorama viewer:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initViewer();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pitchMonitorRef.current) {
        cancelAnimationFrame(pitchMonitorRef.current);
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {}
      }

      if (panoramaObjectUrl) {
        try {
          URL.revokeObjectURL(panoramaObjectUrl);
        } catch (e) {}
        panoramaObjectUrl = null;
      }
    };
  }, [scriptsLoaded, panoramaUrl, masterPlanUrl, hotspots, autoRotate, initialPitch, initialYaw, initialHfov, containerId, createHotspotTooltip, startAutoRotation]);

  // Custom wheel handler for smooth zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleUserInteraction();
      handleZoom(e.deltaY);
    };

    container.addEventListener('mousedown', handleUserInteraction);
    container.addEventListener('touchstart', handleUserInteraction);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleUserInteraction, handleZoom]);

  // Zoom in/out button handlers
  const handleZoomIn = useCallback(() => {
    handleZoom(-1);
  }, [handleZoom]);

  const handleZoomOut = useCallback(() => {
    handleZoom(1);
  }, [handleZoom]);

  return (
    <div className={cn('relative w-full h-full', className)}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

      {preloaderVisible && (
        <div
          className={cn(
            'fixed inset-0 z-100001 flex items-center justify-center',
            'bg-[#0b1220] transition-all duration-400 ease-out',
            'text-[#e5eef8]',
            !isLoading && 'opacity-0 invisible pointer-events-none'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            {preloaderGifUrl ? (
              <img
                src={preloaderGifUrl}
                alt="Loading…"
                className="w-50 h-auto"
              />
            ) : (
              <div className="w-50 h-50 flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 panorama-preloader-spinner" />
                  <div className="absolute inset-2 rounded-full border-2 border-emerald-400/20 border-b-emerald-400 panorama-preloader-spinner-slow" />
                </div>
              </div>
            )}
            <div
              className={cn(
                'text-[#cfd8dc] text-[15px] text-center max-w-90 px-3 leading-tight',
                'transition-all duration-600 ease-out',
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              )}
            >
              Relax — bring a cup of coffee and enjoy the view.
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          'w-full h-full relative z-1 bg-[#0b1220]',
          'transition-opacity duration-500 ease-out',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div id={containerId} className="w-full h-full" />

        {/* Label Badge - Top Left */}
        <div 
          className="absolute top-4 left-4 z-20"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-white/60 text-xs" style={{ fontFamily: 'Migra, sans-serif' }}>
            Viewing: <strong className="text-white font-medium">{label}</strong>
          </span>
        </div>

        {/* Control Panel - Bottom Left */}
        <div 
          className="fixed bottom-4 left-4 z-[12010] flex items-center gap-1"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Play Button */}
          <button
            onClick={() => !isRotating && startAutoRotation()}
            className={cn(
              'flex items-center justify-center',
              'w-8 h-8 rounded-lg',
              'transition-all duration-200 ease-out',
              'hover:bg-white/10',
              'active:scale-95',
              isRotating ? 'text-white/40' : 'text-white'
            )}
            title="Auto rotate"
            aria-label="Start rotation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </button>

          {/* Pause Button */}
          <button
            onClick={stopAutoRotation}
            className={cn(
              'flex items-center justify-center',
              'w-8 h-8 rounded-lg',
              'transition-all duration-200 ease-out',
              'hover:bg-white/10',
              'active:scale-95',
              !isRotating ? 'text-white/40' : 'text-white'
            )}
            title="Stop rotation"
            aria-label="Stop rotation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className={cn(
              'flex items-center justify-center',
              'w-8 h-8 rounded-lg',
              'text-white',
              'transition-all duration-200 ease-out',
              'hover:bg-white/10',
              'active:scale-95'
            )}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className={cn(
              'flex items-center justify-center',
              'w-8 h-8 rounded-lg',
              'text-white',
              'transition-all duration-200 ease-out',
              'hover:bg-white/10',
              'active:scale-95'
            )}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PanoramaViewer;
