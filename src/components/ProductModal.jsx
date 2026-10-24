import { useEffect } from 'react';
import ImageWithFallback from './ImageWithFallback';

/**
 * ProductModal Component
 * Shows complete culinary/drink details, serving instructions and ingredients
 */
export default function ProductModal({ product, onClose }) {
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!product) return null;

  const {
    name,
    subName,
    fullDescription,
    description,
    price,
    image,
    badge,
    servingType,
    ingredients,
    tags
  } = product;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'đ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-2xl bg-[#121d18] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black flex items-center justify-center transition-all border border-white/10"
          aria-label="Đóng cửa sổ chi tiết"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Hero Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#0a1510] overflow-hidden">
            <ImageWithFallback
              src={image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="modal-photo-overlay absolute inset-0 bg-gradient-to-t from-[#121d18] via-transparent to-transparent opacity-90 pointer-events-none" />

            {badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#92f7c3] text-[#012d1d] text-xs font-bold uppercase tracking-wider shadow">
                {badge}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header: Title & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-['Fraunces'] text-white font-bold">
                  {name}
                </h2>
                {subName && (
                  <p className="text-sm text-[#92f7c3] font-medium tracking-wide mt-1">
                    {subName}
                  </p>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#92f7c3] sm:text-right">
                {formattedPrice}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-white/75 font-bold">
                Mô tả hương vị
              </h4>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                {fullDescription || description}
              </p>
            </div>

            {/* Structured Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-white/75 uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#92f7c3]">tune</span>
                  Hình thức phục vụ
                </span>
                <p className="text-white font-medium pl-5">
                  {servingType || "Dùng trực tiếp tại quán / Mang đi"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white/75 uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#92f7c3]">eco</span>
                  Nguyên liệu tuyển chọn
                </span>
                <p className="text-white/90 font-medium pl-5">
                  {ingredients || "Nguyên liệu tự nhiên, không hương liệu độc hại"}
                </p>
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/5 text-white/85 border border-white/10 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span className="material-symbols-outlined text-base text-[#92f7c3]">info</span>
                <span>Phục vụ tươi mới mỗi ngày tại MIA COFFEE</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#92f7c3] text-[#012d1d] hover:bg-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
