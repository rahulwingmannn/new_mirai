
'use client'

import React from 'react'
import useScreenSize from '@/hooks/useScreenSize'
import MiraiPodsSlider from './Pods_Slider'
import MiraiPodsSliderMobile from './Pods_Slider_Mobile'

const MiraiPodsSliderResponsive = () => {
  const { isMobile, isClient } = useScreenSize()

  // Loading fallback to prevent hydration mismatch
  if (!isClient) {
    return (
      <section 
        className="relative w-full overflow-hidden"
        style={{ 
          backgroundColor: '#000', 
          minHeight: '100vh',
          height: '100vh',
        }}
      />
    )
  }

  return isMobile ? <MiraiPodsSliderMobile /> : <MiraiPodsSlider />
}

export default MiraiPodsSliderResponsive
