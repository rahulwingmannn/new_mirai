'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const shapeTwoPath = '/images/shape-two-pods.png';

interface Amenity {
  name: string;
  image: string;
}

interface Level {
  level: string;
  defaultImage: string;
  amenities: Amenity[];
}

const levels: Level[] = [
  {
    level: 'Level 1',
    defaultImage: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level1-one.png',
    amenities: [
      { name: '350-Seater Multipurpose Hall', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level1-one.png' },
      { name: 'Pre-Function Hall', image: 'https://images.unsplash.com/photo-1767337264371-13af71aa7bf7?w=1600&q=80&auto=format' },
      { name: 'Dance Studio', image: 'https://images.unsplash.com/photo-1767337264862-44fe578e16bd?w=1600&q=80&auto=format' },
      { name: 'Creche', image: 'https://images.unsplash.com/photo-1767337171304-9a206edf28b3?w=1600&q=80&auto=format' },
      { name: 'Virtual Cricket', image: 'https://images.unsplash.com/photo-1767337264375-369be20eb266?w=1600&q=80&auto=format' },
      { name: 'Virtual Golf', image: 'https://images.unsplash.com/photo-1767337264219-05e802db7c0b?w=1600&q=80&auto=format' },
      { name: 'Kids Activity Rooms', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/playzone.png' }
    ]
  },
  {
    level: 'Level 2',
    defaultImage: 'https://images.unsplash.com/photo-1767338692158-5dd559d1f432?w=1600&q=80&auto=format',
    amenities: [
      { name: '50-Seater Private Theatre', image: 'https://images.unsplash.com/photo-1767338692158-5dd559d1f432?w=1600&q=80&auto=format' },
      { name: 'Billiards & Snooker', image: 'https://images.unsplash.com/photo-1767338526030-a5c9ba27245a?w=1600&q=80&auto=format' },
      { name: 'Guest Rooms', image: 'https://images.unsplash.com/photo-1767339112497-de66b10afed3?w=1600&q=80&auto=format' },
      { name: 'Spa', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level2-four.jpg' },
      { name: 'Mini Sports Lounge', image: 'https://images.unsplash.com/photo-1767437854729-51a8f050e579?w=1600&q=80&auto=format&fit=crop' },
      { name: 'Cigar Room', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/cigarroom.png' }
    ]
  },
  {
    level: 'Level 3',
    defaultImage: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-one.jpg',
    amenities: [
      { name: 'Half Olympic Pool', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-one.jpg' },
      { name: 'TT Room', image: 'https://images.unsplash.com/photo-1767344464272-17e1c657f8bf?w=1600&q=80&auto=format' },
      { name: 'Coworking Space', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-four.jpg' },
      { name: 'Squash Court', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-five.png' },
      { name: 'Badminton Courts', image: 'https://images.unsplash.com/photo-1767437854156-9afa48aeba89?w=1600&q=80&auto=format&fit=crop' },
      { name: 'Conference Arena', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/office-room.jpg' }
    ]
  },
  {
    level: 'Level 4',
    defaultImage: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_meditation.png',
    amenities: [
      { name: 'Yoga & Meditation Deck', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_meditation.png' },
      { name: 'Gym & Fitness Corner', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_gym.png' }
    ]
  }
];

export default function MiraiClubhouse() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [currentBg, setCurrentBg] = useState('https://images.unsplash.com/photo-1767509778340-7664ab6583ae?w=1600&q=80&auto=format&fit=crop');
  const [showPanels, setShowPanels] = useState<boolean[]>([false, false, false, false]);

  const handleLevelHover = (levelIndex: number) => {
    setActiveLevel(levelIndex);
    setCurrentBg(levels[levelIndex].defaultImage);
    const newPanels = [false, false, false, false];
    setShowPanels(newPanels);
  };

  const handleLowerZoneHover = (levelIndex: number) => {
    setActiveLevel(levelIndex);
    setCurrentBg(levels[levelIndex].defaultImage);
    const newPanels = [false, false, false, false];
    newPanels[levelIndex] = true;
    setShowPanels(newPanels);
  };

  const handleAmenityHover = (image: string) => {
    setCurrentBg(image);
  };

  const handleGlobalLeave = () => {
    setActiveLevel(null);
    setCurrentBg('https://images.unsplash.com/photo-1767509778340-7664ab6583ae?w=1600&q=80&auto=format&fit=crop');
    setShowPanels([false, false, false, false]);
  };

  return (
    <section 
      className="relative bg-black w-full h-screen overflow-hidden"
      onMouseLeave={handleGlobalLeave}
    >
      {/* Background with transition */}
      <motion.div 
        key={currentBg}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${currentBg}')` }}
      />

      {/* Decorative shape - Always visible */}
      <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
        <div className="absolute right-[-20%] -top-2 w-[160vw] md:w-[150vw] lg:w-[140vw]">
          <img
            src={shapeTwoPath}
            alt="Background shape"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="absolute inset-0 z-[10] grid grid-cols-4" style={{ bottom: '60px' }}>
        {levels.map((level, levelIndex) => (
          <div
            key={levelIndex}
            className={`relative h-full ${levelIndex < 3 ? 'border-r border-gray-700/30' : ''}`}
          >
            {/* Upper Zone - Hides panel when hovered */}
            <div 
              className="absolute top-0 left-0 w-full h-[50%]"
              onMouseEnter={() => handleLevelHover(levelIndex)}
            />
            
            {/* Lower Zone - Shows panel when hovered */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[50%]"
              onMouseEnter={() => handleLowerZoneHover(levelIndex)}
            />

            {/* Amenity Panel - slides up/down */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: showPanels[levelIndex] ? '0%' : '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white px-6 md:px-8 py-8"
            >
              <div className="space-y-3">
                {level.amenities.map((amenity, idx) => (
                  <p key={idx} className="text-[14px] md:text-[15px] leading-relaxed">
                    <span
                      className="inline-block cursor-pointer text-white/90 hover:text-white border-b border-transparent hover:border-white/40 pb-0.5 transition-all duration-300 ease-out"
                      onMouseEnter={() => handleAmenityHover(amenity.image)}
                    >
                      {amenity.name}
                    </span>
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Fixed Level Buttons at Bottom - Always Visible */}
      <div className="absolute bottom-0 left-0 right-0 z-[25] grid grid-cols-4">
        {levels.map((level, levelIndex) => (
          <button
            key={levelIndex}
            className={`
              py-6 px-4 text-center cursor-pointer transition-all duration-300
              ${levelIndex < 3 ? 'border-r border-white/20' : ''}
              ${activeLevel === levelIndex 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-black/60 hover:bg-black/80 backdrop-blur-sm'
              }
            `}
            onMouseEnter={() => handleLowerZoneHover(levelIndex)}
          >
            <h2 
              className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {level.level}
            </h2>
          </button>
        ))}
      </div>
    </section>
  );
}
