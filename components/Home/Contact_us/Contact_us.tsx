'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
const dayViewPath = '/images/day_view.png';

export default function ContactForm() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => {
      setBgLoaded(true);
      setBgError(true);
    };
    img.src = dayViewPath;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  // Render a neutral placeholder until background image is ready
  if (!bgLoaded) {
    return (
      <section
        id="contact-section"
        className="fixed inset-0 flex items-center justify-start bg-gray-100"
        style={{ zIndex: 1 }}
      >
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-white via-gray-100 to-white" aria-hidden="true" />
        <div className="relative z-10 h-full pl-6 lg:pl-12">
          <div className="flex items-center justify-start h-full">
            <div className="w-auto bg-white rounded-xl p-8 md:p-10 shadow-2xl" style={{ maxWidth: '340px' }}>
              <h2 
                className="text-2xl mb-8 text-gray-900 tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
              >
                Contact Us
              </h2>
              <div className="space-y-6">
                <input 
                  placeholder="Name" 
                  className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                />
                <input 
                  placeholder="Email" 
                  type="email"
                  className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                />
                <input 
                  placeholder="Number" 
                  type="tel"
                  className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
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
                    style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                    I accept the terms and conditions
                  </span>
                </label>
                <button 
                  className="w-full py-4 rounded-lg font-medium tracking-wider transition-all mt-4"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    backgroundColor: '#6B2C3E',
                    color: 'white',
                    letterSpacing: '0.15em'
                  }}
                >
                  Submit Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact-section"
      className="fixed inset-0 flex items-center justify-start bg-black"
      style={{ zIndex: 1 }}
    >
      {/* Background Image (render only if it loaded without error) */}
      {!bgError && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={dayViewPath}
            alt="Day view"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        </div>
      )}
      
      {/* Removed dark overlay so background image displays at full brightness */}
      
      <div className="relative z-10 h-full pl-6 lg:pl-12">
        <div className="flex items-center justify-start h-full">
          <div className="w-auto bg-white rounded-xl p-8 md:p-10 shadow-2xl" style={{ maxWidth: '340px' }}>
            <h2 
              className="text-2xl mb-8 text-gray-900 tracking-[0.3em] uppercase"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
            >
              Contact Us
            </h2>
            <div className="space-y-6">
              <input 
                placeholder="Name" 
                className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              />
              <input 
                placeholder="Email" 
                type="email"
                className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              />
              <input 
                placeholder="Number" 
                type="tel"
                className="w-full px-0 py-3 border-b border-gray-300 outline-none bg-transparent transition-colors placeholder:text-[#8B4A5E] placeholder:opacity-100 text-gray-800 focus:border-[#8B4A5E]"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
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
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                >
                  I accept the terms and conditions
                </span>
              </label>
              <button 
                className="w-full py-4 rounded-lg font-medium tracking-wider transition-all mt-4 hover:opacity-90"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  backgroundColor: '#6B2C3E',
                  color: 'white',
                  letterSpacing: '0.15em'
                }}
              >
                Submit Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
