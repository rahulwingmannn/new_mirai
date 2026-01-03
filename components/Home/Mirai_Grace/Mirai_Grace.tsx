import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full">
      <video
        src="/highlight.mp4"
        className="block w-full"
        style={{ width: '100%', height: '100vh', objectFit: 'fill', objectPosition: 'center' }}
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
