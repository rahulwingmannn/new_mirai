'use client'
import React, { useRef, useEffect, useState, memo } from 'react'
import Image from 'next/image'

const HERO_LOGO = '/images/logo_1.png'
const VIDEO_SRC = 'https://d3p1hokpi6aqc3.cloudfront.net/mirai_home_1.mp4'

const Hero = memo(function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldHide, setShouldHide] = useState(false)

  // Play video immediately on mount
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Play as soon as possible
      video.play().catch(() => {})
    }
  }, [])

  // Hide hero when scrolled past OR near bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const scrollHeight = document.documentElement.scrollHeight
      const distanceFromBottom = scrollHeight - (scrollY + windowHeight)
      
      const pastHero = scrollY >= windowHeight - 5
      const nearBottom = distanceFromBottom < windowHeight * 2

      setShouldHide(pastHero || nearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      className="fixed inset-0 w-full h-screen overflow-hidden bg-black"
      style={{
        zIndex: 2,
        opacity: shouldHide ? 0 : 1,
        visibility: shouldHide ? 'hidden' : 'visible',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    >
      {/* Video - full screen background, no transitions */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Logo overlay */}
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
    </section>
  )
})

Hero.displayName = 'Hero'
export default Hero
