'use client';

import { memo } from 'react';
import Image from 'next/image';

const DAY_VIEW_PATH = '/images/day_view.png';

const ContactForm = memo(function ContactForm() {
  return (
    <section
      id="contact-section"
      className="fixed inset-0 flex items-center justify-start bg-black"
      style={{ zIndex: 1 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={DAY_VIEW_PATH}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 h-full pl-6 lg:pl-12">
        <div className="flex items-center justify-start h-full">
          {/* Glassmorphism Card */}
          <div 
            className="w-auto rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl bg-white/20 border border-white/30"
            style={{ maxWidth: '340px' }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white font-serif drop-shadow-lg">
              Contact Us
            </h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text"
                name="name"
                placeholder="Name *" 
                required
                autoComplete="name"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-b-2 border-white/40 outline-none text-white placeholder-white/70 focus:border-white focus:bg-white/20 transition-all rounded-t-lg" 
              />
              <input 
                type="email"
                name="email"
                placeholder="Email *" 
                required
                autoComplete="email"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-b-2 border-white/40 outline-none text-white placeholder-white/70 focus:border-white focus:bg-white/20 transition-all rounded-t-lg" 
              />
              <button 
                type="submit"
                className="w-full bg-white/25 backdrop-blur-sm text-white py-4 rounded-lg font-bold border border-white/40 hover:bg-white/40 hover:shadow-lg transition-all duration-300"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
