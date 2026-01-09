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
  const [isPageFullyLoaded, setIsPageFullyLoaded] = useState(false);

  useEffect(() => {
    // Check if preloader was already shown
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsPreloaderComplete(true);
    }

    // Disable scrolling initially
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';

    // Wait for all resources to load
    const handleLoad = () => {
      // Add a small delay to ensure everything is rendered
      setTimeout(() => {
        setIsPageFullyLoaded(true);
        // Re-enable scrolling
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
      }, 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      // Cleanup: re-enable scrolling when component unmounts
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
  };

  return (
    <>
      {/* Video Preloader - highest z-index */}
      {!isPreloaderComplete && <VideoPreloader onComplete={handlePreloaderComplete} />}
      
      <div 
        className="relative bg-black w-full overflow-x-hidden"
        style={{
          minHeight: '100vh',
          visibility: isPreloaderComplete ? 'visible' : 'hidden',
          opacity: isPreloaderComplete ? 1 : 0,
          transition: 'opacity 0.5s ease-in'
        }}
      >
        {/* Hero - fixed position, sits behind scrolling content */}
        <Hero />
        
        {/* Spacer for Hero - transparent, just takes up space */}
        <div className="h-screen" aria-hidden="true" />
        
        {/* Main scrolling content - starts after hero spacer */}
        <div className="relative z-10 bg-black">
          {/* Rest of content - hidden until page fully loads */}
          <div
            style={{
              opacity: isPageFullyLoaded ? 1 : 0,
              transition: 'opacity 0.8s ease-in',
              pointerEvents: isPageFullyLoaded ? 'auto' : 'none'
            }}
          >
            {/* SixthElement */}
            <div className="relative" style={{ zIndex: 10 }}>
              <SixthElement />
            </div>
            
            {/* RevealZoom */}
            <section 
              aria-label="Reveal zoom" 
              className="relative bg-black"
              style={{ zIndex: 11, isolation: 'isolate' }}
            >
              <RevealZoom />
            </section>
            
            {/* Mirai Grace */}
            <section 
              aria-label="Scroll video" 
              className="relative bg-black"
              style={{ zIndex: 12 }}
            >
              <Mirai_Grace />
            </section>
            
            {/* Remaining sections */}
            <div style={{ position: 'relative', zIndex: 13 }}>
              <MiraiPodsIntro />
              <MiraiPodsSlider />
              <ClubhouseIntro />
              <MiraiClubhouse />
              <InteractiveMap />
            </div>
          </div>
        </div>
        
        {/* Fixed UI layers */}
        <ContactForm />
        <div className="relative h-screen" style={{ zIndex: 0 }} />
        <Footer />
      </div>
    </>
  )
}

export default Home
