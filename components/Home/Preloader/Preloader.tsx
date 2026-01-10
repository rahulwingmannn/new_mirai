import { useState, useEffect } from 'react';

interface VideoPreloaderProps {
  onComplete?: () => void;
}

export default function VideoPreloader({ onComplete }: VideoPreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if preloader has been shown in this session
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsLoading(false);
      onComplete?.();
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    // Start fade out animation
    setFadeOut(true);
    
    // After fade out completes, hide preloader
    setTimeout(() => {
      sessionStorage.setItem('preloaderShown', 'true');
      setIsLoading(false);
      onComplete?.();
    }, 500);
  };

  if (!isLoading) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out'
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      >
        <source 
          src="https://d3p1hokpi6aqc3.cloudfront.net/preloader.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
