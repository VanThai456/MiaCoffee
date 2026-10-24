import { useState, useEffect } from 'react';
import { brandInfo } from '../data/brandData';
import { menuService } from '../services/menuService';
import SectionHeading from '../components/SectionHeading';
import HighlightsTimeline from '../components/HighlightsTimeline';
import RotatingMenuMorph from '../components/RotatingMenuMorph';
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
      {/* ================= 1. HERO SECTION (Fullscreen & Minimalist) ================= */}
      <section className="hero-banner relative w-full h-[58vh] min-h-[420px] max-h-[500px] sm:h-[85vh] sm:min-h-[560px] lg:h-screen lg:min-h-screen overflow-hidden flex flex-col justify-end">
        {/* Background Photo - Positioned nicely so the cafe front, sign and ambiance are centered */}
        <div className="absolute inset-0 z-0">
          <img
            src={brandInfo.heroImage}
            alt="MIA COFFEE không gian quán thực tế"
            className="w-full h-full object-cover object-[center_28%] sm:object-[center_35%]"
          />
          {/* Smooth bottom gradient overlay for crystal clear text readability */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Bottom-Left Minimalist Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-10 lg:px-12 pb-7 sm:pb-14 md:pb-20">
          <div className="max-w-xl space-y-2 sm:space-y-3">
            <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl font-black !text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] font-['Fraunces'] leading-none">
              {brandInfo.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-base !text-white/95 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg leading-relaxed">
              Cà phê rang mộc nguyên chất & Điểm tâm sáng trong không gian thoáng đãng
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-md bg-[#eef867] hover:bg-[#e4ee58] text-[#0a1510] font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem Thực Đơn</span>
                <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. 4 ĐIỂM NỔI BẬT: KHUNG HÌNH TRÒN SO LE XEN KẼ & ĐƯỜNG DẪN NGHỆ THUẬT ================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="gioi-thieu">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <SectionHeading
            title="Những Điểm Nổi Bật"
            highlight="Tại MIA COFFEE"
          />
        </div>

        {/* 4 Alternating Circular Frames with flowing neon laser river */}
        <HighlightsTimeline items={brandInfo.highlights} />
      </section>

      {/* ================= 3. MENU NỔI BẬT: 5 MÓN XOAY TRÒN & GIÃN THÀNH 2 HÀNG ================= */}
      {loading ? (
        <section className="py-24 bg-[#070e0a] flex items-center justify-center border-y border-white/10" id="menu-noi-bat">
          <LoadingSpinner text="Đang tải món nổi bật..." />
        </section>
      ) : (
        <RotatingMenuMorph
          products={featuredProducts}
          onViewDetail={(p) => onNavigate('product-detail', p.id)}
        />
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 auto-rows-[190px] sm:auto-rows-[250px]">
          {/* Main Large Card */}
          <div
            onClick={() => onNavigate('space')}
            className="cursor-pointer md:col-span-8 md:row-span-2 group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl"
          >
            <img
              src={brandInfo.heroImage}
              alt="Toàn cảnh MIA COFFEE về đêm"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between">
              <div>
                <h3 className="text-lg sm:text-2xl font-['Fraunces'] text-white">
                  Đa Dạng Khu Vực Cho Mọi Lứa Tuổi
                </h3>
                <p className="text-[11px] sm:text-xs text-white/85 max-w-md line-clamp-2 sm:line-clamp-none">
                  Khu sân vườn rợp bóng cây, khu vỉa hè thoáng mát, hồ cá to thư thái, cầu trượt xích đu cho bé và 2 phòng lạnh học tập riêng biệt. Bãi đậu xe ô tô rộng có bảo vệ trông giữ an toàn.
                </p>
              </div>
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#92f7c3] group-hover:text-[#012d1d] transition-all shrink-0 ml-2">
                <span className="material-symbols-outlined text-base sm:text-lg">fullscreen</span>
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
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold">
                Nhiều Loại Cá To Đẹp
              </p>
              <p className="text-base font-['Fraunces'] text-white">
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
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold">
                Học Hành & Họp Bàn
              </p>
              <p className="text-base font-['Fraunces'] text-white">
                2 Phòng Lạnh Yên Tĩnh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. THÔNG TIN QUÁN & BẢN ĐỒ CHỈ ĐƯỜNG ================= */}
      <section className="section-pad relative overflow-hidden bg-gradient-to-b from-[#101915] via-[#0b1410] to-[#060c08]" id="thong-tin">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="thong-tin-card p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
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
              <div className="thong-tin-box lg:col-span-5 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/15 space-y-6">
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
                    <h3 className="text-xl font-['Fraunces'] text-white">
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
                      <p className="text-xs text-white/85 leading-relaxed">
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
                      <p className="text-xs text-white/85">
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
                      <p className="text-xs text-white/85">
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
      <section className="pt-8 pb-14 sm:pt-10 sm:pb-20 max-w-7xl mx-auto px-5 sm:px-10 lg:px-12" id="tuyen-dung-callout">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#173024] via-[#14201a] to-[#1a2f24] border border-[#92f7c3]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-bold">
              Cơ Hội Nghề Nghiệp
            </span>
            <h4 className="text-xl sm:text-2xl font-['Fraunces'] text-white font-bold">
              Gia Nhập Đội Ngũ MIA COFFEE
            </h4>
            <p className="text-xs sm:text-sm text-white/85 max-w-xl">
              Tuyển dụng nhân viên pha chế & phục vụ năng động, nhiệt tình với ca làm linh hoạt và mức đãi ngộ hấp dẫn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('recruitment')}
            className="px-7 py-3.5 rounded-full bg-[#92f7c3] hover:bg-white text-[#012d1d] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0"
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
