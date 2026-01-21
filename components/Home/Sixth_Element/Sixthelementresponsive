'use client'

import React from 'react'
import useScreenSize from '@/hooks/useScreenSize'
import SixthElement from './Sixth_element'
import SixthElementMobile from './SixthElementMobile'

const SixthElementResponsive = () => {
  const { isMobile, isClient } = useScreenSize()

  // Loading fallback to prevent hydration mismatch
  if (!isClient) {
    return (
      <section 
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: 'transparent', minHeight: '100vh' }}
      />
    )
  }

  return isMobile ? <SixthElementMobile /> : <SixthElement />
}

export default SixthElementResponsive
