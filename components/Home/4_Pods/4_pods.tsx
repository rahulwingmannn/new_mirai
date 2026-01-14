'use client';
import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import Image from 'next/image';

interface AnimatedElementProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const AnimatedElement: React.FC<AnimatedElementProps> = memo(({ 
  delay = 0, 
  children, 
  className = '' 
}) => {
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

  const renderChildren = useCallback(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && typeof child.type !== 'string') {
        return React.cloneElement(child as React.ReactElement<any>, { play: isVisible });
      }
      return child;
    });
  }, [children, isVisible]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-[0.99]'
      } ${className}`}
    >
      {renderChildren()}
    </div>
  );
});

AnimatedElement.displayName = 'AnimatedElement';

const BLUR_TEXT_CONTENT = "At 720 Ft, the elements rise and shape themselves into an elevated world of leisure and luxury in perfect harmony - the four sculpted Sky Pods. Each pod here is an ode to the four eternal elements of nature. Beyond them, space unfolds as the fifth, while Pavani Mirai gives rise to the sixth - life itself.";

const MiraiPodsIntro: React.FC = memo(() => {
  return (
    <section className="relative mt-0 lg:-mt-2 py-16 lg:py-32 bg-white overflow-hidden z-20">
      <div className="container max-w-275 mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center lg:px-20">
          <AnimatedElement delay={0} className="mb-6 pt-3">
            <h2 className="text-[48px] leading-[1.05] mb-4 migra-heading pods-heading" style={{ fontFamily: 'var(--font-magra)', fontWeight: 100 }}>
              4 Pods <br />
              Conceptualised by Nature,<br />
              Perfected for your Well-being
            </h2>
          </AnimatedElement>
          <AnimatedElement delay={150} className="max-w-200 mx-auto">
            <p className="text-[#6b6b6b] text-base lg:text-lg leading-relaxed">
              {BLUR_TEXT_CONTENT}
            </p>
          </AnimatedElement>
        </div>
      </div>

      {/* Background shape - lazy loaded decorative image */}
      <div className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute right-[-5%] top-10 w-[55%] opacity-[0.12]">
          <Image
            src="/media/shape-two.png"
            alt=""
            width={760}
            height={600}
            loading="lazy"
            decoding="async"
            className="w-full h-auto drop-shadow-[0_10px_300px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>
    </section>
  );
});

MiraiPodsIntro.displayName = 'MiraiPodsIntro';

export default MiraiPodsIntro;
