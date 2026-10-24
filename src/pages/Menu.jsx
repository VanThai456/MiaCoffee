import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { brandInfo } from '../data/brandData';

/**
 * Menu Page Component
 * Strictly complies with Rule 4 & 6 of quyTacAI:
 * - Dynamic data loaded via menuService
 * - Interactive category tabs & instant search
 * - ProductCard props usage
 * - Responsive layout
 */
export default function Menu({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewDetail = (product) => {
    if (onNavigate) {
      onNavigate('product-detail', product.id);
    } else {
      setSelectedProduct(product);
    }
  };

  // Load categories
  useEffect(() => {
    menuService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load products based on category & search
  useEffect(() => {
    let isMounted = true;
    async function fetchMenu() {
      try {
        setLoading(true);
        const data = await menuService.getProducts({
          categoryId: selectedCategory,
          search: searchQuery
        });
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchMenu();
    }, 150); // Small debounce

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <SectionHeading
            center
            icon="coffee"
            badge="Thực Đơn MIA COFFEE"
            title="Hương Vị Mộc Mạc &"
            highlight="Điểm Tâm Sáng"
            description="Tuyển chọn những ly cà phê rang mộc thơm nồng, trà trái cây thanh mát cùng các món điểm tâm sáng nóng sốt, phục vụ mỗi ngày."
          />

          {/* Quick Notice Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b4332]/60 border border-[#92f7c3]/30 text-xs text-[#92f7c3]">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Điểm tâm sáng phục vụ nóng sốt từ 06:00 đến 11:30 hàng ngày</span>
          </div>
        </div>

        {/* ================= SEARCH & CATEGORY CONTROLS ================= */}
        <div className="bg-[#14201a] p-4 sm:p-6 rounded-3xl border border-white/10 shadow-xl mb-10 space-y-5">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên món (Cà phê sữa, Bạc xỉu, Bánh mì chảo, Trà đào...)"
              className="w-full bg-[#0a1510] pl-12 pr-10 py-3.5 rounded-2xl border border-white/15 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-[#92f7c3] focus:ring-1 focus:ring-[#92f7c3] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-xs"
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3] shadow-md shadow-[#92f7c3]/20 font-bold scale-105'
                      : 'bg-white/5 text-white/85 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RESULTS HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-['Fraunces'] text-white font-bold">
              Danh Sách Món
            </h3>
            <span className="text-xs text-white/75 font-medium">
              ({products.length} món)
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#92f7c3] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* ================= PRODUCTS GRID OR EMPTY STATE ================= */}
        {loading ? (
          <LoadingSpinner text="Đang cập nhật thực đơn..." />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search_off"
            title="Không tìm thấy món phù hợp"
            description={
              searchQuery
                ? `Không có kết quả nào khớp với "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
                : "Hiện tại danh mục này đang được cập nhật."
            }
            actionText="Xem tất cả thực đơn"
            onAction={handleClearFilters}
          />
        )}

        {/* ================= INFO CALLOUT FOOTER ================= */}
        <div id="menu-bottom-callout" className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14201a] to-[#1a2f26] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">local_cafe</span>
            </div>
            <div>
              <h4 className="text-base text-white font-bold">
                100% Cà Phê Mộc Rang Xay Nguyên Bản
              </h4>
              <p className="text-xs text-white/85 max-w-xl leading-relaxed">
                MIA COFFEE cam kết chỉ sử dụng cà phê hạt mộc nguyên chất, không hương liệu tẩm ướp hay chất tạo sánh, giữ trọn hậu vị ngọt thanh và an toàn cho sức khỏe.
              </p>
            </div>
          </div>

          <a
            href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#012d1d] text-xs font-bold uppercase tracking-wider transition-all border border-white/20 whitespace-nowrap"
          >
            Hotline Quán: {brandInfo.contact.hotlineDisplay}
          </a>
        </div>
      </div>

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
