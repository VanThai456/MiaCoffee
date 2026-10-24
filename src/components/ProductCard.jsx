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
        <div className="card-ambient-overlay absolute inset-0 bg-gradient-to-t from-[#14201a]/70 via-transparent to-transparent pointer-events-none" />


        {/* Price Tag Overlay - neatly anchored directly on the photo */}
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 bg-[#0a1510]/90 backdrop-blur-md text-[#92f7c3] font-bold px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-sm border border-white/15 shadow">
          {formattedPrice}
        </div>

        {/* Availability status overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-900/80 text-white text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider border border-red-500/30">
              Tạm hết món
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details - Compact, well proportioned */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-1 mb-0.5">
            <h3
              onClick={() => onViewDetail && onViewDetail(product)}
              className="text-xs sm:text-base font-['Fraunces'] text-white font-bold group-hover:text-[#92f7c3] transition-colors line-clamp-1 cursor-pointer"
            >
              {name}
            </h3>
          </div>

          {subName && (
            <p className="text-[9px] sm:text-[11px] text-white/70 tracking-wide italic mb-1 line-clamp-1 hidden sm:block">
              {subName}
            </p>
          )}

          <p className="text-[10px] sm:text-xs text-white/80 line-clamp-2 leading-tight sm:leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer: Tags & Action Button */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between gap-1">
          {tags && tags.length > 0 ? (
            <span className="text-[9px] sm:text-[10px] text-white/75 bg-white/5 px-1.5 py-0.5 rounded truncate max-w-[65px] sm:max-w-[120px]">
              {tags[0]}
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] text-white/65">MIA</span>
          )}

          <button
            type="button"
            onClick={() => onViewDetail && onViewDetail(product)}
            className="text-[10px] sm:text-xs font-semibold text-[#92f7c3] hover:text-white flex items-center gap-0.5 sm:gap-1 transition-colors px-1 py-0.5 rounded hover:bg-white/5"
            aria-label={`Xem chi tiết ${name}`}
          >
            <span>Chi tiết</span>
            <span className="material-symbols-outlined text-xs sm:text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
}
