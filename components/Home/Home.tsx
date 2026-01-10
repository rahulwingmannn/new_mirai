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

const Home = () => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Check if preloader was already shown in this session
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsPreloaderComplete(true);
    }
    setHasCheckedSession(true);
  }, []);

  // Disable scrolling until page is ready
  useEffect(() => {
    if (!isPreloaderComplete) {
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
      }, 800);
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
  }, [isPreloaderComplete]);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderShown', 'true');
    setIsPreloaderComplete(true);
  };

  if (!hasCheckedSession) {
    return null;
  }

  if (!isPreloaderComplete) {
    return <VideoPreloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <>
      {/* Hero is fixed position with video - z-index 1 */}
      <Hero />
      
      {/* ContactForm is fixed - z-index 2, but only visible near the end (controlled internally) */}
      <ContactForm />
      
      {/* Main scrollable content */}
      <div className="relative w-full overflow-x-hidden">
        {/* Spacer for Hero section */}
        <div className="h-screen" aria-hidden="true" />
        
        {/* Content sections - z-index 10, scrolls over Hero */}
        <div className="relative" style={{ zIndex: 10 }}>
          {/* SixthElement - visible right after Hero video */}
          <SixthElement />
          
          <section 
            aria-label="Reveal zoom" 
            className="relative bg-black"
            style={{ isolation: 'isolate' }}
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

          {/* Spacer to reveal fixed ContactForm behind */}
          <div className="h-screen" aria-hidden="true" />
          
          {/* Footer scrolls over ContactForm */}
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Home
