'use client';

import React, { useState, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const SHAPE_TWO_PATH = '/images/shape-two-pods.png';
const DEFAULT_BG = 'https://images.unsplash.com/photo-1767509778340-7664ab6583ae?w=1600&q=80&auto=format&fit=crop';
const INITIAL_PANELS = [false, false, false, false] as const;

interface Amenity {
  name: string;
  image: string;
}

interface Level {
  level: string;
  defaultImage: string;
  amenities: Amenity[];
}

const LEVELS: Level[] = [
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

// Memoized animation variants
const bgVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 }
};

const bgTransition = { duration: 0.5, ease: 'easeInOut' };
const panelTransition = { duration: 0.5, ease: 'easeOut' };

// Memoized sub-components
interface AmenityItemProps {
  amenity: Amenity;
  onHover: (image: string) => void;
}

const AmenityItem = memo<AmenityItemProps>(({ amenity, onHover }) => (
  <p className="text-[14px] md:text-[15px] leading-relaxed">
    <span
      className="inline-block cursor-pointer text-white/90 hover:text-white border-b border-transparent hover:border-white/40 pb-0.5 transition-all duration-300 ease-out"
      onMouseEnter={() => onHover(amenity.image)}
    >
      {amenity.name}
    </span>
  </p>
));

AmenityItem.displayName = 'AmenityItem';

interface LevelButtonProps {
  level: Level;
  levelIndex: number;
  isActive: boolean;
  onHover: (index: number) => void;
}

const LevelButton = memo<LevelButtonProps>(({ level, levelIndex, isActive, onHover }) => (
  <button
    className={`py-6 px-4 text-center cursor-pointer transition-all duration-300 ${
      levelIndex < 3 ? 'border-r border-white/20' : ''
    } ${isActive 
      ? 'bg-white/20 backdrop-blur-sm' 
      : 'bg-black/60 hover:bg-black/80 backdrop-blur-sm'
    }`}
    onMouseEnter={() => onHover(levelIndex)}
  >
    <h2 
      className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white"
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
    >
      {level.level}
    </h2>
  </button>
));

LevelButton.displayName = 'LevelButton';

interface LevelColumnProps {
  level: Level;
  levelIndex: number;
  showPanel: boolean;
  onLevelHover: (index: number) => void;
  onLowerZoneHover: (index: number) => void;
  onAmenityHover: (image: string) => void;
}

const LevelColumn = memo<LevelColumnProps>(({ 
  level, 
  levelIndex, 
  showPanel, 
  onLevelHover, 
  onLowerZoneHover, 
  onAmenityHover 
}) => (
  <div className={`relative h-full ${levelIndex < 3 ? 'border-r border-gray-700/30' : ''}`}>
    <div 
      className="absolute top-0 left-0 w-full h-[50%]"
      onMouseEnter={() => onLevelHover(levelIndex)}
    />
    
    <div 
      className="absolute bottom-0 left-0 w-full h-[50%]"
      onMouseEnter={() => onLowerZoneHover(levelIndex)}
    />

    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: showPanel ? '0%' : '100%' }}
      transition={panelTransition}
      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white px-6 md:px-8 py-8"
    >
      <div className="space-y-3">
        {level.amenities.map((amenity, idx) => (
          <AmenityItem key={idx} amenity={amenity} onHover={onAmenityHover} />
        ))}
      </div>
    </motion.div>
  </div>
));

LevelColumn.displayName = 'LevelColumn';

function MiraiClubhouse() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [currentBg, setCurrentBg] = useState(DEFAULT_BG);
  const [showPanels, setShowPanels] = useState<boolean[]>([...INITIAL_PANELS]);

  const handleLevelHover = useCallback((levelIndex: number) => {
    setActiveLevel(levelIndex);
    setCurrentBg(LEVELS[levelIndex].defaultImage);
    setShowPanels([false, false, false, false]);
  }, []);

  const handleLowerZoneHover = useCallback((levelIndex: number) => {
    setActiveLevel(levelIndex);
    setCurrentBg(LEVELS[levelIndex].defaultImage);
    setShowPanels(prev => {
      const newPanels = [false, false, false, false];
      newPanels[levelIndex] = true;
      return newPanels;
    });
  }, []);

  const handleAmenityHover = useCallback((image: string) => {
    setCurrentBg(image);
  }, []);

  const handleGlobalLeave = useCallback(() => {
    setActiveLevel(null);
    setCurrentBg(DEFAULT_BG);
    setShowPanels([false, false, false, false]);
  }, []);

  const bgStyle = useMemo(() => ({ 
    backgroundImage: `url('${currentBg}')` 
  }), [currentBg]);

  return (
    <section 
      className="relative bg-black w-full h-screen overflow-hidden"
      onMouseLeave={handleGlobalLeave}
    >
      {/* Background with transition */}
      <motion.div 
        key={currentBg}
        variants={bgVariants}
        initial="initial"
        animate="animate"
        transition={bgTransition}
        className="absolute inset-0 bg-cover bg-center"
        style={bgStyle}
      />

      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
        <div className="absolute right-[-20%] -top-2 w-[160vw] md:w-[150vw] lg:w-[140vw]">
          <img
            src={SHAPE_TWO_PATH}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="absolute inset-0 z-[10] grid grid-cols-4" style={{ bottom: '60px' }}>
        {LEVELS.map((level, levelIndex) => (
          <LevelColumn
            key={levelIndex}
            level={level}
            levelIndex={levelIndex}
            showPanel={showPanels[levelIndex]}
            onLevelHover={handleLevelHover}
            onLowerZoneHover={handleLowerZoneHover}
            onAmenityHover={handleAmenityHover}
          />
        ))}
      </div>

      {/* Fixed Level Buttons at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[25] grid grid-cols-4">
        {LEVELS.map((level, levelIndex) => (
          <LevelButton
            key={levelIndex}
            level={level}
            levelIndex={levelIndex}
            isActive={activeLevel === levelIndex}
            onHover={handleLowerZoneHover}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(MiraiClubhouse);
