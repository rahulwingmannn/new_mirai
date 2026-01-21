import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full">
      <video
        src="/highlight.mp4"
        className="block w-full h-screen object-fill"
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
