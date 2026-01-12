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

  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressPathRef = useRef<SVGPathElement>(null);

  // GSAP Parallax and reveal animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth parallax animation for clouds and sky
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8, // Smoother scrub
        },
      });

      // Subtle, professional parallax movements - all moving upward
      tl.to(".sky", { yPercent: -15, ease: "none" }, 0)
        .to(".cloud-back", { yPercent: -25, ease: "none" }, 0)
        .to(".cloud-mid", { yPercent: -35, ease: "none" }, 0)
        .to(".cloud-front", { yPercent: -45, ease: "none" }, 0);

      // Blog card reveal animations
      blogRefs.current.forEach((container, index) => {
        if (!container) return;

        const imageContainer = container.querySelector(".image-container");
        const imageInner = container.querySelector(".image-inner");
        const isLeft = blogPosts[index].imagePosition === "left";

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        cardTl.fromTo(
          imageContainer,
          { xPercent: isLeft ? -100 : 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }
        ).fromTo(
          imageInner,
          { xPercent: isLeft ? 100 : -100, scale: 1.2 },
          { xPercent: 0, scale: 1, duration: 1, ease: "power3.out" },
          "<"
        );
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 50);
      setShowHeadText(scrollTop > 80);
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
        <section 
          ref={heroRef} 
          className="relative h-screen overflow-hidden bg-white"
        >
          {/* Sky Background Layer */}
          <div 
            className="sky absolute inset-0 w-full h-full"
            style={{ 
              backgroundImage: "url('https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Cloud Layers - positioned for depth effect */}
          {/* Back cloud layer - slowest movement */}
          <div 
            className="cloud-back absolute inset-x-0 bottom-0 h-full"
            style={{ 
              backgroundImage: "url('https://assets.codepen.io/721952/cloud2.png')",
              backgroundSize: '100% auto',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Middle cloud layer */}
          <div 
            className="cloud-mid absolute inset-x-0 bottom-0 h-full"
            style={{ 
              backgroundImage: "url('https://assets.codepen.io/721952/cloud1.png')",
              backgroundSize: '100% auto',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Front cloud layer - fastest movement */}
          <div 
            className="cloud-front absolute inset-x-0 bottom-0 h-full"
            style={{ 
              backgroundImage: "url('https://assets.codepen.io/721952/cloud3.png')",
              backgroundSize: '100% auto',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* White fade at bottom for smooth transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10"
          />

          {/* Head Text Overlay */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 transition-all duration-1000 ease-out ${
              showHeadText 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-12"
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
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="space-y-20 lg:space-y-32">
              {blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  ref={(el) => { blogRefs.current[index] = el; }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                  {post.imagePosition === "left" ? (
                    <>
                      {/* Image Left */}
                      <div className="image-container overflow-hidden">
                        <Link href={post.href} className="block group">
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <div className="image-inner relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Content Right */}
                      <div className="flex flex-col justify-center px-4 lg:px-8">
                        <div className="space-y-5 lg:space-y-6 lg:pl-8">
                          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-serif text-slate-800 leading-tight hover:text-amber-700 transition-colors duration-300">
                            <Link href={post.href}>{post.title}</Link>
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
                            {post.excerpt}
                          </p>
                          <div className="pt-6 text-right">
                            <Link
                              href={post.href}
                              className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl"
                            >
                              <svg
                                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
                        <div className="space-y-5 lg:space-y-6 lg:pr-8">
                          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-serif text-slate-800 leading-tight hover:text-amber-700 transition-colors duration-300">
                            <Link href={post.href}>{post.title}</Link>
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
                            {post.excerpt}
                          </p>
                          <div className="pt-6 text-right">
                            <Link
                              href={post.href}
                              className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl"
                            >
                              <svg
                                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <div className="image-inner relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            <div className="text-center pt-16 lg:pt-24">
              <button className="group inline-flex items-center gap-4 text-lg font-light tracking-widest text-slate-600 hover:text-amber-700 transition-all duration-300">
                <span className="text-amber-600 text-2xl group-hover:-translate-x-2 transition-transform duration-300">
                  «
                </span>
                <span className="uppercase">More</span>
                <span className="text-amber-600 text-2xl group-hover:translate-x-2 transition-transform duration-300">
                  »
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ==================== SCROLL TO TOP BUTTON ==================== */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-110 ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="-1 -1 102 102">
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="3"
            />
            <path
              ref={progressPathRef}
              d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
              fill="none"
              stroke="#d97706"
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
