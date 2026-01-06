"use client";
import React, { useState } from 'react';

interface Amenity {
  name: string;
  image: string;
}

interface Season {
  title: string;
  description: string;
  amenities: Amenity[];
  bgClass: string;
}

interface Seasons {
  [key: string]: Season;
}

const EraSeasons: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<string>('spring');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const seasons: Seasons = {
    spring: {
      title: 'TERRA',
      description: '',
      amenities: [
        { name: 'Outdoor Fitness Zones', image: 'bg-aqua-fitness' },
        { name: 'Gathering Zones', image: 'bg-aqua-gathering' },
        { name: 'Sandpit Area', image: 'bg-aqua-sandpit' },
        { name: 'Kids Play Area', image: 'bg-aqua-kids' },
        { name: 'Terrace Lawn', image: 'bg-aqua-lawn' },
        { name: 'Ultra-Luxury Lounge', image: 'bg-aqua-lounge' },
        { name: 'Biophilic Seating Arena', image: 'bg-aqua-biophilic' },
        { name: 'Vantage Point', image: 'bg-aqua-vantage' },
        { name: 'Yoga Lawn', image: 'bg-aqua-yoga' }
      ],
      bgClass: 'bg-autumn'
    },
    summer: {
      title: 'AQUA',
      description: '',
      amenities: [
        { name: 'Infinity Swimming Pool', image: 'bg-terra-pool' },
        { name: 'Outdoor Beach Deck with Seating Kiosks', image: 'bg-terra-deck' },
        { name: 'Green Islands', image: 'bg-terra-islands' },
        { name: 'Kids Pool', image: 'bg-terra-jacuzzi' },
        { name: 'Private Dining Area', image: 'bg-terra-dining' },
        { name: 'Private Bar Counter', image: 'bg-terra-bar' },
        { name: 'Water Pavilion', image: 'bg-terra-pavilion' },
        { name: 'Vantage Point', image: 'bg-terra-vantage' }
      ],
      bgClass: 'bg-summer'
    },
    autumn: {
      title: 'PYRO',
      description: '',
      amenities: [
        { name: 'Agni-Water Sculptures', image: 'bg-pyro-agni' },
        { name: 'Ultra-Luxury Lounge', image: 'bg-pyro-lounge' },
        { name: 'Bonfire Arena', image: 'bg-pyro-bonfire' },
        { name: 'Barbeque Area', image: 'bg-pyro-bbq' },
        { name: 'Bar Counter/Juice Station', image: 'bg-pyro-bar' },
        { name: 'Gathering Lawn', image: 'bg-pyro-lawn' },
        { name: 'Lava Walk Zone', image: 'bg-pyro-lava' },
        { name: 'Flame Seating Pods', image: 'bg-pyro-flame' },
        { name: 'Senior Citizens Corner', image: 'bg-pyro-senior' },
        { name: 'Vantage Point', image: 'bg-pyro-vantage' }
      ],
      bgClass: 'bg-winter'
    },
    winter: {
      title: 'AVIA',
      description: '',
      amenities: [
        { name: 'Amphitheatre with Advent Seating Zone', image: 'bg-avia-amphitheatre' },
        { name: 'Sculpture Pod', image: 'bg-avia-sculpture' },
        { name: 'Digital Presentation Room', image: 'bg-avia-digital' },
        { name: 'Meeting Rooms', image: 'bg-avia-meeting' },
        { name: 'Interactive Water Plaza', image: 'bg-avia-waterplaza' },
        { name: 'Bar Counter', image: 'bg-avia-bar' },
        { name: 'Vantage Point', image: 'bg-avia-vantage' }
      ],
      bgClass: 'bg-spring'
    }
  };

  const largeAmenities = new Set([
    'Infinity Swimming Pool',
    'Outdoor Beach Deck with Seating Kiosks',
    'Green Islands',
    'Kids Pool',
    'Private Dining Area',
    'Private Bar Counter',
    'Water Pavilion',
    'Vantage Point',
    'Amphitheatre with Advent Seating Zone',
    'Sculpture Pod',
    'Digital Presentation Room',
    'Meeting Rooms',
    'Interactive Water Plaza',
    'Bar Counter',
    'Outdoor Fitness Zones',
    'Gathering Zones',
    'Sandpit Area',
    'Kids Play Area',
    'Terrace Lawn',
    'Ultra-Luxury Lounge',
    'Biophilic Seating Arena',
    'Yoga Lawn',
    'Agni-Water Sculptures',
    'Bonfire Arena',
    'Barbeque Area',
    'Bar Counter/Juice Station',
    'Gathering Lawn',
    'Lava Walk Zone',
    'Flame Seating Pods',
    'Senior Citizens Corner'
  ]);

  const backgroundImages: { [key: string]: string } = {
    'bg-spring': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/aqua.png',
    'bg-summer': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/avia.jpg',
    'bg-autumn': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/terra.jpg',
    'bg-winter': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/pyro.png',
    'bg-terra-pool': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/infinitypool.jpg',
    'bg-terra-vantage': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/vantagepoint.jpg',
    'bg-terra-jacuzzi': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/jacuzzi.jpg',
    'bg-avia-amphitheatre': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/amphi.jpg',
    'bg-avia-vantage': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/vantage-avia.jpg',
    'bg-aqua-vantage': 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/vantage-terra.jpg'
  };

  const getBackgroundImage = (bgClass: string): string => {
    return backgroundImages[bgClass] || backgroundImages['bg-spring'];
  };

  const currentBgImage = hoveredImage 
    ? getBackgroundImage(hoveredImage) 
    : getBackgroundImage(seasons[currentSeason].bgClass);

  const handleSeasonChange = (season: string) => {
    if (season !== currentSeason) {
      setIsTransitioning(true);
      setImageLoaded(false);
      setTimeout(() => {
        setCurrentSeason(season);
        setTimeout(() => {
          setIsTransitioning(false);
          setImageLoaded(true);
        }, 100);
      }, 300);
    }
  };

  // Preload images for smooth transitions
  React.useEffect(() => {
    Object.values(backgroundImages).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const seasonIcons: { [key: string]: string } = {
    spring: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/terra-w.png',
    summer: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/aqua-w.png',
    autumn: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pyro-w.png',
    winter: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pyro-w.png'
  };

  return (
    <section className="w-screen h-screen overflow-hidden relative m-0 p-0 max-w-full">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Image */}
        <div 
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          style={{ 
            backgroundImage: `url(${currentBgImage})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-start px-20 py-10 md:px-5">
          <div className={`bg-[rgba(120,37,47,0.35)] backdrop-blur-[25px] text-white p-5 w-full max-w-[340px] rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)] border border-white/20 flex flex-col transition-all duration-500 ${
            isTransitioning ? 'opacity-80 scale-98' : 'opacity-100 scale-100'
          }`}>
            {/* Season Title with animated underline */}
            <div className="relative">
              <h1 className="text-[22.4px] font-light tracking-[6px] mb-0 uppercase relative" style={{ fontFamily: 'serif' }}>
                {seasons[currentSeason].title}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#d4a574] to-transparent w-full mt-2" />
              </h1>
            </div>

            {/* Amenities List */}
            <div className="mt-6 h-[280px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-[rgba(212,165,116,0.5)] hover:scrollbar-thumb-[rgba(212,165,116,0.7)]">
              {seasons[currentSeason].amenities.map((amenity, index) => (
                <div
                  key={`${currentSeason}-${index}`}
                  className={`py-2.5 px-2 opacity-80 hover:opacity-100 hover:pl-3 hover:bg-white/10 transition-all duration-300 cursor-pointer border-b border-white/10 rounded group relative ${
                    largeAmenities.has(amenity.name) ? 'text-sm font-normal' : 'text-xs'
                  }`}
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                  onMouseEnter={() => setHoveredImage(amenity.image)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <span className="relative">
                    {amenity.name}
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </div>
              ))}
            </div>

            {/* Season Icons */}
            <div className="flex gap-4 flex-wrap justify-start mt-8 pt-4 border-t border-white/10">
              {Object.keys(seasons).map((season) => (
                <div
                  key={season}
                  className={`w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-2 relative group ${
                    currentSeason === season
                      ? 'border-[#d4a574] shadow-[0_0_20px_rgba(212,165,116,0.5)] scale-110'
                      : 'border-white/30 hover:border-[#d4a574]'
                  } hover:scale-110 bg-[rgba(160,70,85,0.7)] hover:bg-[rgba(160,70,85,0.9)]`}
                  onClick={() => handleSeasonChange(season)}
                >
                  <img
                    src={seasonIcons[season]}
                    alt={seasons[season].title}
                    className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {seasons[season].title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 0.8;
            transform: translateX(0);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-track-white\/10::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thumb-\[rgba\(212\,165\,116\,0\.5\)\]::-webkit-scrollbar-thumb {
          background: rgba(212, 165, 116, 0.5);
          border-radius: 3px;
        }
        .hover\:scrollbar-thumb-\[rgba\(212\,165\,116\,0\.7\)\]::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 165, 116, 0.7);
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </section>
  );
};

export default EraSeasons;
