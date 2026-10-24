import { brandInfo } from '../data/brandData';

/**
 * Footer Component
 * Shared across all pages adhering to Rule 1 & 3 of quyTacAI
 */
export default function Footer({ onNavigate }) {
  const handleLinkClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060c08] border-t border-white/10 text-white pt-10 pb-8 sm:pt-16 sm:pb-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-white/10 items-start">
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 p-1 flex items-center justify-center">
                <img
                  src={brandInfo.logo}
                  alt="MIA COFFEE Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-['Fraunces'] font-bold tracking-wide">
                  {brandInfo.name}
                </span>
                <p className="text-[10px] sm:text-[11px] text-[#92f7c3] tracking-wider uppercase font-semibold">
                  {brandInfo.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/75 max-w-sm leading-relaxed">
              {brandInfo.description}
            </p>

            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <a
                href={brandInfo.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook MIA COFFEE"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#92f7c3] hover:text-[#012d1d] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a
                href={brandInfo.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chỉ đường trên Google Maps"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#92f7c3] hover:text-[#012d1d] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">near_me</span>
              </a>
              <a
                href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
                aria-label="Gọi điện thoại hotline"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#92f7c3] hover:text-[#012d1d] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">call</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links - Hidden on mobile as requested */}
          <div className="hidden md:block md:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#92f7c3] font-bold">
              Khám Phá
            </p>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-white transition-colors text-left"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('menu')}
                  className="hover:text-white transition-colors text-left"
                >
                  Menu cà phê & điểm tâm
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('space')}
                  className="hover:text-white transition-colors text-left"
                >
                  Không gian quán
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('recruitment')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cơ hội tuyển dụng
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Địa chỉ & Chỉ đường
                </button>
              </li>
              <li className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleLinkClick('admin')}
                  className="text-[#92f7c3]/80 hover:text-[#92f7c3] transition-colors text-left flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Đăng nhập Quản trị (CMS)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Practical Info & Operational Hours */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#92f7c3] font-bold">
              Thông Tin Phục Vụ
            </p>
            <div className="space-y-2.5 text-xs text-white/85">
              <p className="flex items-start gap-2">
                <span className="text-[#92f7c3]">📍</span>
                <span>{brandInfo.contact.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#92f7c3]">📞</span>
                <span>
                  Hotline:{' '}
                  <a
                    href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
                    className="text-[#92f7c3] font-semibold hover:underline"
                  >
                    {brandInfo.contact.hotlineDisplay}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#92f7c3]">⏰</span>
                <span>Mở cửa: {brandInfo.contact.openingHours}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#92f7c3]">🍳</span>
                <span>Điểm tâm sáng: {brandInfo.contact.breakfastHours}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#92f7c3]">🚗</span>
                <span>{brandInfo.contact.parkingNote}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-5 sm:pt-8 text-center text-[10px] sm:text-[11px] text-white/65">
          <p>© {new Date().getFullYear()} {brandInfo.name}. Cà Phê - Điểm Tâm Sáng.</p>
        </div>
      </div>
    </footer>
  );
}
