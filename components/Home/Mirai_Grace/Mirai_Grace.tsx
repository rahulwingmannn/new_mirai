import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full flex justify-center items-center h-screen">
      <video
        src="/highlight.mp4"
        className="block h-full w-auto"
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
