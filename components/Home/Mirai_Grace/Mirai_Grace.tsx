import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full min-h-screen overflow-hidden relative flex items-center justify-center -mt-8">
      <video
        src="/highlight.mp4"
        className="w-[103%] h-auto max-h-[103vh] object-contain scale-103"
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
