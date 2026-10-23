import { useState, useEffect } from 'react';
import { brandInfo } from '../data/brandData';

/**
 * Header Navigation Component
 * Responsive navigation with mobile menu drawer and active state
 */
export default function Header({ activePage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'menu', label: 'Menu đồ uống' },
    { id: 'space', label: 'Không gian quán' },
    { id: 'recruitment', label: 'Tuyển dụng' },
    { id: 'contact', label: 'Liên hệ' }
  ];

  const handleLinkClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08120e]/90 backdrop-blur-md shadow-xl border-b border-white/10 py-3'
          : 'bg-[#0a1510]/70 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center w-full">
        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 group-hover:border-[#92f7c3] transition-colors">
            <img
              src={brandInfo.logo}
              alt="MIA COFFEE Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-['Playfair_Display'] text-white font-bold tracking-wider group-hover:text-[#92f7c3] transition-colors">
              {brandInfo.name}
            </span>
            <span className="text-[10px] text-[#92f7c3] tracking-widest uppercase font-medium">
              {brandInfo.tagline}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {navItems.map((item) => {
            const isActive = activePage === item.id || (item.id === 'menu' && activePage === 'product-detail');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`transition-all pb-1 ${
                  isActive
                    ? 'text-[#92f7c3] border-b-2 border-[#92f7c3] font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button: Chỉ đường / Maps */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={brandInfo.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#92f7c3] text-[#012d1d] hover:bg-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#006c48]/20 transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-base">near_me</span>
            <span>Chỉ đường</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
          aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[#0a1510]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = activePage === item.id || (item.id === 'menu' && activePage === 'product-detail');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center justify-between text-left py-2.5 px-4 rounded-xl text-sm ${
                    isActive
                      ? 'bg-[#1b4332] text-[#92f7c3] font-bold'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="material-symbols-outlined text-base">check</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={brandInfo.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#92f7c3] text-[#012d1d] text-xs font-bold uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">near_me</span>
              <span>Mở bản đồ chỉ đường</span>
            </a>

            <a
              href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/15"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Hotline: {brandInfo.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
