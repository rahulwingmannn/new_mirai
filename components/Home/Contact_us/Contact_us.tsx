'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
const dayViewPath = '/images/day_view.png';

export default function ContactForm() {
  const [bgError, setBgError] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Load Migra font from Fontshare
    const link = document.createElement('link');
    link.href = 'https://api.fontshare.com/v2/css?f[]=migra@400,500,600,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const img = new window.Image();
    img.onerror = () => {
      setBgError(true);
    };
    img.src = dayViewPath;

    // Only show ContactForm when scrolled past 80% of the page
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = docHeight - windowHeight;
      
      // Calculate scroll percentage (0 to 1)
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      // Only show when scrolled past 80% of the page
      setShouldShow(scrollPercent > 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      img.onerror = null;
      document.head.removeChild(link);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't render at all if not scrolled far enough
  if (!shouldShow) {
    return null;
  }

  const formContent = (
    <div 
      className="w-auto rounded-2xl p-8 md:p-10 border border-white/30"
      style={{ 
        maxWidth: '340px',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
      }}
    >
      <h2 
        className="text-2xl mb-8 text-gray-900 tracking-[0.3em] uppercase"
        style={{ fontFamily: '"Migra", Georgia, serif', fontWeight: 400 }}
      >
        Contact Us
      </h2>
      <div className="space-y-6">
        <input 
          placeholder="Name" 
          className="w-full px-0 py-3 border-b border-gray-400/50 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
          style={{ fontFamily: '"Migra", Georgia, serif', fontStyle: 'italic' }}
        />
        <input 
          placeholder="Email" 
          type="email"
          className="w-full px-0 py-3 border-b border-gray-400/50 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
          style={{ fontFamily: '"Migra", Georgia, serif', fontStyle: 'italic' }}
        />
        <input 
          placeholder="Number" 
          type="tel"
          className="w-full px-0 py-3 border-b border-gray-400/50 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
          style={{ fontFamily: '"Migra", Georgia, serif', fontStyle: 'italic' }}
        />
        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input 
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 border border-gray-400 rounded-none accent-[#6B2C3E] cursor-pointer"
          />
          <span 
            className="text-sm text-gray-700"
            style={{ fontFamily: '"Migra", Georgia, serif', fontStyle: 'italic' }}
          >
            I accept the terms and conditions
          </span>
        </label>
        <button 
          className="w-full py-4 rounded-lg font-medium tracking-wider transition-all mt-4 hover:opacity-90"
          style={{ 
            fontFamily: '"Migra", Georgia, serif',
            backgroundColor: '#6B2C3E',
            color: 'white',
            letterSpacing: '0.15em'
          }}
        >
          Submit Form
        </button>
      </div>
    </div>
  );

  return (
    <section
      id="contact-section"
      className="fixed inset-0 w-full h-screen flex items-center justify-start overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!bgError && (
          <Image
            src={dayViewPath}
            alt="Day view"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        )}
        {/* Fallback gradient if image fails */}
        {bgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
        )}
      </div>
      
      {/* Form content */}
      <div className="relative z-10 h-full pl-6 lg:pl-12">
        <div className="flex items-center justify-start h-full">
          {formContent}
        </div>
      </div>
    </section>
  );
}
