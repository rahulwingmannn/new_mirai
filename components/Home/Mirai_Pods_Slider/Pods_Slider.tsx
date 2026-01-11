'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SKY_PODS = '/images/Sky_Pods.png';
const TERRA_IMG = '/images/terra.png';
const AQUA_IMG = '/images/aqua.png';
const AVIA_IMG = '/images/avia.png';
const PYRO_IMG = '/images/pyro.png';
const SHAPE_TWO_PODS = '/images/shape-two-pods.png';
const CLOUD_IMG = '/images/cloud.jpg';

interface Slide {
  id: number;
  image: string;
  label: string;
  title: string;
}

const slides: Slide[] = [
  { id: 0, image: SKY_PODS, label: 'Sky Pods', title: 'An\u00A0Elemental\u00A0Rooftop\nwith Four Sky Pods' },
  { id: 1, image: TERRA_IMG, label: 'Terra Pod', title: 'Here, Stories\nGrow Roots' },
  { id: 2, image: AQUA_IMG, label: 'Aqua Pod', title: 'Where Water\nMeets Wonder' },
  { id: 3, image: PYRO_IMG, label: 'Pyro Pod', title: 'Ignite Your\nPassion' },
  { id: 4, image: AVIA_IMG, label: 'Avia Pod', title: 'Soaring Above\nthe Ordinary' },
  { id: 5, image: CLOUD_IMG, label: 'Space One', title: 'Beyond the Clouds\nInto the Unknown' },
];

// Consistent font family for all text
const FONT_FAMILY = "Migra, var(--font-magra, 'Magra', 'Century Gothic', Arial, sans-serif)";

export default function MiraiPodsSlider() {
  const [layerAIndex, setLayerAIndex] = useState(0);
  const [layerBIndex, setLayerBIndex] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const frameRef = useRef<HTMLDivElement>(null);
  const thumbWrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const getNextIdx = (i: number) => (i + 1) % slides.length;
  const getPrevIdx = (i: number) => (i - 1 + slides.length) % slides.length;

  const currentIndex = activeLayer === 'A' ? layerAIndex : layerBIndex;
  const nextIndex = getNextIdx(currentIndex);
  const prevIndex = getPrevIdx(currentIndex);

  useEffect(() => {
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      gsap.killTweensOf('*');
    };
  }, []);

  const goToNext = () => {
    if (isAnimating) return;

    const thumb = thumbRef.current;
    const thumbWrapper = thumbWrapperRef.current;
    const frame = frameRef.current;
    const incomingLayer = activeLayer === 'A' ? layerBRef.current : layerARef.current;

    if (!thumb || !frame || !thumbWrapper || !incomingLayer) return;

    setIsAnimating(true);
    setShowContent(false);

    if (activeLayer === 'A') {
      setLayerBIndex(nextIndex);
    } else {
      setLayerAIndex(nextIndex);
    }

    const thumbRect = thumb.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    const scaleX = thumbRect.width / frameRect.width;
    const offsetX = thumbRect.left - frameRect.left;
    const offsetY = thumbRect.top - frameRect.top;

    gsap.to(thumbWrapper, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.out',
    });

    gsap.set(incomingLayer, {
      zIndex: 10,
      transformOrigin: 'top left',
      scale: scaleX,
      x: offsetX,
      y: offsetY,
      borderRadius: 8,
    });

    gsap.to(incomingLayer, {
      scale: 1,
      x: 0,
      y: 0,
      borderRadius: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        const newActiveLayer = activeLayer === 'A' ? 'B' : 'A';
        setActiveLayer(newActiveLayer);

        const oldLayer = activeLayer === 'A' ? layerARef.current : layerBRef.current;
        if (oldLayer) {
          gsap.set(oldLayer, {
            zIndex: 1,
            scale: 1,
            x: 0,
            y: 0,
            borderRadius: 0,
          });
        }

        gsap.set(incomingLayer, {
          zIndex: 5,
        });

        gsap.to(thumbWrapper, {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
        });

        setShowContent(true);
        setIsAnimating(false);
      },
    });
  };

  const goToPrev = () => {
    if (isAnimating || currentIndex === 0) return;

    const thumb = thumbRef.current;
    const thumbWrapper = thumbWrapperRef.current;
    const frame = frameRef.current;
    const incomingLayer = activeLayer === 'A' ? layerBRef.current : layerARef.current;

    if (!thumb || !frame || !thumbWrapper || !incomingLayer) return;

    setIsAnimating(true);
    setShowContent(false);

    if (activeLayer === 'A') {
      setLayerBIndex(prevIndex);
    } else {
      setLayerAIndex(prevIndex);
    }

    gsap.to(thumbWrapper, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.out',
    });

    const oldLayer = activeLayer === 'A' ? layerARef.current : layerBRef.current;

    gsap.set(incomingLayer, {
      zIndex: 5,
      scale: 1,
      x: 0,
      y: 0,
      borderRadius: 0,
    });

    if (oldLayer) {
      gsap.set(oldLayer, {
        zIndex: 10,
      });

      gsap.to(oldLayer, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(oldLayer, {
            zIndex: 1,
            opacity: 1,
          });

          const newActiveLayer = activeLayer === 'A' ? 'B' : 'A';
          setActiveLayer(newActiveLayer);

          gsap.to(thumbWrapper, {
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          });

          setShowContent(true);
          setIsAnimating(false);
        },
      });
    }
  };

  // Autoplay
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isAnimating, activeLayer]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, isAnimating, activeLayer]);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Main Frame */}
      <div
        ref={frameRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {/* Layer A */}
        <div
          ref={layerARef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: activeLayer === 'A' ? 5 : 1,
            overflow: 'hidden',
            willChange: 'transform',
          }}
        >
          <img
            src={slides[layerAIndex].image}
            alt={slides[layerAIndex].label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, transparent)',
            }}
          />
        </div>

        {/* Layer B */}
        <div
          ref={layerBRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: activeLayer === 'B' ? 5 : 1,
            overflow: 'hidden',
            willChange: 'transform',
          }}
        >
          <img
            src={slides[layerBIndex].image}
            alt={slides[layerBIndex].label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, transparent)',
            }}
          />
        </div>

        {/* Content - Left side */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 40,
            color: '#fff',
            textAlign: 'left',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: showContent ? '0.25s' : '0s',
            zIndex: 20,
            maxWidth: 400,
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 16,
              opacity: 0.85,
            }}
          >
            {slides[currentIndex].label}
          </p>
          <h2
            style={{
              fontSize: 44,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              lineHeight: 1.15,
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {slides[currentIndex].title}
          </h2>
        </div>
      </div>

      {/* Decorative Shape */}
      <img
        src={SHAPE_TWO_PODS}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />

      {/* Prev Button */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: 24,
          fontFamily: FONT_FAMILY,
          cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          opacity: currentIndex === 0 ? 0.3 : 0.8,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: 24,
          fontFamily: FONT_FAMILY,
          cursor: 'pointer',
          opacity: 0.8,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        ›
      </button>

      {/* Next Thumbnail (Right Side) */}
      <div
        ref={thumbWrapperRef}
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          zIndex: 40,
        }}
      >
        <div
          ref={thumbRef}
          style={{
            width: 180,
            height: 110,
            borderRadius: 8,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          <img
            src={slides[nextIndex].image}
            alt={slides[nextIndex].label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 10,
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: FONT_FAMILY,
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              {slides[nextIndex].label}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 9,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            Up Next
          </span>
        </div>
      </div>
    </section>
  );
}
