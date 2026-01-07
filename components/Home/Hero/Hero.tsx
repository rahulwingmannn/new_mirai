'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react'
import Image from 'next/image'

const HERO_LOGO = '/images/logo_1.png'
const VIDEO_SRC = 'https://d3p1hokpi6aqc3.cloudfront.net/mirai_home_1.mp4'

const Hero = memo(function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  // Play video on mount
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }
  }, [])

  // Scroll handler with RAF throttling
  useEffect(() => {
    if (typeof window === 'undefined') return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          const scrollHeight = document.documentElement.scrollHeight
          const distanceFromBottom = scrollHeight - (scrollY + windowHeight)

          const pastHeroSection = scrollY >= windowHeight - 5
          const nearBottom = distanceFromBottom < 200

          setIsHidden(pastHeroSection || nearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleVideoReady = useCallback(() => {
    setVideoReady(true)
  }, [])

  // Memoized styles
  const fullScreenMediaStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '101%',
    height: '101%',
    transform: 'translate(-50%, -50%) translateZ(0)',
    objectFit: 'cover',
    display: 'block',
    zIndex: 1,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    willChange: 'transform'
  }), [])

  const videoStyle = useMemo<React.CSSProperties>(() => ({
    ...fullScreenMediaStyle,
    opacity: videoReady ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out'
  }), [fullScreenMediaStyle, videoReady])

  const sectionStyle = useMemo<React.CSSProperties>(() => ({
    zIndex: 5,
    opacity: isHidden ? 0 : 1,
    visibility: isHidden ? 'hidden' : 'visible',
    pointerEvents: isHidden ? 'none' : 'auto'
  }), [isHidden])

  const placeholderStyle = useMemo<React.CSSProperties>(() => ({
    backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
  }), [])

  return (
    <section
      className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black transition-opacity duration-300"
      style={sectionStyle}
    >
      {/* Logo - top center with full-width lines */}
      <div className="absolute top-8 left-0 right-0 z-10 flex items-center px-8">
        <div className="flex-1 h-[1px] bg-white/60" />
        <div className="mx-6">
          <Image
            src={HERO_LOGO}
            alt="Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <div className="flex-1 h-[1px] bg-white/60" />
      </div>

      {/* Loading placeholder - shows while video loads */}
      {!videoReady && (
        <div
          className="absolute inset-0 bg-black z-0"
          style={placeholderStyle}
        />
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={videoStyle}
        onCanPlayThrough={handleVideoReady}
        onLoadedData={handleVideoReady}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
