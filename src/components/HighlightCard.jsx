import { useState, useEffect, useRef } from 'react';

// Mathematically pure geometric arch with clean tangent filleted corners and straight lines
// Recreating the exact architectural ribbon from the user reference photo with C1 derivative continuity
const UNIFIED_GEOMETRIC_PATH =
  'M 360 0 C 360 33, 387 60, 420 60 L 780 60 C 835 60, 880 105, 880 160 L 880 260 C 880 315, 835 360, 780 360 L 240 360 C 140 360, 80 460, 80 600';

export default function HighlightCard({ item, index }) {
  const cardRef = useRef(null);
  const pathRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathLength, setPathLength] = useState(1850);
  const [headPoint, setHeadPoint] = useState(null);

  const pathD = UNIFIED_GEOMETRIC_PATH;

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) setPathLength(len);
    }
  }, [pathD]);

  // Scroll listener: Slower, more deliberate speed tailored to natural reading scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!cardRef.current || !pathRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = cardRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Start drawing when the card top enters near the bottom (windowHeight * 0.95)
          // Finish drawing when the card has scrolled through past mid-screen (-rect.height * 0.4)
          // This gives ~1200-1400px of scroll travel, making the line move much slower and smoother
          const startTrigger = windowHeight * 0.95;
          const endTrigger = windowHeight * 0.1 - rect.height * 0.45;
          const scrollDistance = startTrigger - endTrigger;
          const rawProgress = (startTrigger - rect.top) / scrollDistance;
          const clamped = Math.min(Math.max(rawProgress, 0), 1);

          setScrollProgress(clamped);

          // Calculate current head point for the glowing laser tracer
          try {
            const currentDist = clamped * pathLength;
            if (pathRef.current) {
              const pt = pathRef.current.getPointAtLength(currentDist);
              setHeadPoint(pt);
            }
          } catch {
            // fallback
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathLength]);

  const strokeDashoffset = pathLength * (1 - scrollProgress);

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[80vh] min-h-[540px] max-h-[740px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#070d0a] my-8 sm:my-12 group select-none"
    >
      {/* 1. Fullscreen Background Image - Underneath content */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
        style={{
          objectPosition: item.objectPosition || 'center'
        }}
        loading="lazy"
      />

      {/* 2. Ambient Lighting Overlay (Darkens top-left for title clarity, leaves bottom bright & visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none" />

      {/* 3. Continuous Neon Green Curved Vector Line (slower, smooth speed) */}
      <svg
        viewBox="0 0 1200 600"
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`neon-glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Base Trail Guide */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Animated Neon Green Luminous Stroke - draws downward as user scrolls */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#92f7c3"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#neon-glow-${index})`}
          className="transition-all duration-75 ease-out"
        />

        {/* Glowing Head Tracer Dot moving along the curve */}
        {headPoint && scrollProgress > 0.02 && scrollProgress < 0.99 && (
          <g>
            <circle
              cx={headPoint.x}
              cy={headPoint.y}
              r="7"
              fill="#92f7c3"
              filter={`url(#neon-glow-${index})`}
              className="animate-pulse"
            />
            <circle
              cx={headPoint.x}
              cy={headPoint.y}
              r="3.5"
              fill="#ffffff"
            />
          </g>
        )}
      </svg>

      {/* 4. Minimalist Content Layer on Top of Background: ONLY THE TITLE */}
      <div className="relative z-20 w-full h-full p-6 sm:p-10 md:p-12 flex flex-col justify-start">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#ded0c1] font-['Fraunces'] tracking-wider uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] max-w-xl select-text">
          {item.title}
        </h3>
      </div>
    </div>
  );
}
