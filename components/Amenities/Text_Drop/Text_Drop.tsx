'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

export default function MiraiAmenitiesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number | null>(null);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    // Even slower interpolation for ultra smooth feel
    const smoothFactor = 0.04;
    
    currentProgress.current = lerp(currentProgress.current, targetProgress.current, smoothFactor);
    setSmoothProgress(currentProgress.current);
    
    if (Math.abs(currentProgress.current - targetProgress.current) > 0.0001) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      rafId.current = null;
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Extended scroll range for slower animation
      // Start when section top reaches 30% from top
      // End when section top is 50% above viewport (more scroll needed)
      const startPoint = windowHeight * 0.30;
      const endPoint = windowHeight * -0.50;
      
      const totalDistance = startPoint - endPoint;
      const currentPosition = startPoint - rect.top;
      
      let progress = currentPosition / totalDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      targetProgress.current = progress;
      
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animate]);

  // Slower, more gradual text progression
  const getTextProgress = (index: number) => {
    if (index === 0) return 1;
    
    // More spread out timing - each line takes longer
    const staggerOffset = 0.25; // 25% offset between each line
    const animationDuration = 0.50; // Each line takes 50% of scroll
    
    const lineStart = (index - 1) * staggerOffset;
    const lineEnd = lineStart + animationDuration;
    
    if (smoothProgress <= lineStart) return 0;
    if (smoothProgress >= lineEnd) return 1;
    
    return (smoothProgress - lineStart) / animationDuration;
  };

  const getImageProgress = (index: number) => {
    const staggerOffset = 0.18;
    const animationDuration = 0.55;
    
    const imageStart = index * staggerOffset;
    const imageEnd = imageStart + animationDuration;
    
    if (smoothProgress <= imageStart) return 0;
    if (smoothProgress >= imageEnd) return 1;
    
    return (smoothProgress - imageStart) / animationDuration;
  };

  // Ultra smooth easing - slower at the end
  const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pb-48 md:pb-64 lg:pb-80 bg-white overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Background Images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Top Left Image */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutSine(getImageProgress(0)) * 0.8,
            transform: `scale(${0.8 + easeOutSine(getImageProgress(0)) * 0.2})`,
          }}
        >
          <img src={textDropLines[0].image} alt={textDropLines[0].text} className="w-full h-full object-cover" />
        </div>

        {/* Center Image */}
        <div
          className="absolute top-[20%] left-[50%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutSine(getImageProgress(1)) * 0.8,
            transform: `translateX(-50%) scale(${0.8 + easeOutSine(getImageProgress(1)) * 0.2})`,
          }}
        >
          <img src={textDropLines[1].image} alt={textDropLines[1].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Right Image */}
        <div
          className="absolute bottom-4 right-[10%] md:bottom-6 md:right-[10%] lg:bottom-8 lg:right-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutSine(getImageProgress(2)) * 0.8,
            transform: `scale(${0.8 + easeOutSine(getImageProgress(2)) * 0.2})`,
          }}
        >
          <img src={textDropLines[2].image} alt={textDropLines[2].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Left Image */}
        <div
          className="absolute bottom-4 left-[10%] md:bottom-6 md:left-[10%] lg:bottom-8 lg:left-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutSine(getImageProgress(3)) * 0.8,
            transform: `scale(${0.8 + easeOutSine(getImageProgress(3)) * 0.2})`,
          }}
        >
          <img src={textDropLines[3].image} alt={textDropLines[3].text} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Big Text */}
      <div 
        className="relative z-10 flex flex-col items-center pt-4 md:pt-6 lg:pt-8 gap-6 md:gap-10 lg:gap-14"
        style={{ perspective: '1200px' }}
      >
        {textDropLines.map((item, idx) => {
          const progress = getTextProgress(idx);
          const easedProgress = easeOutSine(progress);
          
          return (
            <div 
              key={idx}
              className="will-change-transform"
              style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'center top',
                opacity: idx === 0 ? 1 : easedProgress,
                transform: idx === 0 
                  ? 'rotateX(0deg)' 
                  : `rotateX(${-90 + easedProgress * 90}deg)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div
                className="text-[clamp(3.5rem,10vw,8rem)] tracking-[-0.02em] text-[#6B2C3E] leading-[1.1] text-center whitespace-nowrap"
                style={{ fontFamily: 'Migra, serif', fontWeight: 300 }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
