import React from 'react'
import Footer from '@/components/Life@Mirai/Footer/page'
import MiraiHomesPage from '@/components/Life@Mirai/Hero/page'

const page = () => {
  return (
    <>
      <main className="relative z-10 bg-white mb-[100vh]">
        <MiraiHomesPage />
      </main>
      
      <Footer />
    </>
  )
}

export default page
