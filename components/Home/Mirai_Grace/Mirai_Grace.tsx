import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full flex justify-center items-center h-screen overflow-hidden">
      <video
        src="/highlight.mp4"
        className="block min-h-full min-w-full object-cover translate-y-09"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Highlight video"
      />
    </div>
  )
}

export default Mirai_Grace
