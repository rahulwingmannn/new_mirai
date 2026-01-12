'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LOGO_PATH = '/images/footer_logo.png';
const HELPER_LOGO_PATH = '/images/logo.png';
const PATH_LENGTH = 307.919;
const CURRENT_YEAR = new Date().getFullYear();

// Memoized social link component
interface SocialLinkProps {
  href: string;
  label: string;
  icon: string;
}

const SocialLink = memo<SocialLinkProps>(({ href, label, icon }) => (
  <Link 
    href={href} 
    className="text-[#bfc6cf] hover:text-[#f5f5f5] transition-colors duration-200 text-lg"
    aria-label={label}
  >
    <i className={`bi bi-${icon}`}></i>
  </Link>
));

SocialLink.displayName = 'SocialLink';

// Memoized contact link component
interface ContactLinkProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  alignTop?: boolean;
}

const ContactLink = memo<ContactLinkProps>(({ href, icon, children, alignTop }) => (
  <Link 
    href={href} 
    className={`text-[#bfc6cf] hover:text-[#f5f5f5] transition-colors duration-200 flex ${alignTop ? 'items-start' : 'items-center'} gap-2`}
  >
    <i className={`bi bi-${icon} text-[#f5f5f5] ${alignTop ? 'mt-1' : ''}`}></i>
    {children}
  </Link>
));

ContactLink.displayName = 'ContactLink';

// Memoized back to top button
interface BackToTopProps {
  show: boolean;
  progress: number;
  onClick: () => void;
}

const BackToTopButton = memo<BackToTopProps>(({ show, progress, onClick }) => {
  const strokeStyle = useMemo(() => ({
    strokeDasharray: `${PATH_LENGTH} ${PATH_LENGTH}`,
    strokeDashoffset: PATH_LENGTH * (1 - progress),
    transition: 'stroke-dashoffset 150ms linear'
  }), [progress]);

  return (
    <button
      onClick={onClick}
      className={`fixed right-5 bottom-5 w-14 h-14 rounded-full bg-white/3 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/6 ${
        show ? 'opacity-95' : 'opacity-0 pointer-events-none'
      }`}
      style={{ zIndex: 9999 }}
      aria-label="Scroll to top"
    >
      <svg className="w-11 h-11 absolute" viewBox="-1 -1 102 102">
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          style={strokeStyle}
        />
      </svg>
      <svg 
        className="w-6 h-6" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
});

BackToTopButton.displayName = 'BackToTopButton';

function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showFallbackLogo, setShowFallbackLogo] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scroll = window.pageYOffset || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.max(0, Math.min(1, scroll / Math.max(1, height)));
          
          setScrollProgress(progress);
          setShowBackToTop(scroll > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onLoad = () => setIsVisible(true);

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogoError = useCallback(() => {
    setShowFallbackLogo(true);
  }, []);

  const visibilityClass = useCallback((delay: string, type: 'translate' | 'scale' = 'translate') => {
    const base = isVisible ? 'opacity-100' : 'opacity-0';
    const transform = type === 'translate' 
      ? (isVisible ? 'translate-y-0' : 'translate-y-4')
      : (isVisible ? 'scale-100' : 'scale-95');
    return `transition-all duration-500 ${delay} ${base} ${transform}`;
  }, [isVisible]);

  return (
    <footer
      className="relative text-[#bfc6cf] h-screen flex items-center"
      style={{ 
        zIndex: 10,
        backgroundImage: "url('https://d3p1hokpi6aqc3.cloudfront.net/039_PM_EXT_CAM68_LANDSCAPE%20AERIAL.png')",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      role="contentinfo"
      aria-label="Footer - Pavani Mirai"
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden="true" />

      <div 
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <section className="relative z-10 h-full px-6 lg:px-12">
        <div className="flex items-center h-full">
          <div className="max-w-md">
            {/* Logo */}
            <div className={`mb-8 ${visibilityClass('')}`}>
              <Image
                src={showFallbackLogo ? HELPER_LOGO_PATH : FOOTER_LOGO_PATH}
                alt={showFallbackLogo ? 'Fallback logo' : 'Mirai Footer Logo'}
                width={160}
                height={48}
                className="w-auto h-auto max-w-50 lg:max-w-60 drop-shadow-md block"
                priority
                onError={handleLogoError}
                style={{ filter: 'none' }}
              />
            </div>

            {/* Description */}
            <p className={`mb-8 text-base lg:text-lg ${visibilityClass('delay-100')}`}>
              Here Earth, Water, Fire, Air and Space come together to catalyse <br className="hidden lg:block" /> 
              a sixth element of life that feels like it was built for you.
            </p>

            {/* Contact Section */}
            <div className={`flex flex-col gap-2 py-2 mb-8 ${visibilityClass('delay-200', 'scale')}`}>
              <p className="mb-2 font-bold text-[#f5f5f5] tracking-wide">
                <span>Contact Us :</span>
              </p>
              <ContactLink href="tel:+919876543212" icon="phone">
                +91 9876543212
              </ContactLink>
              <ContactLink href="mailto:info@pavanimirai.com" icon="envelope">
                info@pavanimirai.com
              </ContactLink>
              <ContactLink href="#" icon="geo-alt" alignTop>
                <span>4th Floor, Road No.36, Jubilee Hills, Hyderabad-500 033</span>
              </ContactLink>
            </div>

            {/* Social Links */}
            <div className={`mb-6 ${visibilityClass('delay-300', 'scale')}`}>
              <div className="flex gap-4 pt-2">
                <SocialLink href="#" label="Facebook" icon="facebook" />
                <SocialLink href="#" label="Instagram" icon="instagram" />
                <SocialLink href="#" label="LinkedIn" icon="linkedin" />
                <SocialLink href="#" label="YouTube" icon="youtube" />
              </div>
            </div>

            {/* Footer Bottom */}
            <div className={`pt-3 text-xs lg:text-sm ${visibilityClass('delay-400')}`}>
              <div className="flex flex-col gap-1">
                <p className="text-[#bfc6cf]">
                  Copyright © <span>{CURRENT_YEAR}</span> PAVANI MIRAI. All Rights Reserved.
                </p>
                <Link 
                  href="https://www.wingmanbrandworks.com/" 
                  className="text-[#bfc6cf] hover:text-[#f5f5f5] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Design &amp; Developed By Wingman Brandworks LLP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackToTopButton 
        show={showBackToTop} 
        progress={scrollProgress} 
        onClick={scrollToTop} 
      />
    </footer>
  );
}

export default memo(Footer);
