'use client'
import React, { useRef, useEffect } from 'react'
import Image from 'next/image'

const HERO_LOGO = '/images/logo_1.png'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const gsapRef = useRef<any>(null)
  const [videoReady, setVideoReady] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [])

  const handleCanPlay = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    Promise.all([import('gsap'), import('gsap/ScrollToPlugin')])
      .then(([gsapModule, scrollModule]) => {
        const gsap = gsapModule.gsap || gsapModule.default || gsapModule
        const ScrollToPlugin = scrollModule.ScrollToPlugin || scrollModule.default || scrollModule

        try {
          gsap.registerPlugin(ScrollToPlugin)
        } catch(e) {}

        gsapRef.current = gsap
      })
  }, [])

  // Hide hero when scrolled near the bottom of the page
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Hide the hero video once the user scrolls past the hero section
      setIsHidden(scrollY >= windowHeight - 5)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fullScreenMediaStyle: React.CSSProperties = {
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
  };

  return (
    <section className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black" style={{ zIndex: 5 }}>
      {/* Logo - top center with full-width lines */}
      <div className="absolute top-8 left-0 right-0 z-10 flex items-center px-8">
        {/* Left line */}
        <div className="flex-1 h-[1px] bg-white/60"></div>
        
        {/* Logo */}
        <div className="mx-6">
          <Image
            src={HERO_LOGO}
            alt="Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        
        {/* Right line */}
        <div className="flex-1 h-[1px] bg-white/60"></div>
      </div>

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          ...fullScreenMediaStyle,
          opacity: isHidden ? 0 : (videoReady ? 1 : 0),
          transition: 'opacity 0.5s ease-in-out'
        }}
        onCanPlay={() => {
          handleCanPlay();
          setVideoReady(true);
        }}
        onLoadedData={() => setVideoReady(true)}
      >
        <source 
          src="https://d3p1hokpi6aqc3.cloudfront.net/mirai_home_1.mp4" 
          type="video/mp4" 
        />
      </video>
    </section>
  )
}

export default Hero
