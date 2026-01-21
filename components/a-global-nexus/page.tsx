"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MiraiHomesPage() {
  const [showHeadText, setShowHeadText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [skyImageLoaded, setSkyImageLoaded] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const scrollDistRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);

  // Preload the sky background image
  useEffect(() => {
    const img = new Image();
    img.src = "https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png";
    img.onload = () => setSkyImageLoaded(true);
  }, []);

  // GSAP Parallax animations
  useEffect(() => {
    if (!skyImageLoaded) return;

    const ctx = gsap.context(() => {
      // Set initial positions for clouds and sky
      gsap.set(".sky", { y: 0 });
      gsap.set(".cloud1", { y: 100 });
      gsap.set(".cloud2", { y: -150 });
      gsap.set(".cloud3", { y: -50 });

      // Parallax animation for clouds and sky using onUpdate for smoother performance
      ScrollTrigger.create({
        trigger: scrollDistRef.current,
        start: "0 0",
        end: "100% 100%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Sky moves slowest
          gsap.set(".sky", { y: progress * -200 });
          
          // Cloud1 moves from y:100 to y:-800 (total -900 distance)
          gsap.set(".cloud1", { y: 100 + (progress * -900) });
          
          // Cloud2 moves from y:-150 to y:-500 (total -350 distance)
          gsap.set(".cloud2", { y: -150 + (progress * -350) });
          
          // Cloud3 moves from y:-50 to y:-650 (total -600 distance)
          gsap.set(".cloud3", { y: -50 + (progress * -600) });
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, [skyImageLoaded]);

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 50);
      setShowHeadText(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update scroll progress path
  useEffect(() => {
    if (progressPathRef.current) {
      const pathLength = progressPathRef.current.getTotalLength();
      const progressOffset = pathLength - (scrollProgress / 100) * pathLength;
      progressPathRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
      progressPathRef.current.style.strokeDashoffset = `${progressOffset}`;
    }
  }, [scrollProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main ref={mainRef} className="relative bg-white">
      {/* Scroll Distance Trigger */}
      <div ref={scrollDistRef} className="h-[150vh] absolute w-full top-0 left-0 pointer-events-none" />

      {/* ==================== PARALLAX HERO SECTION ==================== */}
      <section ref={heroRef} className="relative z-10 bg-white overflow-hidden">
        {/* Loading placeholder */}
        {!skyImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-300 via-neutral-200 to-white" />
        )}
        
        <svg 
          viewBox="0 0 1200 800" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-full h-auto block transition-opacity duration-500 ${skyImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ display: 'block', margin: 0, padding: 0, backgroundColor: 'white' }}
        >
          <defs>
            <mask id="m">
              <g className="cloud1">
                <rect fill="#fff" width="100%" height="801" y="799" />
                <image
                  xlinkHref="https://assets.codepen.io/721952/cloud1Mask.jpg"
                  width="1200"
                  height="800"
                />
              </g>
            </mask>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#333333" />
              <stop offset="100%" stopColor="#4a4a4a" />
            </linearGradient>
          </defs>

          <image
            className="sky"
            xlinkHref="https://azure-baboon-302476.hostingersite.com//mirai_/media/blog-four.jpg"
            width="1200"
            height="800"
            preserveAspectRatio="xMidYMid slice"
          />

          <image
            className="cloud2"
            xlinkHref="https://assets.codepen.io/721952/cloud2.png"
            width="1200"
            height="800"
          />
          <image
            className="cloud1"
            xlinkHref="https://assets.codepen.io/721952/cloud1.png"
            width="1200"
            height="800"
          />
          <image
            className="cloud3"
            xlinkHref="https://assets.codepen.io/721952/cloud3.png"
            width="1200"
            height="800"
          />

          <g mask="url(#m)">
            <rect fill="#fff" width="100%" height="100%" />
          </g>
        </svg>

        {/* Text Overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 lg:pb-32 text-center px-4 transition-all duration-700 ${
            showHeadText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#78252f] mb-6 leading-tight drop-shadow-2xl max-w-5xl">
            A Global Nexus: The Strategic Advantage of Living at Pavani Mirai
          </h2>
          <p className="text-[#78252f]/90 text-sm md:text-base tracking-[0.2em] uppercase font-light drop-shadow-lg">
            Financial District • Hyderabad
          </p>
        </div>
      </section>

      {/* ==================== ARTICLE CONTENT ==================== */}
      <article className="relative z-20 bg-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12 text-black leading-relaxed">
          
          {/* Intro */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-black/70 font-light leading-8">
              In a world where time and access define success, the true luxury of modern living lies in location. For today's discerning homebuyer, one who values convenience as much as comfort, <strong>Pavani Mirai Hyderabad</strong> offers a rare confluence of both. Rising majestically in the heart of Hyderabad's Financial District, this landmark development by Pavani Infra represents not just a place of residence but a strategic investment in lifestyle, connectivity, and global relevance.
            </p>
            <p className="mt-6 text-lg text-black/80">
              At Mirai, luxury transcends aesthetics. It is redefined through geography where the world's leading corporations, educational institutions, and entertainment avenues lie just minutes away. This is the address that connects you to the pulse of progress, while cocooning you in the serenity of elevated, sky-kissed living.
            </p>
          </div>

          {/* Section 1 - Where Hyderabad Meets the World */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Where Hyderabad Meets the World
            </h3>
            <p className="mb-4 text-lg text-black/80">
              The Financial District of Hyderabad is an ecosystem of growth and ambition. Home to global giants such as Amazon, Capgemini, Cognizant, Microsoft, and Google, the district has evolved into one of India's most dynamic business corridors. It's where the brightest minds converge, and where every sunrise brings new opportunities.
            </p>
            <p className="mb-4 text-lg text-black/80">
              Located strategically within this thriving hub, Pavani Mirai enjoys unparalleled proximity to both global workplaces and premium lifestyle destinations. The development stands as a beacon of luxury apartments in the Financial District, Hyderabad, designed for those who wish to stay ahead of the curve while staying grounded in comfort.
            </p>
            <p className="text-lg italic border-l-4 border-[#78252f] pl-4 text-[#78252f]">
              With institutions like ISB (Indian School of Business) and University of Hyderabad just a short drive away, Pavani Mirai also lies within a knowledge and innovation belt that continues to attract visionaries from around the world.
            </p>
          </div>

          {/* Section 2 - Connectivity (Light Box) */}
          <div className="bg-neutral-50 p-8 rounded-2xl border border-black/10">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              The Advantage of Connectivity
            </h3>
            <p className="mb-6 text-lg text-black/80">
              When choosing a home, location is more about time saved and opportunities gained. Pavani Mirai's address ensures effortless mobility across the city, empowering you to move fluidly between the professional and the personal.
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> <strong>Seamless Access:</strong> Outer Ring Road (ORR) & Old Mumbai Highway</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> <strong>Key Hubs:</strong> Gachibowli, HITEC City, Kokapet & Nanakramguda</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> <strong>Global Travel:</strong> Quick drive to Rajiv Gandhi International Airport</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> <strong>Lifestyle:</strong> Upscale retail, healthcare & fine-dining avenues</li>
            </ul>

            <p className="text-black/70 text-sm leading-relaxed">
              Whether you're a corporate leader, entrepreneur, or global citizen, this connectivity allows you to reach key destinations in minutes, giving residents a complete ecosystem of urban sophistication.
            </p>
          </div>

          {/* Section 3 - Architecture */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Architected for Global Lifestyles
            </h3>
            <p className="mb-4 text-lg text-black/80">
              Every inch of Pavani Mirai Hyderabad has been crafted to complement its world-class location. Soaring 55 floors high, the tower is a landmark of vertical luxury, housing 178 residences, including 8 duplex apartments in Hyderabad that redefine the art of expansive living.
            </p>
            <p className="text-lg text-black/80">
              Each residence at Mirai mirrors international standards with sprawling interiors, intelligent layouts, and panoramic decks offering 270° views of the cityscape. The design philosophy integrates the five elements of nature, culminating in a sixth - the spirit of balance and elevation. From the 40-ft-high grand entrance that welcomes you into its fold to the 2,00,000 sq. ft. of lifestyle amenities, every facet resonates with the refined sensibilities of global citizens.
            </p>
          </div>

          {/* Section 4 - Lifestyle (Dark Box) */}
          <div className="bg-[#78252f] p-8 md:p-12 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
              Luxury that Moves with You
            </h3>
            <p className="mb-4 text-lg text-white">
              The Financial District isn't just about work - it's about the lifestyle that comes with success. And Pavani Mirai complements that lifestyle perfectly.
            </p>
            <p className="mb-4 text-lg text-white">
              Here, mornings can begin with a rejuvenating swim at the <strong>Rooftop Water Pod's</strong> infinity pool, afternoons can flow into meetings at the <strong>Air Pod's</strong> business lounge, and evenings can wind down at the <strong>Fire Pod's</strong> sky bar or bonfire arena - all just an elevator ride away.
            </p>
            <p className="text-lg text-white">
              Mirai has curated a world within itself. With an expansive clubhouse spread across four levels, a range of wellness zones, and biophilic landscapes covering 75% open green area, it offers a life of balance and rejuvenation amidst the fast-paced rhythm of the city.
            </p>
          </div>

          {/* Section 5 - Investment */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Investment That Aligns with the Future
            </h3>
            <p className="mb-4 text-lg text-black/80">
              Hyderabad continues to rise as India's most livable city and one of the fastest-growing real estate markets. The Financial District, in particular, has become the epicentre of premium development, with infrastructure, employment, and urban amenities converging to create long-term value.
            </p>
            <p className="text-lg text-black/80">
              Investing in Pavani Mirai is not just about buying a luxury home, it's about acquiring a future-forward asset in the most strategic zone of the city. The project's architectural grandeur, limited number of residences, and premium address ensure exclusivity that will only appreciate over time. For those seeking luxury apartments in the Financial District Hyderabad that offer both lifestyle and legacy, Mirai stands as a rare opportunity.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-b border-black/20 py-12">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-8 text-center">FAQs</h3>
            <div className="space-y-8">
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">1. What makes the location of Pavani Mirai a strategic advantage?</h5>
                <p className="text-lg text-black/70">Pavani Mirai's location in Hyderabad's Financial District places residents at the core of the city's corporate and cultural pulse. The project enjoys close proximity to major tech campuses, international schools, and entertainment hubs. With seamless connectivity via ORR and Old Mumbai Highway, residents can move effortlessly between work, leisure, and travel destinations.</p>
              </div>
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">2. Is Pavani Mirai close to major tech and corporate campuses?</h5>
                <p className="text-lg text-black/70">Yes. Pavani Mirai is situated just minutes away from renowned corporate offices such as Amazon Hyderabad, Capgemini, Cognizant, Microsoft, and Deloitte, as well as prestigious institutions like ISB. Its location makes it ideal for professionals who value shorter commutes and an elevated quality of life.</p>
              </div>
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">3. How is the connectivity to the rest of Hyderabad?</h5>
                <p className="text-lg text-black/70">Pavani Mirai offers unmatched connectivity. The Outer Ring Road provides quick access to all major destinations, including the airport, Gachibowli, HITEC City, and Kokapet. This ease of movement ensures residents can experience the best of both urban convenience and serene living - all from one address.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="text-center pt-8">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              A Global Address, A Personal Sanctuary
            </h3>
            <p className="mb-6 text-lg max-w-2xl mx-auto text-black/80">
              In essence, Pavani Mirai Hyderabad captures the future of urban living where strategic location meets soulful design. It represents the harmony of ambition and tranquility, global mobility and grounded luxury.
            </p>
            <p className="mb-8 text-lg max-w-2xl mx-auto text-black/80">
              For those seeking duplex apartments in Hyderabad or luxury apartments in the Financial District, Mirai is not merely a residence, it's a statement. A statement of having arrived, of belonging to a world that values not just where you live, but how you live.
            </p>
            
            <div className="inline-block border-y-2 border-[#78252f] py-4 px-8 mt-4">
              <p className="text-xl font-light text-black">
                Here, you don't just find a home.<br/>
                You find your place in the world's most connected circle.
              </p>
              <p className="mt-4 font-serif text-2xl text-[#78252f] font-normal">
                A Global Nexus.<br/>
                Pavani Mirai.
              </p>
            </div>
          </div>

        </div>
      </article>

      {/* ==================== SCROLL TO TOP BUTTON ==================== */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="-1 -1 102 102">
          <path
            ref={progressPathRef}
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            fill="none"
            stroke="#78252f"
            strokeWidth="3"
            className="transition-all duration-100"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[#78252f]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </span>
      </button>
    </main>
  );
}

