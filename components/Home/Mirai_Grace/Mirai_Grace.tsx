import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full h-screen overflow-hidden relative">
      <video
        src="/highlight.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover"
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
