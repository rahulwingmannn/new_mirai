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
    excerpt: "In Hyderabad's fast-evolving skyline, a new benchmark in luxury has taken shape. This tower dares to reimagine what elevated living truly means. Rising elegantly in the heart of the Financial District, Pavani Mirai is not just another address; it is ...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/life_at_mirai_1.png",
    href: "/live-the-sixth-element",
    imagePosition: "left" as const,
  },
  {
    id: 2,
    title: "Cloud-Kissed Retreats: A Deep Dive into the Elemental Sky Pods at Pavani Mirai",
    excerpt: "High above the bustle of the city, where the clouds drift unhurried and the horizon stretches endlessly, lies a sanctuary unlike any other - the Elemental Sky Pods at Pavani Mirai...",
    image: "/images/cloud.jpg",
    href: "/cloud-kissed-retreats",
    imagePosition: "right" as const,
  },
  {
    id: 3,
    title: "The Luxury of Breathing Room: Why 8,000 Sq.Ft. Homes and 75% Open Landscape is the Future of Urban Living",
    excerpt: "In today's cities, space has become the most coveted luxury. Urban life, with all its conveniences and connections, has also brought with it a quiet longing for openness, serenity, and a sense of balance. At Pavani Mirai, that longing finds its answer...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/breathing.jpg",
    href: "/the-luxury-of-breathing",
    imagePosition: "left" as const,
  },
  {
    id: 4,
    title: "A Global Nexus: The Strategic Advantage of Living at Pavani Mirai in Hyderabad's Financial District",
    excerpt: "In a world where time and access define success, the true luxury of modern living lies in location. For today's discerning homebuyer, one who values convenience as much as comfort...",
    image: "https://azure-baboon-302476.hostingersite.com//mirai_/media/global.jpg",
    href: "/a-global-nexus",
    imagePosition: "right" as const,
  },
];

export default function MiraiHomesPage() {
  const [showHeadText, setShowHeadText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mainRef = useRef(null);
  const scrollDistRef = useRef(null);
  const heroRef = useRef(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressPathRef = useRef(null);

  // GSAP Parallax and reveal animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax animation for clouds and sky using ScrollTrigger with onUpdate
      ScrollTrigger.create({
        trigger: scrollDistRef.current,
        start: "0 0",
        end: "100% 100%",
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

      // Blog card reveal animations
      blogRefs.current.forEach((container, index) => {
        if (!container) return;

        const imageContainer = container.querySelector(".image-container");
        const imageInner = container.querySelector(".image-inner");
        const isLeft = blogPosts[index].imagePosition === "left";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
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
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 50);
      setShowHeadText(scrollTop > 100);
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
    <>
      {/* ==================== MAIN CONTENT ==================== */}
      <main ref={mainRef} className="relative bg-[#0a0a0a] text-white overflow-x-hidden">
        {/* Scroll Distance Trigger */}
        <div ref={scrollDistRef} className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-0" />

        {/* ==================== PARALLAX HERO SECTION ==================== */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          {/* Sky Background */}
          <div className="sky absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500" />

          {/* Cloud 1 */}
          <div className="cloud1 absolute top-0 left-0 w-full h-full pointer-events-none">
            <img
              src="https://azure-baboon-302476.hostingersite.com//mirai_/media/cloud1.png"
              alt="Cloud 1"
              className="absolute w-full h-auto object-cover opacity-70"
              style={{ top: '10%' }}
            />
          </div>

          {/* Cloud 2 */}
          <div className="cloud2 absolute top-0 left-0 w-full h-full pointer-events-none">
            <img
              src="https://azure-baboon-302476.hostingersite.com//mirai_/media/cloud2.png"
              alt="Cloud 2"
              className="absolute w-full h-auto object-cover opacity-60"
              style={{ top: '30%' }}
            />
          </div>

          {/* Cloud 3 */}
          <div className="cloud3 absolute top-0 left-0 w-full h-full pointer-events-none">
            <img
              src="https://azure-baboon-302476.hostingersite.com//mirai_/media/cloud3.png"
              alt="Cloud 3"
              className="absolute w-full h-auto object-cover opacity-50"
              style={{ top: '50%' }}
            />
          </div>

          {/* Head Text Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000 ${
              showHeadText ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-center max-w-4xl px-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                Here's What Life at the Sixth Element Feels Like
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed drop-shadow-xl">
                When you choose Mirai, you choose a benchmark of opulence that's seldom traversed. It gives you access to a lifestyle less known, and lesser experienced. This is the sort of life that unravels here at Mirai.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== BLOG ITEMS SECTION ==================== */}
        <section className="relative z-10 bg-[#0a0a0a] py-20 px-6 md:px-12 lg:px-20">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              ref={(el) => {
                blogRefs.current[index] = el;
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {post.imagePosition === "left" ? (
                <>
                  {/* Image Left */}
                  <div className="image-container overflow-hidden rounded-lg">
                    <div className="image-inner">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>

                  {/* Content Right */}
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link
                      href={post.href}
                      className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-semibold text-lg"
                    >
                      Read More →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Content Left */}
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link
                      href={post.href}
                      className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-semibold text-lg"
                    >
                      Read More →
                    </Link>
                  </div>

                  {/* Image Right */}
                  <div className="image-container overflow-hidden rounded-lg">
                    <div className="image-inner">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* More Button */}
          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition-colors"
            >
              « More »
            </Link>
          </div>
        </section>

        {/* ==================== SCROLL TO TOP BUTTON ==================== */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <svg
            ref={progressPathRef}
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="w-6 h-6 text-white relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </main>
    </>
  );
}
