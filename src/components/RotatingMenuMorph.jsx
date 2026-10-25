import { useState, useEffect, useRef } from 'react';
import ImageWithFallback from './ImageWithFallback';
import { resolveAssetUrl } from '../utils/imageUrlHelper';

/**
 * RotatingMenuMorph Component
 * 5 Featured products arranged in a circle.
 * As user scrolls, they rotate and smoothly expand / bloom outward
 * into a 2-row grid: 3 products in row 1, 2 products in row 2.
 */
export default function RotatingMenuMorph({ products = [], onViewDetail }) {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [dims, setDims] = useState({
    isMobile: false,
    cardW: 245,
    cardH: 310,
    radius: 230,
    colSpacing: 270,
    rowSpacing: 325
  });

  // Take top 5 featured items
  const displayItems = products.slice(0, 5);

  // Responsive dimension updates
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDims({
          isMobile: true,
          cardW: 106,
          cardH: 150,
          radius: 110,
          colSpacing: 115,
          rowSpacing: 160
        });
      } else if (w < 1024) {
        setDims({
          isMobile: false,
          cardW: 195,
          cardH: 260,
          radius: 185,
          colSpacing: 215,
          rowSpacing: 275
        });
      } else {
        setDims({
          isMobile: false,
          cardW: 245,
          cardH: 310,
          radius: 230,
          colSpacing: 270,
          rowSpacing: 325
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll progress tracker
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionHeight = sectionRef.current.offsetHeight;
          const scrollDistance = sectionHeight - windowHeight;

          if (scrollDistance > 0) {
            // When top of section enters viewport to when it leaves
            const currentScroll = -rect.top;
            const rawProgress = currentScroll / scrollDistance;
            const clamped = Math.min(Math.max(rawProgress, 0), 1);
            setScrollProgress(clamped);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quadratic easeInOut for smooth, organic transition
  const easeProgress = (p) => {
    return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
  };

  const t = easeProgress(scrollProgress);
  // Entire circle spins by 180 degrees during scroll
  const rotationAngle = t * Math.PI;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] sm:min-h-[170vh] bg-[#070e0a] border-y border-white/10"
      id="menu-noi-bat"
    >
      {/* Sticky Viewport that holds the morphing animation in center */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-3 sm:px-4">
        {/* Layer 1: Cinematic Coffeehouse Atmospheric Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden morph-bg-layer">
          <img
            src={resolveAssetUrl('/images/menu-section-bg.jpg')}
            alt=""
            className="morph-bg-image w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] saturate-[1.15]"
            style={{
              transform: `scale(${1.02 + t * 0.04})`,
              transition: 'transform 0.2s ease-out'
            }}
          />

          {/* Layer 2: Seamless Top & Bottom Section Transitions */}
          <div className="morph-gradient-top absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070e0a] via-[#070e0a]/80 to-transparent" />
          <div className="morph-gradient-bottom absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070e0a] via-[#070e0a]/85 to-transparent" />

          {/* Layer 3: Radial Atmosphere Vignette & Warm Coffee Bar Lighting */}
          <div className="morph-radial-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,22,16,0.35)_0%,rgba(7,14,10,0.82)_100%)]" />

          {/* Ambient Warm Amber Light Flare (Edison bulb & warm wood warmth) */}
          <div className="morph-ambient-amber absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-[#d49755]/12 blur-[140px]" />

          {/* Fresh Mint Ambient Glow (Signature MIA Emerald) */}
          <div className="morph-ambient-mint absolute bottom-1/4 right-1/4 w-[450px] h-[350px] rounded-full bg-[#92f7c3]/8 blur-[120px]" />

          {/* Subtle Fine Starlight/Texture Grid for Luxury Feel */}
          <div className="morph-grid absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
        </div>

        {/* Morphing Arena Stage */}
        <div className="relative z-10 w-full max-w-5xl h-[330px] sm:h-[650px] flex items-center justify-center">
          {displayItems.map((product, idx) => {
            // 1. Coordinates in Circular Formation
            const baseAngle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
            const currentAngle = baseAngle + rotationAngle;
            const xCircle = dims.radius * Math.cos(currentAngle);
            const yCircle = dims.radius * Math.sin(currentAngle);

            // 2. Coordinates in 2-Row Grid (Row 1: 3 items, Row 2: 2 items)
            let xGrid = 0;
            let yGrid = 0;

            if (idx < 3) {
              // Top Row (indices 0, 1, 2)
              xGrid = (idx - 1) * dims.colSpacing;
              yGrid = -dims.rowSpacing / 2;
            } else {
              // Bottom Row (indices 3, 4 centered below)
              xGrid = idx === 3 ? -dims.colSpacing / 2 : dims.colSpacing / 2;
              yGrid = dims.rowSpacing / 2;
            }

            // 3. Interpolated Position
            const x = (1 - t) * xCircle + t * xGrid;
            const y = (1 - t) * yCircle + t * yGrid;
            const scale = (1 - t) * (dims.isMobile ? 0.85 : 0.88) + t * 1.0;
            const rotateDeg = (1 - t) * ((idx - 2) * 8);

            // Currency formatting
            const formattedPrice = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })
              .format(product.price)
              .replace('₫', 'đ');

            return (
              <div
                key={product.id || idx}
                style={{
                  width: `${dims.cardW}px`,
                  transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0) scale(${scale.toFixed(3)}) rotate(${rotateDeg.toFixed(1)}deg)`,
                  zIndex: idx === 1 ? 25 : 20
                }}
                className="absolute top-1/2 left-1/2 will-change-transform group cursor-pointer"
                onClick={() => onViewDetail && onViewDetail(product)}
              >
                <div className="morph-card bg-[#111c16]/95 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#92f7c3]/70 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_45px_rgba(146,247,195,0.25)] flex flex-col">
                  {/* Photo Area */}
                  <div className="morph-photo-bg relative aspect-[16/11] w-full overflow-hidden bg-[#070e0a]">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Subtle Gradient Overlay */}
                    <div className="morph-photo-overlay absolute inset-0 bg-gradient-to-t from-[#111c16] via-transparent to-transparent pointer-events-none" />

                    {/* Price Badge on photo (Clean, no top-left badges!) */}
                    <div className="morph-price-badge absolute bottom-2 right-2 bg-black/85 backdrop-blur-md text-[#92f7c3] font-bold px-2 py-0.5 rounded-full text-[11px] sm:text-xs border border-white/15 shadow">
                      {formattedPrice}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-['Fraunces'] text-white font-bold group-hover:text-[#92f7c3] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      {product.subName && (
                        <p className="text-[10px] text-white/75 italic line-clamp-1 mt-0.5 hidden sm:block">
                          {product.subName}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-white/75 uppercase tracking-wider font-medium">
                        Món Đặc Trưng
                      </span>
                      <span className="text-xs text-[#92f7c3] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
