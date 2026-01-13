import React from 'react'
import PavaniMiraiBlog from '@/components/live-the-sixth-element/page'
import Footer from '@/components/Life@Mirai/Footer/page'

const page = () => {
  return (
    <>
      {/* Main content wrapper - MUST have background and margin-bottom */}
      <main className="relative z-10 bg-white pb-[100vh]">
        <PavaniMiraiBlog />
      </main>
      
      <Footer />
    </>
  )
}

export default page
