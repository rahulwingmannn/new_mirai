'use client';

import { useEffect, useRef, useState, TouchEvent } from 'react';
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

const FONT_FAMILY = "Migra, var(--font-magra, 'Magra', 'Century Gothic', Arial, sans-serif)";

export default function MiraiPodsSliderMobile() {
  const [layerAIndex, setLayerAIndex] = useState(0);
  const [layerBIndex, setLayerBIndex] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const frameRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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

    const incomingLayer = activeLayer === 'A' ? layerBRef.current : layerARef.current;
    const outgoingLayer = activeLayer === 'A' ? layerARef.current : layerBRef.current;

    if (!incomingLayer || !outgoingLayer) return;

    setIsAnimating(true);
    setShowContent(false);

    if (activeLayer === 'A') {
      setLayerBIndex(nextIndex);
    } else {
      setLayerAIndex(nextIndex);
    }

    // Simple fade/slide transition for mobile
    gsap.set(incomingLayer, {
      zIndex: 10,
      x: '100%',
      opacity: 1,
    });

    gsap.to(outgoingLayer, {
      x: '-30%',
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    gsap.to(incomingLayer, {
      x: '0%',
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        const newActiveLayer = activeLayer === 'A' ? 'B' : 'A';
        setActiveLayer(newActiveLayer);

        gsap.set(outgoingLayer, {
          zIndex: 1,
          x: '0%',
          opacity: 1,
        });

        gsap.set(incomingLayer, {
          zIndex: 5,
        });

        setShowContent(true);
        setIsAnimating(false);
      },
    });
  };

  const goToPrev = () => {
    if (isAnimating || currentIndex === 0) return;

    const incomingLayer = activeLayer === 'A' ? layerBRef.current : layerARef.current;
    const outgoingLayer = activeLayer === 'A' ? layerARef.current : layerBRef.current;

    if (!incomingLayer || !outgoingLayer) return;

    setIsAnimating(true);
    setShowContent(false);

    if (activeLayer === 'A') {
      setLayerBIndex(prevIndex);
    } else {
      setLayerAIndex(prevIndex);
    }

    gsap.set(incomingLayer, {
      zIndex: 10,
      x: '-100%',
      opacity: 1,
    });

    gsap.to(outgoingLayer, {
      x: '30%',
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    gsap.to(incomingLayer, {
      x: '0%',
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        const newActiveLayer = activeLayer === 'A' ? 'B' : 'A';
        setActiveLayer(newActiveLayer);

        gsap.set(outgoingLayer, {
          zIndex: 1,
          x: '0%',
          opacity: 1,
        });

        gsap.set(incomingLayer, {
          zIndex: 5,
        });

        setShowContent(true);
        setIsAnimating(false);
      },
    });
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Autoplay
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 5000); // Slightly longer for mobile

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isAnimating, activeLayer]);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#000',
        fontFamily: FONT_FAMILY,
        touchAction: 'pan-y',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
                'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent)',
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
                'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent)',
            }}
          />
        </div>

        {/* Content - Centered for mobile */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 24,
            right: 24,
            color: '#fff',
            textAlign: 'center',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: showContent ? '0.25s' : '0s',
            zIndex: 20,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 12,
              opacity: 0.85,
            }}
          >
            {slides[currentIndex].label}
          </p>
          <h2
            style={{
              fontSize: 28,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              lineHeight: 1.2,
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

      {/* Navigation Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 30,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating || index === currentIndex) return;
              if (index > currentIndex) {
                if (activeLayer === 'A') {
                  setLayerBIndex(index);
                } else {
                  setLayerAIndex(index);
                }
                goToNext();
              } else {
                if (activeLayer === 'A') {
                  setLayerBIndex(index);
                } else {
                  setLayerAIndex(index);
                }
                goToPrev();
              }
            }}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: index === currentIndex 
                ? 'rgba(255,255,255,0.9)' 
                : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev Button - Smaller for mobile */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.3)',
          color: '#fff',
          fontSize: 20,
          fontFamily: FONT_FAMILY,
          cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          opacity: currentIndex === 0 ? 0.3 : 0.7,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* Next Button - Smaller for mobile */}
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.3)',
          color: '#fff',
          fontSize: 20,
          fontFamily: FONT_FAMILY,
          cursor: 'pointer',
          opacity: 0.7,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Swipe Hint - Shows briefly on first load */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
          fontFamily: FONT_FAMILY,
          textTransform: 'uppercase',
          letterSpacing: 2,
          zIndex: 25,
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        Swipe to explore
      </div>
    </section>
  );
}
