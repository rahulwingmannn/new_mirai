'use client';

import React, { useEffect, useState } from 'react'
import VideoPreloader from './Preloader/Preloader'
import Hero from './Hero/Hero'
import { RevealZoom } from './Gateway/Gateway' 
import Mirai_Grace from './Mirai_Grace/Mirai_Grace'
import MiraiPodsIntro from './4_Pods/4_pods'
import MiraiPodsSlider from './Mirai_Pods_Slider/Pods_Slider'
import ClubhouseIntro from './4_Level_Clubhouse/4_Level_Clubhouse'
import MiraiClubhouse from './ClubeHouse_Img_controller/ClubeHouse_Controller'
import InteractiveMap from './Interative_Map/Interative_Map'
import ContactForm from './Contact_us/Contact_us'
import Footer from './Footer/Footer'
import SixthElement from './Sixth_Element/Sixth_element'

// Critical images to preload
const CRITICAL_IMAGES = [
  '/images/logo_1.png',
  '/images/sixth_ment.png',
  '/images/gateway/reveal.png',
  '/images/gateway/mirai.png',
  '/images/gateway/shape-two.png',
];

const Home = () => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Check session and preload critical assets
  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsPreloaderComplete(true);
    }
    setHasCheckedSession(true);

    // Preload critical images
    let loadedCount = 0;
    const totalImages = CRITICAL_IMAGES.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setAssetsLoaded(true);
      }
    };

    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; // Continue even if image fails
      img.src = src;
    });

    // Fallback - if images take too long, proceed anyway after 3 seconds
    const fallbackTimer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Disable scrolling until page is ready
  useEffect(() => {
    if (!isPreloaderComplete || !assetsLoaded) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const enableScroll = () => {
      // Wait for window load + small delay
      setTimeout(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setIsPageReady(true);
      }, 500);
    };

    if (document.readyState === 'complete') {
      enableScroll();
    } else {
      window.addEventListener('load', enableScroll);
      return () => window.removeEventListener('load', enableScroll);
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isPreloaderComplete, assetsLoaded]);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderShown', 'true');
    setIsPreloaderComplete(true);
  };

  // Wait until session is checked
  if (!hasCheckedSession) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Show preloader if not seen
  if (!isPreloaderComplete) {
    return <VideoPreloader onComplete={handlePreloaderComplete} />;
  }

  // Wait for assets to load
  if (!assetsLoaded) {
    return <div className="w-full h-screen bg-black" />;
  }

  return (
    <>
      {/* Hero is fixed position with video - z-index 2 */}
      <Hero />

      {/* ContactForm is fixed - z-index 5, revealed when scrolling past content */}
      <ContactForm />

      {/* Main scrollable content */}
      <div className="relative w-full overflow-x-hidden">
        {/* Spacer for Hero section */}
        <div className="h-screen" aria-hidden="true" />

        {/* Content sections - z-index 10, scrolls over Hero and ContactForm */}
        {/* pointer-events-none on wrapper, pointer-events-auto on children */}
        <div
          className="relative pointer-events-none"
          style={{
            zIndex: 10,
            opacity: isPageReady ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          {/* SixthElement - transparent background, shows Hero video behind */}
          <div className="pointer-events-auto">
            <SixthElement />
          </div>

          {/* RevealZoom - negative margin to overlap any gap from SixthElement */}
          <section
            aria-label="Reveal zoom"
            className="relative bg-black pointer-events-auto"
            style={{
              isolation: 'isolate',
              marginTop: '-2px'
            }}
          >
            <RevealZoom />
          </section>

          <section
            aria-label="Scroll video"
            className="relative bg-black pointer-events-auto"
          >
            <Mirai_Grace />
          </section>

          <div className="relative bg-black pointer-events-auto">
            <MiraiPodsIntro />
            <MiraiPodsSlider />
            <ClubhouseIntro />
            <MiraiClubhouse />
            <InteractiveMap />
          </div>

          {/* Spacer to reveal fixed ContactForm behind - no pointer-events-auto so clicks pass through */}
          <div className="h-screen" aria-hidden="true" />

          {/* Footer scrolls over ContactForm */}
          <div className="pointer-events-auto">
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
