"use client"

import React, { useEffect, useRef, useState } from 'react'

const bgPath = '/images/sixth_ment.png'

export default function SixthElement() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress: 
      // 0 = bottom of element enters screen
      // 1 = top of element leaves screen
      const start = windowHeight
      const end = -rect.height
      const current = rect.top
      
      const progress = Math.max(0, Math.min(1, (start - current) / (start - end)))
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Maps global progress to local element timing
  const getScrollStyle = (start: number, end: number): React.CSSProperties => {
    const localProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)))

    return {
      opacity: localProgress,
      // Moves text from 60px down up to its natural position (0px)
      transform: `translateY(${(1 - localProgress) * 60}px)`,
      // Micro-transition prevents "jagged" movement on low-precision mouse wheels
      transition: 'opacity 0.15s linear, transform 0.15s ease-out',
    } as React.CSSProperties
  }

  // Computed styles for headings — preserve scroll-driven opacity but scale it by 0.95
  const h1Scroll: React.CSSProperties = getScrollStyle(0.15, 0.35)
  const h2Scroll: React.CSSProperties = getScrollStyle(0.25, 0.45)

  const headingBase: React.CSSProperties = {
    letterSpacing: '4px',
    textRendering: 'optimizeLegibility' as any,
    WebkitFontSmoothing: 'antialiased' as any,
    unicodeBidi: 'isolate' as any,
    marginBlock: '.83em',
    marginInline: 0,
    display: 'block',
    fontSize: '48px',
    fontWeight: 250,
  }

  const h1Style: React.CSSProperties = { ...h1Scroll, ...headingBase, opacity: ((h1Scroll.opacity as number) || 0) * 0.95, fontFamily: 'Migra, sans-serif', color: '#78252f' }
  const h2Style: React.CSSProperties = { ...h2Scroll, ...headingBase, opacity: ((h2Scroll.opacity as number) || 0) * 0.95, fontFamily: 'Migra, sans-serif', color: '#78252f' }

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full overflow-hidden"
      style={{ 
        backgroundColor: 'transparent',
        zIndex: 10, 
        position: 'relative' 
      }}
    >
      {/* Background Image: Always opaque to prevent flickering */}
      <img
        src={bgPath}
        alt="Pavani Mirai Background"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: 1, 
          willChange: 'transform',
        }}
      />

      {/* Text Overlay: Content linked to the scroller position */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-5xl px-6 text-center text-black" style={{ marginTop: '10%' }}>
          
          {/* Welcome Header: Appears between 15% and 35% of the scroll */}
          <h1 
            className="tracking-[0.3em] mb-1 md:mb-2 text-black"
            style={h1Style}
          >
            Welcome to Pavani Mirai
          </h1>

          {/* Main Title: Appears between 25% and 45% of the scroll */}
          <h2 
            className="leading-tight mb-6 md:mb-10 text-black"
            style={h2Style}
          >
            Where you Live the <span>Sixth Element</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {/* Paragraph 1: Appears between 35% and 55% of the scroll */}
            <p 
              className="leading-relaxed text-black"
              style={{ ...getScrollStyle(0.35, 0.55), fontSize: '20px', fontWeight: 400 }}
            >
              Nature crafted five elements — Earth that grounds us. 
              Water that nourishes us. 
              Fire that warms us. 
              Air that breathes through us. 
              Space that holds us.
            </p>
            
            {/* Paragraph 2: Appears between 45% and 65% of the scroll */}
            <p 
              className="hidden md:block leading-relaxed text-black"
              style={{ ...getScrollStyle(0.45, 0.65), fontSize: '20px', fontWeight: 400 }}
            >
              With Pavani as the catalyst, the sixth element takes shape when all the elements are brought together in serene harmony. 
              This is how Mirai was birthed — to give meaning to all of these elements and to harness their full potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
