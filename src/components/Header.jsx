import { useState, useEffect } from 'react';
import { brandInfo } from '../data/brandData';

/**
 * Header Navigation Component
 * Responsive navigation with mobile menu drawer and active state
 */
export default function Header({ activePage, onNavigate, theme = 'dark', onToggleTheme }) {
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
            <span className="text-xl font-['Fraunces'] text-white font-bold tracking-wider group-hover:text-[#92f7c3] transition-colors">
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

        {/* Desktop Action Buttons: Theme Toggle & Chỉ đường */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Switcher Button (Icon Only) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Chuyển sang giao diện ban đêm' : 'Chuyển sang giao diện sáng hơn'}
            title={theme === 'light' ? 'Đổi sang giao diện Ban Đêm' : 'Đổi sang giao diện Sáng'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm ${
              theme === 'light'
                ? 'bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-200'
                : 'bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg transition-transform duration-300"
              style={{ color: theme === 'light' ? '#d97706' : '#92f7c3' }}
            >
              {theme === 'light' ? 'wb_sunny' : 'dark_mode'}
            </span>
          </button>

          <a
            href={brandInfo.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#012d1d' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#92f7c3] !text-[#012d1d] hover:bg-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#006c48]/20 transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-base" style={{ color: '#012d1d' }}>near_me</span>
            <span style={{ color: '#012d1d' }}>Chỉ đường</span>
          </a>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Theme Toggle Button (Icon Only) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Chuyển sang giao diện ban đêm' : 'Chuyển sang giao diện sáng hơn'}
            title={theme === 'light' ? 'Đổi sang giao diện Ban Đêm' : 'Đổi sang giao diện Sáng'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
              theme === 'light'
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white/5 border-white/15 text-[#92f7c3]'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'light' ? 'wb_sunny' : 'dark_mode'}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
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

          {/* Theme Switcher in Mobile Drawer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/70">Chế độ giao diện:</span>
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'light' ? 'Đổi sang giao diện Ban Đêm' : 'Đổi sang giao diện Sáng'}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white/10 text-[#92f7c3] border-white/15'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {theme === 'light' ? 'wb_sunny' : 'dark_mode'}
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={brandInfo.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#012d1d' }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#92f7c3] !text-[#012d1d] text-xs font-bold uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base" style={{ color: '#012d1d' }}>near_me</span>
              <span style={{ color: '#012d1d' }}>Mở bản đồ chỉ đường</span>
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
