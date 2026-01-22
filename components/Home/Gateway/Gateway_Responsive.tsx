'use client'

import React from 'react'
import useScreenSize from '@/hooks/useScreenSize'
import { RevealZoom } from './Gateway'
import { RevealZoomMobile } from './Gateway_Mobile'

const GatewayResponsive = () => {
  const { isMobile, isClient } = useScreenSize()

  // Loading fallback to prevent hydration mismatch
  if (!isClient) {
    return (
      <section 
        className="relative w-full overflow-hidden bg-black"
        style={{ minHeight: '100vh' }}
      />
    )
  }

  return isMobile ? <RevealZoomMobile /> : <RevealZoom />
}

// Also export the individual components for flexibility
export { RevealZoom, RevealZoomMobile, GatewayResponsive }
export default GatewayResponsive
