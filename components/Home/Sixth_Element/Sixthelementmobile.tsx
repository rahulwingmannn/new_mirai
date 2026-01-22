"use client"

import React, { useEffect, useRef, useState } from 'react'

const bgPath = '/images/sixth_ment_mobile.png'

export default function SixthElementMobile() {
  const sectionRef = useRef<HTMLDivElement>(null)
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
      transform: `translateY(${(1 - localProgress) * 40}px)`,
      transition: 'opacity 0.15s linear, transform 0.15s ease-out',
    }
  }

  const h1Scroll = getScrollStyle(0.15, 0.35)
  const h2Scroll = getScrollStyle(0.25, 0.45)

  const headingBase: React.CSSProperties = {
    letterSpacing: '2px',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    marginBlock: '.5em',
    marginInline: 0,
    display: 'block',
    fontSize: '28px',
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
    fontSize: '24px'
  }

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '200vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Background Image - Now covers full section */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <img
          src={bgPath}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            zIndex: 1,
          }}
        />
      </div>

      {/* Text Overlay - Mobile optimized with more vertical space */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '80px 24px 60px',
          zIndex: 2,
          textAlign: 'center',
          gap: '32px',
        }}
      >
        {/* Welcome Header */}
        <div
          style={{
            ...getScrollStyle(0.05, 0.25),
            fontSize: '16px',
            fontWeight: 300,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'Migra, sans-serif',
            color: '#78252f',
            opacity: ((getScrollStyle(0.05, 0.25).opacity as number) || 0) * 0.85,
          }}
        >
          Welcome to Pavani Mirai
        </div>

        {/* Main Title */}
        <h1 style={h1Style}>
          Where you Live the Sixth Element
        </h1>

        {/* Paragraph 1 */}
        <p
          style={{
            ...getScrollStyle(0.35, 0.55),
            fontSize: '16px',
            lineHeight: '1.8',
            maxWidth: '90%',
            fontFamily: 'Migra, sans-serif',
            color: '#78252f',
            opacity: ((getScrollStyle(0.35, 0.55).opacity as number) || 0) * 0.9,
            fontWeight: 300,
            margin: 0,
          }}
        >
          Nature crafted five elements — Earth that grounds us. Water that nourishes us. Fire that warms us. Air that breathes through us. Space that holds us.
        </p>

        {/* Paragraph 2 */}
        <p
          style={{
            ...getScrollStyle(0.45, 0.65),
            fontSize: '16px',
            lineHeight: '1.8',
            maxWidth: '90%',
            fontFamily: 'Migra, sans-serif',
            color: '#78252f',
            opacity: ((getScrollStyle(0.45, 0.65).opacity as number) || 0) * 0.9,
            fontWeight: 300,
            margin: 0,
          }}
        >
          With Pavani as the catalyst, the sixth element takes shape when all elements unite in serene harmony.
        </p>
      </div>
    </div>
  )
}
