"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Blog data
const blogPosts = [
  {
    id: 1,
    title: "Live the Sixth Element: How Pavani Mirai Redefines Luxury by Harmonizing Nature's Forces",
    excerpt:
      "In Hyderabad's fast-evolving skyline, a new benchmark in luxury has taken shape. This tower dares to reimagine what elevated living truly means. Rising elegantly in the heart of the Financial District, Pavani Mirai is not just another address; it is ...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/life_at_mirai_1.png",
    href: "/live-the-sixth-element",
    imagePosition: "left" as const,
  },
  {
    id: 2,
    title: "Cloud-Kissed Retreats: A Deep Dive into the Elemental Sky Pods at Pavani Mirai",
    excerpt:
      "High above the bustle of the city, where the clouds drift unhurried and the horizon stretches endlessly, lies a sanctuary unlike any other - the Elemental Sky Pods at Pavani Mirai...",
    image: "/images/cloud.jpg",
    href: "/cloud-kissed-retreats",
    imagePosition: "right" as const,
  },
  {
    id: 3,
    title: "The Luxury of Breathing Room: Why 8,000 Sq.Ft. Homes and 75% Open Landscape is the Future of Urban Living",
    excerpt:
      "In today's cities, space has become the most coveted luxury. Urban life, with all its conveniences and connections, has also brought with it a quiet longing for openness, serenity, and a sense of balance. At Pavani Mirai, that longing finds its answer...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/breathing.jpg",
    href: "/the-luxury-of-breathing",
    imagePosition: "left" as const,
  },
  {
    id: 4,
    title: "A Global Nexus: The Strategic Advantage of Living at Pavani Mirai in Hyderabad's Financial District",
    excerpt:
      "In a world where time and access define success, the true luxury of modern living lies in location. For today's discerning homebuyer, one who values convenience as much as comfort...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/global.jpg",
    href: "/a-global-nexus",
    imagePosition: "right" as const,
  },
];

