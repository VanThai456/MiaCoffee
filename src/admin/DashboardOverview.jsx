import { useState, useEffect } from 'react';
import { adminProductsService } from '../services/adminProductsService';
import { adminGalleryService } from '../services/adminGalleryService';
import { adminMessagesService } from '../services/adminMessagesService';
import { isSupabaseConfigured } from '../services/supabaseClient';

/**
 * DashboardOverview Component
 * Summary telemetry for Coffee Shop CMS
 */
export default function DashboardOverview({ onNavigateTab }) {
  const [stats, setStats] = useState({
    productsCount: 0,
    galleryImagesCount: 0,
    unreadMessagesCount: 0,
    categoriesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        setLoading(true);
        const [products, galleryImages, messages, categories] = await Promise.all([
          adminProductsService.getProducts(),
          adminGalleryService.getGalleryImages(),
          adminMessagesService.getMessages(),
          adminProductsService.getCategories()
        ]);

        if (isMounted) {
          setStats({
            productsCount: products.length,
            galleryImagesCount: galleryImages.length,
            unreadMessagesCount: messages.filter(m => m.status === 'unread').length,
            categoriesCount: categories.length
          });
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14201a] border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#92f7c3] animate-pulse" />
            <span className="text-xs text-[#92f7c3] uppercase tracking-wider font-bold">
              {isSupabaseConfigured ? "Đang Kết Nối Supabase Live" : "Chế Độ Dữ Liệu Demo"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-['Fraunces'] text-white font-bold">
            Chào Mừng Đến Với MIA COFFEE CMS
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl font-light">
            Quản trị tập trung thực đơn đồ uống, danh mục món ăn, đơn ứng tuyển nhân sự và tin nhắn phản hồi của khách hàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('products')}
            className="btn-primary text-xs py-3 px-5 flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Thêm Món Mới</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Sản phẩm */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-6 rounded-3xl bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/50 transition-all cursor-pointer shadow-lg space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Món Đang Bán
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">coffee</span>
            </div>
          </div>
          <div className="text-3xl font-bold font-['Fraunces'] text-white">
            {loading ? '...' : stats.productsCount}
          </div>
        </div>

        {/* Card 2: Danh mục */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="p-6 rounded-3xl bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/50 transition-all cursor-pointer shadow-lg space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Danh Mục Món
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">category</span>
            </div>
          </div>
          <div className="text-3xl font-bold font-['Fraunces'] text-white">
            {loading ? '...' : stats.categoriesCount}
          </div>
        </div>

        {/* Card 3: Thư viện ảnh quán */}
        <div
          onClick={() => onNavigateTab('gallery')}
          className="p-6 rounded-3xl bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/50 transition-all cursor-pointer shadow-lg space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Ảnh Thư Viện
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center group-hover:scale-110 transition-transform border border-[#92f7c3]/20">
              <span className="material-symbols-outlined text-xl">collections</span>
            </div>
          </div>
          <div className="text-3xl font-bold font-['Fraunces'] text-white">
            {loading ? '...' : stats.galleryImagesCount}
          </div>
        </div>

        {/* Card 4: Tin nhắn chưa đọc */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-6 rounded-3xl bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/50 transition-all cursor-pointer shadow-lg space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Tin Nhắn Chưa Đọc
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
          </div>
          <div className="text-3xl font-bold font-['Fraunces'] text-white">
            {loading ? '...' : stats.unreadMessagesCount}
          </div>
        </div>
      </div>

    </div>
  );
}
