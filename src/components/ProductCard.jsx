import ImageWithFallback from './ImageWithFallback';

/**
 * ProductCard Component
 * Strictly obeys Rule 4 of quyTacAI:
 * - Does NOT hardcode product details, prices or images
 * - All content received via props
 * - Displays price formatted in VND
 * - Includes fallback image handling and interactive action
 */
export default function ProductCard({ product, onViewDetail }) {
  if (!product) return null;

  const {
    id,
    name,
    subName,
    description,
    price,
    image,
    badge,
    tags,
    isAvailable = true
  } = product;

  // Format currency
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'đ');

  return (
    <article
      id={`product-${id}`}
      className="group relative flex flex-col bg-[#14201a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#92f7c3]/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
    >
      {/* Product Image Area - Fitted to image, zero black gap, compact height */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c1410] cursor-pointer"
        onClick={() => onViewDetail && onViewDetail(product)}
      >
        <ImageWithFallback
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Subtle Ambient Dark Gradient on bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14201a]/70 via-transparent to-transparent pointer-events-none" />

        {/* Badge */}
        {badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#92f7c3] border border-white/15 flex items-center gap-1 shadow">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            {badge}
          </span>
        )}

        {/* Price Tag Overlay - neatly anchored directly on the photo */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#0a1510]/90 backdrop-blur-md text-[#92f7c3] font-bold px-2.5 py-0.5 rounded-full text-xs sm:text-sm border border-white/15 shadow">
          {formattedPrice}
        </div>

        {/* Availability status overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-red-900/80 text-white text-[11px] font-semibold uppercase tracking-wider border border-red-500/30">
              Tạm hết món
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details - Compact, well proportioned */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <h3
              onClick={() => onViewDetail && onViewDetail(product)}
              className="text-sm sm:text-base font-['Playfair_Display'] text-white font-bold group-hover:text-[#92f7c3] transition-colors line-clamp-1 cursor-pointer"
            >
              {name}
            </h3>
          </div>

          {subName && (
            <p className="text-[10px] sm:text-[11px] text-white/50 tracking-wide italic mb-1.5 line-clamp-1">
              {subName}
            </p>
          )}

          <p className="text-[11px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer: Tags & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          {tags && tags.length > 0 ? (
            <span className="text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded truncate max-w-[120px]">
              {tags[0]}
            </span>
          ) : (
            <span className="text-[10px] text-white/40">MIA Signature</span>
          )}

          <button
            type="button"
            onClick={() => onViewDetail && onViewDetail(product)}
            className="text-xs font-semibold text-[#92f7c3] hover:text-white flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
            aria-label={`Xem chi tiết ${name}`}
          >
            <span>Chi tiết</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
