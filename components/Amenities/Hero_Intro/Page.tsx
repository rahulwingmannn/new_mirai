'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedElementProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ delay = 0, children, className = '', style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
        } else {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsVisible(false);
        }
      },
      { 
        rootMargin: '0px 0px -12% 0px', 
        threshold: 0 
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-[0.99]'
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default function MiraiAmenities() {
  const headingBase: React.CSSProperties = {
    letterSpacing: '4px',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    unicodeBidi: 'isolate',
    marginBlock: '.83em',
    marginInline: 0,
    display: 'block',
    fontSize: '64px',
    fontWeight: 500,
    fontFamily: 'Migra, serif',
    color: '#78252f'
  };

  return (
    <section className="relative py-8 lg:py-16 bg-white overflow-hidden min-h-screen flex items-center">
      <div className="container max-w-[1100px] mx-auto px-4 lg:px-6 relative z-10 w-full">
        <div className="text-center">
          <AnimatedElement delay={0} className="mb-6">
            <h1 style={headingBase}>
              Limitless Indulgence<br />For the Limited Few
            </h1>
          </AnimatedElement>

          <AnimatedElement delay={150} className="w-full mx-auto" style={{ marginTop: '30px' }}>
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'Century Gothic, system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              Experience leisure in every corner at Mirai with 2,00,000 sq. ft. amenities curated just for you.
            </p>
            
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'Century Gothic, system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              From the podium to the element pods & the gigantic Clubhouse, Mirai has everything you desire to beat moments of monotony and transform them into core memories.
            </p>
            
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'Century Gothic, system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              The Podium-level amenities comprise varied landscapes and lush gardens to keep you rooted to nature. The lavish Clubhouse spread across 1,01,415 host a myriad of amenities spread across 4 dynamic levels. The Pods on the terrace are an extension of space where one can truly connect and feel one with the different elements that birthed Mirai.
            </p>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}
