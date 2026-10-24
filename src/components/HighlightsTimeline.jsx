import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

/**
 * Build a smooth S-curve connecting the centers of the alternating circular frames.
 * Generates an elegant flowing line from Circle 0 -> Circle 1 -> Circle 2 -> Circle 3.
 */
function buildCirclesConnectingPath(points) {
  if (!points || points.length < 2) return '';
  let d = `M ${points[0].cx.toFixed(1)} ${points[0].cy.toFixed(1)} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dy = p2.cy - p1.cy;
    // Cubic bezier curve with vertical inflection
    const c1x = p1.cx;
    const c1y = p1.cy + dy * 0.5;
    const c2x = p2.cx;
    const c2y = p2.cy - dy * 0.5;
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.cx.toFixed(1)} ${p2.cy.toFixed(1)} `;
  }
  return d;
}

export default function HighlightsTimeline({ items }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const circleRefs = useRef([]);

  const [connectingPath, setConnectingPath] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 2800 });
  const [pathLength, setPathLength] = useState(3000);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headPoint, setHeadPoint] = useState(null);

  // Recalculate circle positions within the container
  const updateGeometry = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const W = containerRect.width;
    const H = containerRect.height;

    const points = circleRefs.current
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          cx: r.left + r.width / 2 - containerRect.left,
          cy: r.top + r.height / 2 - containerRect.top
        };
      });

    if (points.length === items.length && W > 0 && H > 0) {
      setContainerSize({ width: W, height: H });
      const newPath = buildCirclesConnectingPath(points);
      setConnectingPath(newPath);
    }
  }, [items.length]);

  useLayoutEffect(() => {
    updateGeometry();
  }, [updateGeometry]);

  // Listen to window resize & image load
  useEffect(() => {
    const handleResize = () => updateGeometry();
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(() => updateGeometry());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [updateGeometry]);

  // Update total path length when path changes
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) setPathLength(len);
      } catch {
        // fallback
      }
    }
  }, [connectingPath]);

  // Global scroll listener for continuous animated laser stroke
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const containerRect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Start drawing when top reaches 80% viewport, finish when bottom reaches 20%
          const startTrigger = windowHeight * 0.80;
          const endTrigger = windowHeight * 0.20;

          const totalScrollDistance = containerRect.height + (startTrigger - endTrigger);
          const currentScroll = startTrigger - containerRect.top;
          const rawProgress = currentScroll / totalScrollDistance;
          const clamped = Math.min(Math.max(rawProgress, 0), 1);

          setScrollProgress(clamped);

          try {
            const currentDist = clamped * pathLength;
            if (pathRef.current && currentDist > 0) {
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
    <div ref={containerRef} className="relative py-6 sm:py-12">
      {/* ================= SVG CONNECTING NEON RIVER LINE ================= */}
      {connectingPath && (
        <svg
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        >
          <defs>
            <filter id="circle-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Guide Line */}
          <path
            d={connectingPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glowing Animated Neon Stroke */}
          <path
            ref={pathRef}
            d={connectingPath}
            fill="none"
            stroke="#92f7c3"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#circle-neon-glow)"
            className="transition-all duration-75 ease-out"
          />

          {/* Glowing Laser Pulse Bead */}
          {headPoint && scrollProgress > 0.01 && scrollProgress < 0.995 && (
            <g>
              <circle
                cx={headPoint.x}
                cy={headPoint.y}
                r="8"
                fill="#92f7c3"
                filter="url(#circle-neon-glow)"
                className="animate-pulse"
              />
              <circle
                cx={headPoint.x}
                cy={headPoint.y}
                r="4"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>
      )}

      {/* ================= 4 ALTERNATING CIRCULAR HIGHLIGHT ITEMS ================= */}
      <div className="relative z-10 space-y-16 sm:space-y-28 lg:space-y-36">
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={item.id || idx}
              className={`relative flex flex-col items-center gap-8 md:gap-14 lg:gap-20 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              } group`}
            >
              {/* 1. KHUNG HÌNH TRÒN (CIRCULAR FRAME) */}
              <div className="relative shrink-0 flex items-center justify-center">
                {/* Floating Number Badge */}
                <div
                  className={`absolute -top-2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#07130c] border-2 border-[#92f7c3] text-[#92f7c3] font-['Fraunces'] font-black text-xs sm:text-sm flex items-center justify-center shadow-[0_0_20px_rgba(146,247,195,0.4)] ${
                    isEven ? '-left-2 sm:left-2' : '-right-2 sm:right-2'
                  }`}
                >
                  {item.number || `0${idx + 1}`}
                </div>

                {/* Circular Frame Outer Halo */}
                <div
                  ref={(el) => { circleRefs.current[idx] = el; }}
                  className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full p-2 sm:p-2.5 bg-gradient-to-tr from-[#92f7c3]/40 via-white/10 to-[#92f7c3]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(146,247,195,0.18)] group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_60px_rgba(146,247,195,0.35)] transition-all duration-700 aspect-square shrink-0"
                >
                  {/* Circular Image Container - Seamless full-bleed circle */}
                  <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white/30 shadow-inner flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                      style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        objectFit: 'cover',
                        objectPosition: '50% 50%'
                      }}
                      loading="lazy"
                      onLoad={updateGeometry}
                    />
                  </div>
                </div>
              </div>

              {/* 2. TIÊU ĐỀ & THÔNG TIN (INFO SIDE) */}
              <div className="flex-1 space-y-3 sm:space-y-4 max-w-xl text-center md:text-left">
                {/* Main Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Fraunces'] tracking-wide uppercase">
                  {item.title}
                </h3>

                {/* Subtitle */}
                {item.subtitle && (
                  <p className="text-xs sm:text-sm lg:text-base text-[#92f7c3] font-medium italic">
                    {item.subtitle}
                  </p>
                )}

                {/* Divider Line */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-[#92f7c3] to-transparent mx-auto md:mx-0" />

                {/* Description */}
                {item.description && (
                  <p className="text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}

                {/* Features Bullets */}
                {item.features && item.features.length > 0 && (
                  <div className="space-y-2 pt-2 text-xs sm:text-sm text-white/90">
                    {item.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2.5 justify-center md:justify-start"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#92f7c3]/15 text-[#92f7c3] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