export default function MiraiHomesPage() {
  const [showHeadText, setShowHeadText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressPathRef = useRef<SVGPathElement>(null);

  // Wait for component to be ready
  useEffect(() => {
    // Prevent any scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // GSAP Parallax and reveal animations
  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      // Kill any existing ScrollTriggers
      ScrollTrigger.getAll().forEach(st => st.kill());

      // Smooth parallax animation for clouds and sky
      gsap.utils.toArray([".sky", ".cloud1", ".cloud2", ".cloud3"]).forEach((el) => {
        const yValue = 
          (el as Element).classList.contains("sky") ? -200 :
          (el as Element).classList.contains("cloud2") ? -500 :
          (el as Element).classList.contains("cloud1") ? -800 : -650;

        gsap.to(el as Element, {
          y: yValue,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            immediateRender: false,
          },
        });
      });

      // Blog card reveal animations
      blogRefs.current.forEach((container, index) => {
        if (!container) return;

        const imageContainer = container.querySelector(".image-container");
        const imageInner = container.querySelector(".image-inner");
        const isLeft = blogPosts[index].imagePosition === "left";

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        cardTl.fromTo(
          imageContainer,
          { xPercent: isLeft ? -100 : 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1.2, ease: "power2.out" }
        ).fromTo(
          imageInner,
          { xPercent: isLeft ? 100 : -100, scale: 1.3 },
          { xPercent: 0, scale: 1, duration: 1.2, ease: "power2.out" },
          "<"
        );
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, [isReady]);

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 50);
      setShowHeadText(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <>
      <main ref={mainRef} className="bg-white">
        {/* ==================== PARALLAX HERO SECTION ==================== */}
        <section ref={heroRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-blue-400 to-blue-200">
          {/* SVG Parallax Container - positioned to fill the hero section */}
          <div className="absolute inset-0 w-full h-full z-0">
            <svg 
              viewBox="0 0 1200 800" 
              xmlns="http://www.w3.org/2000/svg" 
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="absolute top-0 left-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              style={{ minHeight: '100vh' }}
            >
              <defs>
                <mask id="cloudMask">
                  <g className="cloud1">
                    <rect fill="#fff" width="100%" height="801" y="799" />
                    <image
                      xlinkHref="https://assets.codepen.io/721952/cloud1Mask.jpg"
                      width="1200"
                      height="800"
                    />
                  </g>
                </mask>
              </defs>

              {/* Sky Background - visible layer */}
              <image
                className="sky"
                xlinkHref="https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png"
                x="0"
                y="0"
                width="1200"
                height="800"
                preserveAspectRatio="xMidYMid slice"
              />

              {/* Cloud Layers - visible layers */}
              <image
                className="cloud2"
                xlinkHref="https://assets.codepen.io/721952/cloud2.png"
                x="0"
                y="0"
                width="1200"
                height="800"
                opacity="0.9"
              />
              <image
                className="cloud1"
                xlinkHref="https://assets.codepen.io/721952/cloud1.png"
                x="0"
                y="0"
                width="1200"
                height="800"
                opacity="0.95"
              />
              <image
                className="cloud3"
                xlinkHref="https://assets.codepen.io/721952/cloud3.png"
                x="0"
                y="0"
                width="1200"
                height="800"
                opacity="1"
              />

              {/* White Mask at Bottom */}
              <g mask="url(#cloudMask)">
                <rect fill="#fff" width="100%" height="100%" />
              </g>
            </svg>
          </div>

          {/* Head Text Overlay */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 transition-all duration-700 ${
              showHeadText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-6 leading-tight"
              style={{ 
                color: '#78252f',
                textShadow: '0 2px 30px rgba(255,255,255,0.9), 0 4px 60px rgba(255,255,255,0.7)'
              }}
            >
              Here&apos;s What Life at the Sixth Element
              <br />
              Feels Like
            </h2>
            <p 
              className="max-w-2xl text-gray-800 text-base md:text-lg lg:text-xl leading-relaxed font-light"
              style={{
                textShadow: '0 2px 20px rgba(255,255,255,0.95), 0 4px 40px rgba(255,255,255,0.8)'
              }}
            >
              When you choose Mirai, you choose a benchmark of opulence that&apos;s seldom
              traversed. It gives you access to a lifestyle less known, and lesser experienced.
              This is the sort of life that unravels here at Mirai.
            </p>
          </div>
        </section>

        {/* ==================== BLOG ITEMS SECTION ==================== */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="space-y-16 lg:space-y-24">
              {blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  ref={(el) => { blogRefs.current[index] = el; }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                >
                  {post.imagePosition === "left" ? (
                    <>
                      {/* Image Left */}
                      <div className="image-container overflow-hidden">
                        <Link href={post.href} className="block group">
                          <div className="relative overflow-hidden rounded-lg shadow-xl">
                            <div className="image-inner relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-colors duration-500" />
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Content Right */}
                      <div className="flex flex-col justify-center px-4 lg:px-8">
                        <div className="space-y-4 lg:space-y-6 lg:pl-8">
                          <h3 className="text-2xl lg:text-3xl font-serif text-slate-800 leading-tight hover:text-amber-700 transition-colors duration-300">
                            <Link href={post.href}>{post.title}</Link>
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
                            {post.excerpt}
                          </p>
                          <div className="pt-4 text-right">
                            <Link
                              href={post.href}
                              className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 group"
                            >
                              <svg
                                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Content Left */}
                      <div className="order-2 lg:order-1 flex flex-col justify-center px-4 lg:px-8">
                        <div className="space-y-4 lg:space-y-6 lg:pr-8">
                          <h3 className="text-2xl lg:text-3xl font-serif text-slate-800 leading-tight hover:text-amber-700 transition-colors duration-300">
                            <Link href={post.href}>{post.title}</Link>
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
                            {post.excerpt}
                          </p>
                          <div className="pt-4 text-right">
                            <Link
                              href={post.href}
                              className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 group"
                            >
                              <svg
                                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Image Right */}
                      <div className="order-1 lg:order-2 image-container overflow-hidden">
                        <Link href={post.href} className="block group">
                          <div className="relative overflow-hidden rounded-lg shadow-xl">
                            <div className="image-inner relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-colors duration-500" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* More Button */}
            <div className="text-center pt-12 lg:pt-20">
              <button className="group inline-flex items-center gap-3 text-lg font-light tracking-widest text-slate-600 hover:text-amber-700 transition-colors duration-300">
                <span className="text-amber-600 group-hover:-translate-x-1 transition-transform duration-300">
                  «
                </span>
                <span>More</span>
                <span className="text-amber-600 group-hover:translate-x-1 transition-transform duration-300">
                  »
                </span>
              </button>
            </div>
          </div>
        </section>

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
              stroke="#d97706"
              strokeWidth="3"
              className="transition-all duration-100"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-amber-600">
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
    </>
  );
}
