import React from 'react'
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
  return (
    <div className="relative bg-black w-full overflow-x-hidden">
      {/* Contact Form - Fixed, lowest z-index among fixed elements */}
      <ContactForm />
      
      <div className="relative z-10 bg-black">
        <Hero />
        
        {/* Spacer for Hero */}
        <div className="h-screen" aria-hidden="true" />
        
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
        
        {/* Scroll video */}
        <section 
          aria-label="Scroll video" 
          className="relative bg-black"
          style={{ zIndex: 12 }}
        >
          <Mirai_Grace />
        </section>
        
        {/* Main content sections - HIGHER z-index to cover ContactForm */}
        <div className="relative bg-white" style={{ zIndex: 25 }}>
          <MiraiPodsIntro />
          <MiraiPodsSlider />
          <ClubhouseIntro />
          <MiraiClubhouse />
          <InteractiveMap />
        </div>
      </div>

      {/* Spacer to allow scrolling to reveal ContactForm */}
      <div className="relative h-screen" style={{ zIndex: 0 }} />
      
      {/* Footer - highest z-index */}
      <div className="relative" style={{ zIndex: 30 }}>
        <Footer />
      </div>
    </div>
  )
}

export default Home
