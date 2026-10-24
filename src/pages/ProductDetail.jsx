import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { brandInfo } from '../data/brandData';

/**
 * ProductDetail Page Component
 * Dedicated storytelling & friendly showcase page for individual cafe items
 */
export default function ProductDetail({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servingPreference, setServingPreference] = useState('ice');
  const [sweetnessLevel, setSweetnessLevel] = useState('standard');

  useEffect(() => {
    let isMounted = true;

    async function loadProductDetail() {
      if (!productId) return;
      try {
        setLoading(true);
        const prod = await menuService.getProductById(productId);
        if (isMounted && prod) {
          setProduct(prod);

          // Load related products in the same category
          const allProds = await menuService.getProducts({
            categoryId: prod.categoryId || 'all'
          });
          if (isMounted) {
            setRelatedProducts(allProds.filter(p => p.id !== prod.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Đang chuẩn bị trang giới thiệu món nước..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 max-w-3xl mx-auto px-6 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 text-white/50 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
        </div>
        <h2 className="text-2xl font-['Fraunces'] font-bold text-white">
          Không tìm thấy món bạn đang tìm
        </h2>
        <p className="text-sm text-white/60">
          Món này có thể đã được cập nhật hoặc không còn trong thực đơn hiện tại của quán.
        </p>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('menu')}
          className="btn-primary"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Quay lại Thực Đơn</span>
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price).replace('₫', 'đ');

  // Kiểm tra xem món này có thuộc nhóm Điểm Tâm Sáng hay không
  const isBreakfast = Boolean(
    product.categoryId === 'breakfast' ||
    String(product.categoryId || '').toLowerCase().includes('diem-tam') ||
    String(product.category?.slug || '').toLowerCase().includes('breakfast') ||
    String(product.category?.slug || '').toLowerCase().includes('diem-tam') ||
    String(product.category?.slug || '').toLowerCase().includes('sang') ||
    String(product.category?.name || '').toLowerCase().includes('điểm tâm') ||
    String(product.category?.name || '').toLowerCase().includes('ăn sáng') ||
    String(product.subName || '').toLowerCase().includes('điểm tâm') ||
    String(product.subName || '').toLowerCase().includes('breakfast') ||
    (Array.isArray(product.tags) && product.tags.some(t => String(t).toLowerCase().includes('điểm tâm') || String(t).toLowerCase().includes('ăn sáng'))) ||
    String(product.name || '').toLowerCase().includes('bánh mì') ||
    String(product.name || '').toLowerCase().includes('ốp la') ||
    String(product.name || '').toLowerCase().includes('xôi') ||
    String(product.name || '').toLowerCase().includes('bò kho')
  );

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* ================= BREADCRUMB & BACK BUTTON ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('menu')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#92f7c3] hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Quay lại Thực Đơn Quán</span>
          </button>

          <nav className="flex items-center gap-2 text-xs text-white/70">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-white transition-colors"
            >
              Trang chủ
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('menu')}
              className="hover:text-white transition-colors"
            >
              Thực đơn
            </button>
            <span>/</span>
            <span className="text-[#92f7c3] font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>

        {/* ================= HERO SHOWCASE: IMAGE & ESSENTIAL INFO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Product Image Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c1410] border border-white/15 shadow-2xl group">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Ambient lighting overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#92f7c3] border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    {product.badge}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-[#1b4332]/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#92f7c3] border border-[#92f7c3]/30 flex items-center gap-1 shadow">
                    ⭐ Món Đặc Sắc MIA
                  </span>
                )}
              </div>

              {/* Status */}
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-red-900/90 text-white text-xs font-bold uppercase tracking-wider border border-red-500/40">
                    Tạm Hết Món Hôm Nay
                  </span>
                </div>
              )}
            </div>

            {/* Micro Highlights under image */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="material-symbols-outlined text-lg text-[#92f7c3] mb-1">
                  eco
                </span>
                <p className="text-[11px] text-white/70">100% Tự Nhiên</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="material-symbols-outlined text-lg text-[#92f7c3] mb-1">
                  local_fire_department
                </span>
                <p className="text-[11px] text-white/70">Pha Chế Mới</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="material-symbols-outlined text-lg text-[#92f7c3] mb-1">
                  workspace_premium
                </span>
                <p className="text-[11px] text-white/70">Chuẩn Vị Quán</p>
              </div>
            </div>
          </div>

          {/* Right: Detailed Narrative & Serving Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#1b4332] text-[#92f7c3] text-[11px] font-bold uppercase tracking-wider">
                  {product.subName || 'Món Ngon Tuyển Chọn'}
                </span>
                {product.tags && product.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Fraunces'] font-bold text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#92f7c3]">
                  {formattedPrice}
                </span>
                <span className="text-xs text-white/70 uppercase tracking-wider">
                  / Khẩu phần chuẩn
                </span>
              </div>
            </div>

            {/* Friendly introduction quote */}
            <div id="product-quote-box" className="p-5 rounded-2xl bg-gradient-to-r from-[#14201a] to-[#1c3026] border border-[#92f7c3]/30 shadow-md">
              <p className="text-sm text-white/90 leading-relaxed italic">
                "{product.fullDescription || product.description}"
              </p>
            </div>

            {/* Serving Customization (Chỉ hiển thị cho món nước, ẩn với điểm tâm sáng) */}
            {!isBreakfast && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#92f7c3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>Tùy Chọn Thưởng Thức Yêu Thích</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Đá / Nóng */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/85 font-semibold">Hình thức:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setServingPreference('ice')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          servingPreference === 'ice'
                            ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3] font-bold shadow'
                            : 'bg-white/5 text-white/85 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">ac_unit</span>
                        <span>Uống Lạnh (Đá)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setServingPreference('hot')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          servingPreference === 'hot'
                            ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3] font-bold shadow'
                            : 'bg-white/5 text-white/85 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">local_cafe</span>
                        <span>Uống Nóng</span>
                      </button>
                    </div>
                  </div>

                  {/* Độ ngọt */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/85 font-semibold">Mức độ ngọt / sữa:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'less', label: 'Ít ngọt' },
                        { id: 'standard', label: 'Chuẩn vị' },
                        { id: 'sweet', label: 'Ngọt béo' }
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setSweetnessLevel(lvl.id)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center border transition-all ${
                            sweetnessLevel === lvl.id
                              ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3] font-bold'
                              : 'bg-white/5 text-white/80 border-white/10 hover:text-white'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-white/10">
              <a
                href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
                className="btn-primary py-3.5 px-6 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Gọi Hotline Đặt Món: {brandInfo.contact.hotlineDisplay}</span>
              </a>

              <a
                href={brandInfo.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary py-3.5 px-6 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">near_me</span>
                <span>Ghé Quán Thưởng Thức</span>
              </a>
            </div>

            <p className="text-[11px] text-white/70 italic flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#92f7c3]">info</span>
              <span>
                Thức uống được pha chế trực tiếp tại quầy bar khi bạn tới quán hoặc gọi món mang đi.
              </span>
            </p>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS (CÙNG DANH MỤC) ================= */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-['Fraunces'] font-bold text-white">
                  Món Ngon Bạn Cũng Sẽ Thích
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Khám phá thêm những hương vị tuyệt vời khác trong cùng nhóm thực đơn
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('menu')}
                className="text-xs text-[#92f7c3] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  onViewDetail={(p) => {
                    if (onNavigate) {
                      onNavigate('product-detail', p.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
