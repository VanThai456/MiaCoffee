import { useState, useEffect } from 'react';
import { spaceService } from '../services/spaceService';
import SectionHeading from '../components/SectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageWithFallback from '../components/ImageWithFallback';
import { brandInfo } from '../data/brandData';

/**
 * Space Page Component
 * Showcases the cafe environment, seating zones, amenities, and visual lookbook
 */
export default function Space() {
  const [zones, setZones] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSpaceData() {
      try {
        setLoading(true);
        const [zonesData, amenitiesData, galleryData] = await Promise.all([
          spaceService.getZones(),
          spaceService.getAmenities(),
          spaceService.getGallery({ category: galleryFilter })
        ]);
        if (isMounted) {
          setZones(zonesData);
          setAmenities(amenitiesData);
          setGallery(galleryData);
        }
      } catch (err) {
        console.error("Failed to load space data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSpaceData();
    return () => { isMounted = false; };
  }, [galleryFilter]);

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ================= 1. HEADER HERO ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionHeading
            center
            icon="photo_camera"
            badge="Không Gian Đa Khu Vực"
            title="Khám Phá Khuôn Viên Rộng Lớn"
            highlight="MIA COFFEE"
            description="Khuôn viên quán rộng lớn hiếm có, thiết kế nhiều khu vực riêng biệt phù hợp cho mọi lứa tuổi từ trẻ nhỏ, học sinh sinh viên đến gia đình và người lớn tuổi. Có bãi đậu ô tô rộng rãi và bảo vệ trông giữ an ninh chu đáo."
          />
        </div>

        {/* ================= 2. ZONES SHOWCASE (6 KHU VỰC) ================= */}
        <div className="mb-12">
          <SectionHeading
            center
            icon="grid_view"
            badge="Chi Tiết Phân Khu"
            title="6 Khu Vực Trải Nghiệm"
            highlight="Đặc Sắc"
            description="Lựa chọn không gian phù hợp với tâm trạng và nhu cầu của bạn mỗi ngày."
            className="mb-12"
          />
        </div>

        {loading ? (
          <LoadingSpinner text="Đang tải dữ liệu không gian..." />
        ) : (
          <div className="space-y-16 mb-24">
            {zones.map((zone, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={zone.id}
                  id={zone.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#14201a] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-xl ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Zone Image */}
                  <div className={`lg:col-span-7 overflow-hidden rounded-2xl aspect-[16/10] bg-[#0c1410] relative group ${
                    isEven ? 'lg:order-2' : ''
                  }`}>
                    <ImageWithFallback
                      src={zone.image}
                      alt={zone.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {zone.targetAudience && (
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] font-semibold text-[#92f7c3] flex items-center gap-1.5 shadow-lg">
                        <span className="material-symbols-outlined text-sm">person</span>
                        <span>{zone.targetAudience}</span>
                      </div>
                    )}
                  </div>

                  {/* Zone Info */}
                  <div className={`lg:col-span-5 space-y-5 ${isEven ? 'lg:order-1' : ''}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#92f7c3]/15 text-[#92f7c3] text-[11px] font-bold uppercase tracking-wider border border-[#92f7c3]/30">
                      <span className="material-symbols-outlined text-sm">groups</span>
                      <span>Quy mô: {zone.capacity}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-['Playfair_Display'] text-white font-bold leading-tight">
                      {zone.name}
                    </h3>

                    <p className="text-xs text-[#92f7c3] font-medium tracking-wide uppercase">
                      {zone.tagline}
                    </p>

                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      {zone.description}
                    </p>

                    {/* Features checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {zone.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                          <span className="material-symbols-outlined text-sm text-[#92f7c3]">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 3. AMENITIES GRID ================= */}
        <div className="mb-24">
          <SectionHeading
            center
            icon="task_alt"
            badge="Tiện Nghi Chu Đáo"
            title="Dịch Vụ & Tiện Ích"
            highlight="Tại Quán"
            description="Mỗi chi tiết đều được chăm chút kỹ lưỡng để mang lại cho bạn trải nghiệm thuận tiện và thoải mái nhất."
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#92f7c3]/40 transition-all hover:-translate-y-1 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h4 className="text-base font-bold text-white font-['Playfair_Display']">
                  {item.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. PHOTO LOOKBOOK GALLERY ================= */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <SectionHeading
              icon="collections"
              badge="Góc Nhìn Thực Tế"
              title="Thư Viện Ảnh"
              highlight="MIA COFFEE"
              description="Những khoảnh khắc chân thực ghi lại không gian, con người và thức uống mỗi ngày."
            />

            {/* Gallery Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Tất cả ảnh' },
                { id: 'parking', label: 'Bãi đỗ xe' },
                { id: 'garden', label: 'Sân vườn' },
                { id: 'sidewalk', label: 'Vỉa hè' },
                { id: 'pond', label: 'Hồ cá' },
                { id: 'kids', label: 'Vui chơi trẻ em' },
                { id: 'indoor', label: 'Phòng lạnh' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setGalleryFilter(btn.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    galleryFilter === btn.id
                      ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3] font-bold'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer shadow-lg"
              >
                <ImageWithFallback
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-white">
                      {photo.title}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direction CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1b4332] to-[#0d1612] border border-[#92f7c3]/30 text-center space-y-6 shadow-2xl">
          <div className="max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-['Playfair_Display'] text-white font-bold">
              Bạn Muốn Trực Tiếp Trải Nghiệm Không Gian?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              MIA COFFEE luôn mở cửa từ 06:00 đến 22:00 tất cả các ngày trong tuần. Không cần đặt bàn trước, bạn chỉ việc ghé quán và chọn cho mình góc ngồi ưng ý nhất!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={brandInfo.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span className="material-symbols-outlined text-base">near_me</span>
              <span>Chỉ Đường Bằng Google Maps</span>
            </a>

            <a
              href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
              className="btn-secondary"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Gọi Hotline: {brandInfo.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#121d18] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-[#14201a] border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-['Playfair_Display'] text-white font-bold">
                  {activePhoto.title}
                </h4>
                <p className="text-xs text-[#92f7c3] uppercase tracking-wider mt-0.5">
                  Không Gian Thực Tế MIA COFFEE
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="px-5 py-2 rounded-full bg-white/10 text-white text-xs font-semibold uppercase hover:bg-white/20"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
