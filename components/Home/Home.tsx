import React from 'react'
import Hero from './Hero/Hero'
import { RevealZoom } from './Gateway/Gateway' 
import ScrollVideoComponent from './Mirai_Grace/Mirai_Grace'
import MiraiPodsIntro from './4_Pods/4_pods'
import MiraiPodsSlider from './Mirai_Pods_Slider/Pods_Slider'
import ClubhouseIntro from './4_Level_Clubhouse/4_Level_Clubhouse'
import MiraiClubhouse from './ClubeHouse_Img_controller/ClubeHouse_Controller'
import InteractiveMap from './Interative_Map/Interative_Map'
import ContactForm from './Contact_us/Contact_us'
import Footer from './Footer/Footer'
import SixthElement from './Sixth_Element/Sixth_element'


const Home = () => {
  return (
    <div className="relative">
      {/* All sections before Contact - wrapped with higher z-index */}
      <div className="relative z-10 bg-black">
        <Hero />
        {/* Spacer to offset the fixed hero so page content starts after it */}
        <div className="h-screen" aria-hidden="true" />
        
        <SixthElement />
        
        {/* 
          ============================================================
          PINNED SCROLLTRIGGER SECTIONS
          ============================================================
          Each pinned section needs proper isolation to prevent conflicts.
          Key fixes applied:
          1. Each section wrapped with isolation: isolate
          2. contain: layout style paint for proper stacking context
          3. Small spacer between pinned sections
          4. Each component has unique ScrollTrigger ID
          ============================================================
        */}
        
        {/* RevealZoom Section - First pinned canvas animation */}
        <section 
          aria-label="Reveal zoom" 
          data-section="reveal-zoom"
          className="relative"
          style={{ 
            isolation: 'isolate',
            contain: 'layout style paint',
          }}
        >
          <RevealZoom />
        </section>
        
        {/* 
          Spacer between pinned sections - CRITICAL for ScrollTrigger!
          This ensures proper separation and position calculation
        */}
        <div 
          className="relative bg-black" 
          style={{ height: '2px' }} 
          aria-hidden="true" 
        />
        
        {/* ScrollVideoComponent Section - Second pinned canvas animation */}
        <section 
          aria-label="Scroll video" 
          data-section="scroll-video"
          className="relative"
          style={{ 
            isolation: 'isolate',
            contain: 'layout style paint',
          }}
        >
          <ScrollVideoComponent />
        </section>
        
        {/* End of pinned sections - rest of content flows normally */}
        
        <MiraiPodsIntro />
        <MiraiPodsSlider />
        <ClubhouseIntro />
        <MiraiClubhouse />
        <InteractiveMap />
      </div>

      {/* Contact Form - Fixed position with z-index: 1 */}
      <ContactForm />

      {/* Spacer - Creates scroll room to see the fixed contact section */}
      <div className="relative h-screen" style={{ zIndex: 0 }} />

      {/* Footer - Scrolls up and covers the contact section with z-index: 10 */}
      <Footer />
    </div>
  )
}

export default Home