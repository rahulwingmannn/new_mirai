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
// Updated import - use the responsive version
import SixthElementResponsive from './Sixth_Element/Sixthelementresponsive'

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
      img.onerror = checkAllLoaded;
      img.src = src;
    });

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

  if (!hasCheckedSession) {
    return <div className="w-full h-screen bg-black" />;
  }

  if (!isPreloaderComplete) {
    return <VideoPreloader onComplete={handlePreloaderComplete} />;
  }

  if (!assetsLoaded) {
    return <div className="w-full h-screen bg-black" />;
  }

  return (
    <>
      <Hero />
      <ContactForm />
      
      <div className="relative w-full overflow-x-hidden">
        <div className="h-screen" aria-hidden="true" />
        
        <div 
          className="relative" 
          style={{ 
            zIndex: 10,
            opacity: isPageReady ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          {/* Use the responsive version that switches between mobile/desktop */}
          <SixthElementResponsive />
          
          <section
            aria-label="Reveal zoom"
            className="relative bg-black"
            style={{
              isolation: 'isolate',
              marginTop: '-2px'
            }}
          >
            <RevealZoom />
          </section>
          
          <section 
            aria-label="Scroll video" 
            className="relative bg-black"
          >
            <Mirai_Grace />
          </section>
          
          <div className="relative bg-black">
            <MiraiPodsIntro />
            <MiraiPodsSlider />
            <ClubhouseIntro />
            <MiraiClubhouse />
            <InteractiveMap />
          </div>
        </div>

        <div 
          className="h-screen pointer-events-none" 
          aria-hidden="true" 
          style={{ position: 'relative', zIndex: 1 }}
        />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Home
