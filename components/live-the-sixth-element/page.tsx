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
            xlinkHref="https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png"
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
            Live the Sixth Element: How Pavani Mirai Redefines Luxury by
            Harmonizing Nature&apos;s Forces
          </h2>
          <p className="text-[#78252f]/90 text-sm md:text-base tracking-[0.2em] uppercase font-light drop-shadow-lg">
            The Sixth Element
          </p>
        </div>
      </section>

      {/* ==================== ARTICLE CONTENT ==================== */}
      <article className="relative z-20 bg-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12 text-black leading-relaxed">
          
          {/* Intro */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-black/70 font-light leading-8">
              In Hyderabad's fast-evolving skyline, a new benchmark in luxury has taken shape. This tower dares to reimagine what elevated living truly means. Rising elegantly in the heart of the Financial District, <strong>Pavani Mirai</strong> is not just another address; it is a philosophy in motion. Crafted by Pavani Infra, this ultra-luxury residential tower transcends architectural brilliance to become a living embodiment of nature's harmony.
            </p>
            <p className="mt-6 text-black/80">
              Drawing inspiration from the five classical elements - Earth, Water, Fire, Air, and Space, Pavani Mirai unites them to give rise to the <strong>Sixth Element</strong>, a realm where design, nature, and emotion coexist in perfect equilibrium.
            </p>
            <p className="mt-4 italic border-l-4 border-[#78252f] pl-4 text-black/60">
              This is not merely about creating Luxury Apartments in Hyderabad, it's about redefining what luxury itself stands for.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              A Tower That Touches the Sky and the Soul
            </h3>
            <p className="mb-4 text-black/80">
              Spread across 2.46 acres, Pavani Mirai features a singular 55-storey tower that reshapes the meaning of exclusivity. With only 178 residences, including 8 limited-edition duplex sky villas, the project offers the kind of privacy and personalization that few developments can match.
            </p>
            <p className="text-black/80">
              Located strategically between Nanakramguda and Nallagandla, two of Hyderabad's most coveted locales, Pavani Mirai offers residents the rare privilege of being connected to the city's thriving business and lifestyle hubs while living in a world serenely detached from it. For those seeking apartments in Nallagandla Hyderabad or Nanakramguda apartments that transcend the ordinary, Mirai emerges as a singular icon of luxury and balance.
            </p>
            <p className="mt-4 font-medium text-[#78252f]">
              Mirai's essence lies in its philosophy. Its philosophy dictates that true luxury is the union of natural harmony and human aspiration.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-neutral-50 p-8 rounded-2xl border border-black/10">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              The Genesis of the Sixth Element
            </h3>
            <p className="mb-4 text-black/80">
              The story of Pavani Mirai begins with a belief that the world is composed of five fundamental elements: Earth, Water, Fire, Air, and Space. Each of these elements carries a distinct energy, shaping the environment and influencing human well-being.
            </p>
            <p className="text-black/80">
              Mirai draws from this universal truth to create something the Sixth Element. It is the point where these forces converge to form a new dimension of luxury living, one that balances physical indulgence with emotional and spiritual well-being.
            </p>
            <blockquote className="mt-6 text-xl text-black/50 font-serif text-center">
              &quot;The Sixth Element represents harmony in motion. It is where architecture breathes, materials speak, and every detail flows with the rhythm of nature.&quot;
            </blockquote>
          </div>

          {/* Section 3 - The Elements */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-8">
              The Five Elements, Reimagined in Architecture
            </h3>
            <p className="mb-8 text-black/80">
              Pavani Mirai translates this elemental inspiration into a tangible experience through four distinct rooftop pods, each a sculptural expression of a natural force, and a helipad that completes the celestial balance. These pods are not mere amenities but elevated sanctuaries, thoughtfully curated to engage the senses and the soul.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Air Pod */}
              <div className="border-t-2 border-black/20 pt-4">
                <h4 className="text-xl font-bold text-[#78252f] mb-2">1. The Air Pod – Freedom Above the Horizon</h4>
                <p className="text-sm text-black/70">
                  The Air Pod is a sanctuary of openness. Floating high above the city, it invites residents into tranquil spaces where gentle breezes and panoramic views awaken the senses. Meditation decks, yoga zones, and open lounges create an atmosphere of calm, which reminds you that true luxury is space to breathe freely.
                </p>
              </div>

              {/* Water Pod */}
              <div className="border-t-2 border-black/20 pt-4">
                <h4 className="text-xl font-bold text-[#78252f] mb-2">2. The Water Pod – Tranquillity in Motion</h4>
                <p className="text-sm text-black/70">
                  Water brings fluidity and serenity to Mirai. The Water Pod, adorned with reflective pools and calming cascades, embodies the meditative essence of flow. It is where time slows down, and the ripples of water mirror the stillness within.
                </p>
              </div>

              {/* Fire Pod */}
              <div className="border-t-2 border-black/20 pt-4">
                <h4 className="text-xl font-bold text-[#78252f] mb-2">3. The Fire Pod – The Energy of Celebration</h4>
                <p className="text-sm text-black/70">
                  The Fire Pod symbolizes vitality and passion. Designed as the social heart of Mirai, it features ambient lounges, BBQ spots, sunset decks, and event spaces that radiate warmth. It's where energy gathers for conversation, connection, and celebration.
                </p>
              </div>

              {/* Earth Pod */}
              <div className="border-t-2 border-black/20 pt-4">
                <h4 className="text-xl font-bold text-[#78252f] mb-2">4. The Earth Pod – Grounded in Green</h4>
                <p className="text-sm text-black/70">
                  Lush greenscapes and tactile natural materials define the Earth Pod, creating a sanctuary of grounded elegance. It connects residents back to the roots of existence by offering a haven of calm amidst life's momentum.
                </p>
              </div>
            </div>
            
            <p className="mt-8 text-center text-black/50 italic">
              Together, these four pods represent the living expression of the elements, while the helipad, symbolizing Space, completes the cycle, culminating in the Sixth Element: Mirai itself.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-black text-white p-8 md:p-12 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              2,00,000 sq. ft. of Elemental Indulgence
            </h3>
            <p className="mb-4 text-white/80">
              The grandeur of Pavani Mirai extends beyond design into scale and substance. With over 2,00,000 sq. ft. of amenities, every aspect of leisure and lifestyle has been reimagined for the discerning few.
            </p>
            <p className="mb-4 text-white/80">
              From the podium amenities to the four-level clubhouse and the rooftop pods, each layer unfolds a new facet of refined living. Whether it's wellness, recreation, or relaxation, Mirai ensures that every experience resonates with sophistication and sensory delight.
            </p>
            <p className="text-white/80">
              The clubhouse serves as a contemporary sanctuary featuring luxury lounges, spa retreats, indoor courts, and fine dining spaces that blend seamlessly into their natural surroundings. Here, indulgence finds balance in design that feels alive.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              A New Dimension in Luxury Apartments in Hyderabad
            </h3>
            <p className="mb-4 text-black/80">
              In the city's growing landscape of luxury apartments in Hyderabad, Pavani Mirai rises as a distinct narrative that intertwines nature, architecture, and emotion. Unlike conventional high-rises that focus solely on visual grandeur, Mirai focuses on experiential depth.
            </p>
            <p className="mb-4 text-black/80">
              Each residence, whether an expansive sky villa or an elegant apartment, is meticulously planned to allow abundant natural light, cross-ventilation, and panoramic views. The material palette evokes calm, with organic textures and subtle tones that mirror the elegance of the elements themselves.
            </p>
            <p className="text-black/80">
              Located in the heart of Financial District and close to Nanakramguda and Nallagandla, Mirai's connectivity ensures that you remain at the heart of the city's most vibrant district, even as you rise above it all. For those seeking Nanakramguda apartments that promise more than proximity, Mirai stands unmatched.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-b border-black/20 py-12">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-8 text-center">FAQs</h3>
            <div className="space-y-8">
              <div>
                <h5 className="font-bold text-lg text-black mb-2">1. What is the "Sixth Element" concept at Pavani Mirai?</h5>
                <p className="text-black/70">The Sixth Element at Pavani Mirai represents the fusion of the five natural elements - Earth, Water, Fire, Air, and Space - into a singular, harmonious living experience. It symbolizes the point where design transcends aesthetics to embody emotional and environmental balance. Pavani Mirai itself becomes this Sixth Element, a living, breathing masterpiece that harmonizes nature's energies with modern luxury.</p>
              </div>
              <div>
                <h5 className="font-bold text-lg text-black mb-2">2. How are the five elements integrated into the architectural design?</h5>
                <p className="text-black/70">Each of the five elements finds its expression in Mirai's architectural framework. The four rooftop pods are dedicated to Air, Water, Fire, and Earth, each offering themed experiential zones that stimulate the senses and elevate well-being. The helipad, symbolizing Space, completes this elemental integration, together giving rise to the Sixth Element: the project as a whole.</p>
              </div>
              <div>
                <h5 className="font-bold text-lg text-black mb-2">3. Does this philosophy improve the residents' well-being?</h5>
                <p className="text-black/70">Absolutely. Pavani Mirai's design philosophy goes beyond aesthetics. It aims to enhance holistic well-being. By integrating natural elements into everyday living, it fosters emotional balance, physical comfort, and mental clarity. From air flow and daylight optimization to the sensory experiences created by water and greenery, every aspect of Mirai's design contributes to a calmer, more centered lifestyle.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="text-center pt-8">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Luxury, Redefined in Elemental Harmony
            </h3>
            <p className="mb-6 max-w-2xl mx-auto text-black/80">
              In an era where luxury often feels detached from meaning, Pavani Mirai restores its soul. It transforms architectural ambition into a meditative experience of balance and beauty. It reminds us that luxury is not just about what we own - it's about how we feel, live, and connect.
            </p>
            <p className="mb-8 max-w-2xl mx-auto text-black/80">
              At Pavani Mirai, the elements don't just surround you, they live with you. They breathe through every space, whisper through every texture, and resonate through every sunrise and sunset.
            </p>
            
            <div className="inline-block border-y-2 border-[#78252f] py-4 px-8 mt-4">
              <p className="text-xl font-light text-black">
                Because when Earth, Water, Fire, Air, and Space come together in harmony, they create a higher state of being.
              </p>
              <p className="mt-4 font-serif text-2xl text-[#78252f] font-bold">
                That is the Sixth Element.<br/>
                That is Pavani Mirai.
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
