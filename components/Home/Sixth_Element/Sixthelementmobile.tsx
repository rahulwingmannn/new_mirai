"use client"

import React, { useEffect, useRef, useState } from 'react'

const bgPath = '/images/sixth_ment.png'

export default function SixthElementMobile() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      const start = windowHeight
      const end = -rect.height
      const current = rect.top
      
      const progress = Math.max(0, Math.min(1, (start - current) / (start - end)))
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getScrollStyle = (start: number, end: number): React.CSSProperties => {
    const localProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)))

    return {
      opacity: localProgress,
      transform: `translateY(${(1 - localProgress) * 40}px)`, // Reduced movement for mobile
      transition: 'opacity 0.15s linear, transform 0.15s ease-out',
    }
  }

  const h1Scroll = getScrollStyle(0.15, 0.35)
  const h2Scroll = getScrollStyle(0.25, 0.45)

  const headingBase: React.CSSProperties = {
    letterSpacing: '2px', // Reduced for mobile
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    marginBlock: '.5em',
    marginInline: 0,
    display: 'block',
    fontSize: '24px', // Smaller for mobile
    fontWeight: 250,
  }

  const h1Style: React.CSSProperties = { 
    ...h1Scroll, 
    ...headingBase, 
    opacity: ((h1Scroll.opacity as number) || 0) * 0.95, 
    fontFamily: 'Migra, sans-serif', 
    color: '#78252f' 
  }
  
  const h2Style: React.CSSProperties = { 
    ...h2Scroll, 
    ...headingBase, 
    opacity: ((h2Scroll.opacity as number) || 0) * 0.95, 
    fontFamily: 'Migra, sans-serif', 
    color: '#78252f',
    fontSize: '20px' // Even smaller for subtitle
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        zIndex: 10,
        position: 'relative',
        marginBottom: '-1px'
      }}
    >
      {/* Background Image */}
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

      {/* Text Overlay - Mobile optimized */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full px-4 text-center text-black" style={{ marginTop: '5%' }}>
          
          {/* Welcome Header */}
          <h1 
            className="tracking-wider mb-1 text-black"
            style={h1Style}
          >
            Welcome to Pavani Mirai
          </h1>

          {/* Main Title */}
          <h2 
            className="leading-tight mb-4 text-black"
            style={h2Style}
          >
            Where you Live the <span>Sixth Element</span>
          </h2>

          <div className="w-full mx-auto space-y-3 px-2">
            {/* Paragraph 1 - Mobile version */}
            <p 
              className="leading-relaxed text-black"
              style={{ 
                ...getScrollStyle(0.35, 0.55), 
                fontSize: '14px', 
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Nature crafted five elements — Earth that grounds us. 
              Water that nourishes us. 
              Fire that warms us. 
              Air that breathes through us. 
              Space that holds us.
            </p>
            
            {/* Paragraph 2 - Show on mobile too but smaller */}
            <p 
              className="leading-relaxed text-black"
              style={{ 
                ...getScrollStyle(0.45, 0.65), 
                fontSize: '13px', 
                fontWeight: 400,
                lineHeight: 1.5
              }}
            >
              With Pavani as the catalyst, the sixth element takes shape when all elements unite in serene harmony.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
