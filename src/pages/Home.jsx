import { useState, useEffect } from 'react';
import { brandInfo } from '../data/brandData';
import { menuService } from '../services/menuService';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Home Page Component
 * Landing page combining cinematic hero, visual highlights, signature products,
 * space preview, operational information, and recruitment teaser.
 */
export default function Home({ onNavigate }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const products = await menuService.getProducts({ featuredOnly: true });
        if (isMounted) {
          setFeaturedProducts(products);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="animate-fade-in">
      {/* ================= 1. CINEMATIC HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Full-Bleed High-Res Cinematic Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={brandInfo.heroImage}
            alt="MIA COFFEE thực tế về đêm rực rỡ và thoáng mát"
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
          />
          {/* Ambient Dark Vignettes & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101915] via-[#101915]/50 to-[#0a1510]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#101915]/30 to-[#070e0a]/80" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 my-auto py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#92f7c3] text-xs uppercase tracking-widest font-semibold mx-auto">
            <span className="material-symbols-outlined text-sm">nest_eco_leaf</span>
            <span>Không gian sân vườn & máy lạnh rộng rãi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-['Playfair_Display'] text-white font-bold leading-tight tracking-tight">
            {brandInfo.name}
            <br />
            <span className="italic font-normal text-[#92f7c3] text-3xl sm:text-5xl md:text-6xl">
              {brandInfo.tagline}
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            {brandInfo.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="btn-primary"
            >
              <span className="material-symbols-outlined text-base">restaurant_menu</span>
              <span>Xem Menu Thực Đơn</span>
            </button>

            <a
              href={brandInfo.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span className="material-symbols-outlined text-base">near_me</span>
              <span>Chỉ Đường Đến Quán</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#gioi-thieu"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-white flex flex-col items-center gap-1 text-xs tracking-widest uppercase transition-colors"
        >
          <span>Khám phá</span>
          <span className="material-symbols-outlined animate-bounce text-sm">
            keyboard_arrow_down
          </span>
        </a>
      </section>

      {/* ================= 2. GIỚI THIỆU & 4 SENSORY PHOTOGRAPHY CARDS ================= */}
      <section className="section-pad max-w-7xl mx-auto px-6 lg:px-12" id="gioi-thieu">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <SectionHeading
            icon="storefront"
            badge="Chào mừng bạn đến với MIA COFFEE"
            title="Không Gian Rộng Rãi"
            highlight="Thân Quen & Mộc Mạc"
            description="Quán cà phê và điểm tâm sáng phục vụ hàng ngày. Nơi lý tưởng để khởi đầu ngày mới tràn đầy năng lượng, họp mặt bạn bè hay quây quần cùng gia đình."
          />

          {/* Quick stats showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {brandInfo.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-2xl font-bold text-[#92f7c3] font-['Playfair_Display']">
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/60 tracking-wider uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Sensory Photography Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandInfo.highlights.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-500 hover:border-[#92f7c3]/50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold">
                  {item.subtitle}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <h3 className="text-xl font-['Playfair_Display'] text-white group-hover:text-[#92f7c3] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. MENU NỔI BẬT (SIGNATURE ITEMS) ================= */}
      <section className="section-pad bg-[#0d1612] border-y border-white/10" id="menu-noi-bat">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <SectionHeading
            center
            icon="coffee"
            badge="Thực Đơn Được Yêu Thích"
            title="Cà Phê Rang Mộc &"
            highlight="Điểm Tâm Sáng"
            description="Đồ uống pha chế đậm đà từ nguyên liệu tự nhiên chọn lọc cùng các món ăn sáng nóng sốt, thơm ngon mỗi ngày."
            className="mb-14"
          />

          {/* Loading or Grid */}
          {loading ? (
            <LoadingSpinner text="Đang tải món nổi bật..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={(p) => onNavigate('product-detail', p.id)}
                />
              ))}
            </div>
          )}

          {/* Bottom Action for Full Menu */}
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
              </div>
              <div>
                <h4 className="text-base text-white font-bold">
                  Khám Phá Menu Đầy Đủ Của MIA COFFEE
                </h4>
                <p className="text-xs text-white/70">
                  Hơn 30+ món cà phê, trà hoa quả tươi mát, sinh tố và điểm tâm sáng thơm ngon.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="btn-primary shrink-0"
            >
              <span>Xem Toàn Bộ Thực Đơn</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 4. KHÔNG GIAN QUÁN (BENTO LOOKBOOK PREVIEW) ================= */}
      <section className="section-pad max-w-7xl mx-auto px-6 lg:px-12" id="khong-gian">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeading
            icon="photo_camera"
            badge="Không Gian Quán"
            title="Ghé Thăm Không Gian"
            highlight="MIA COFFEE"
            description="Không gian mở rộng rãi, thoáng mát, chỗ ngồi thoải mái cho mọi khoảnh khắc chuyện trò và làm việc."
          />

          <button
            type="button"
            onClick={() => onNavigate('space')}
            className="text-xs font-bold uppercase tracking-wider text-[#92f7c3] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Xem chi tiết không gian & tiện ích</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[250px]">
          {/* Main Large Card */}
          <div
            onClick={() => onNavigate('space')}
            className="cursor-pointer md:col-span-8 md:row-span-2 group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl"
          >
            <img
              src={brandInfo.heroImage}
              alt="Toàn cảnh MIA COFFEE về đêm"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="px-2.5 py-1 rounded bg-[#92f7c3] text-[#012d1d] text-[10px] uppercase font-bold tracking-wider">
                  Khuôn Viên Rộng Lớn • Đậu Ô Tô Thoải Mái
                </span>
                <h3 className="text-2xl font-['Playfair_Display'] text-white mt-2">
                  Đa Dạng Khu Vực Cho Mọi Lứa Tuổi
                </h3>
                <p className="text-xs text-white/70 max-w-md">
                  Khu sân vườn rợp bóng cây, khu vỉa hè thoáng mát, hồ cá to thư thái, cầu trượt xích đu cho bé và 2 phòng lạnh học tập riêng biệt. Bãi đậu xe ô tô rộng có bảo vệ trông giữ an toàn.
                </p>
              </div>
              <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#92f7c3] group-hover:text-[#012d1d] transition-all">
                <span className="material-symbols-outlined text-lg">fullscreen</span>
              </span>
            </div>
          </div>

          {/* Side Card 1: Hồ Cá */}
          <div
            onClick={() => onNavigate('space')}
            className="cursor-pointer md:col-span-4 md:row-span-1 group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAavs3BoaSNZ3jP6O6kv0ImbMrJ7yrcSOcdewHBBcUSfCXrl9nkfjY3NOrZrSxMUxcKR6TYFVgvoSU_AooWR3Qf77HE7_SD8ObX2NKR-XDO-1350BPGy6K0NTO1p4SKY2UBB33fcHKLNNTHmJBQvbcze7VXsAIBd4SCQGXHnhyz4HdNbdz3yXbyCo3-8G6koLIQO-DnbBoe72WQNw9hHAz4Jy0jU6CnzpDZ8DEZ5uIbYoPDFS9Sa3CQ"
              alt="Khu Vực Hồ Cá"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold">
                Nhiều Loại Cá To Đẹp
              </p>
              <p className="text-base font-['Playfair_Display'] text-white">
                Hồ Cá Cảnh Thư Thái
              </p>
            </div>
          </div>

          {/* Side Card 2: 2 Phòng Lạnh */}
          <div
            onClick={() => onNavigate('space')}
            className="cursor-pointer md:col-span-4 md:row-span-1 group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKXJgdmhHnLXaXltr0y80lpPhakfha-dzwB84tejQRqeQR9ZESkVAWDXwQCTjytrdFyzcSuBa0ioICW-lGfbPUxPt8GsgD62tZKctiJwsOnR_y1HF_F4mKM0z53rsjDWrVyI9dYs_05UA69lo0D1zAdLGKKmGcFm_nRpu9RQ-pvb5n80ErP-Zr671tdPlOaUTEcxatBwvce3WMzVX5Nq3Yn6QFSYvIaX5jnfaKNhujSuqoqzNbr1D-"
              alt="2 Phòng Lạnh Học Hành & Họp Bàn"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold">
                Học Hành & Họp Bàn
              </p>
              <p className="text-base font-['Playfair_Display'] text-white">
                2 Phòng Lạnh Yên Tĩnh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. THÔNG TIN QUÁN & BẢN ĐỒ CHỈ ĐƯỜNG ================= */}
      <section className="section-pad relative overflow-hidden bg-gradient-to-b from-[#101915] via-[#0b1410] to-[#060c08]" id="thong-tin">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient glow in background */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#92f7c3]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <SectionHeading
                  icon="pin_drop"
                  badge="Thông Tin Quán"
                  title="Ghé Thăm"
                  highlight="MIA COFFEE"
                  description="Chào đón bạn đến thưởng thức cà phê nguyên chất, ăn điểm tâm sáng và thư giãn trong không gian thoáng đãng, dễ chịu. Chúng tôi luôn sẵn sàng phục vụ!"
                />

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={brandInfo.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <span className="material-symbols-outlined text-base">navigation</span>
                    <span>Mở Google Maps Chỉ Đường</span>
                  </a>

                  <a
                    href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
                    className="btn-secondary"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Hotline: {brandInfo.contact.hotlineDisplay}</span>
                  </a>
                </div>
              </div>

              {/* Info Details Box */}
              <div className="lg:col-span-5 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/15 space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/20 p-1">
                    <img
                      src={brandInfo.logo}
                      alt="Logo MIA COFFEE"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#92f7c3] uppercase tracking-widest font-bold">
                      {brandInfo.tagline}
                    </p>
                    <h3 className="text-xl font-['Playfair_Display'] text-white">
                      {brandInfo.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5 text-white/90">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#92f7c3] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-base">location_on</span>
                    </span>
                    <div>
                      <p className="font-semibold text-white">Địa điểm quán</p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {brandInfo.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 text-white/90">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#92f7c3] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-base">schedule</span>
                    </span>
                    <div>
                      <p className="font-semibold text-white">Giờ mở cửa phục vụ</p>
                      <p className="text-xs text-white/70">
                        {brandInfo.contact.openingHours} (Điểm tâm sáng từ 06:00)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 text-white/90">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#92f7c3] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-base">local_parking</span>
                    </span>
                    <div>
                      <p className="font-semibold text-white">Bãi đỗ xe</p>
                      <p className="text-xs text-white/70">
                        {brandInfo.contact.parkingNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#92f7c3]">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Không cần đặt chỗ trước - Quán luôn hân hạnh đón tiếp bạn!</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. TUYỂN DỤNG CALLOUT ================= */}
      <section className="py-12 border-t border-white/10 bg-[#09120e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#92f7c3] font-bold">
              Cơ Hội Nghề Nghiệp
            </span>
            <h4 className="text-xl font-['Playfair_Display'] text-white">
              Gia Nhập Đội Ngũ MIA COFFEE
            </h4>
            <p className="text-xs text-white/60">
              Tuyển dụng nhân viên pha chế & phục vụ năng động, nhiệt tình với mức đãi ngộ hấp dẫn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('recruitment')}
            className="px-7 py-3 rounded-full bg-white/10 hover:bg-[#92f7c3] hover:text-[#012d1d] text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Ứng Tuyển Ngay
          </button>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
