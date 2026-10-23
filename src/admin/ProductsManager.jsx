import { useState, useEffect } from 'react';
import { adminProductsService } from '../services/adminProductsService';
import { adminAuditService } from '../services/adminAuditService';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * ProductsManager Component
 * Manages Supabase table: `products`
 */
export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: 30000,
    description: '',
    image_url: '',
    is_featured: false,
    is_available: true,
    sort_order: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        adminProductsService.getCategories(),
        adminProductsService.getProducts({ categoryId: selectedCat, search })
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat, search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      price: 30000,
      description: '',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvhs2-M692R2XcR4OkUJdoWcMcPBk7jE4vfYj-W_DrQpFY-Q4oxI0losAV5KPusvomMZD2g16c8DmQVaUlANzoKOgYskca_CcOblRwZMzV64zVwjjYUntD2dGBQF3zT3Zr4RGSeD27cavXTBtSO4RkDmfWhUmyO8UvmL6tFTCvuqdpUa9W4wfftgFR1b0QAxTr2iGjl2P7sK8uUcwHi17y5GywgZBkPzjpznkEsgbDBaW3x40DJNMr',
      is_featured: false,
      is_available: true,
      sort_order: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category_id: prod.category_id || prod.category?.id || '',
      price: prod.price,
      description: prod.description || '',
      image_url: prod.image_url || '',
      is_featured: Boolean(prod.is_featured),
      is_available: prod.is_available !== false,
      sort_order: prod.sort_order || 0
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (prod) => {
    try {
      const updatedStatus = !prod.is_available;
      await adminProductsService.toggleProductAvailability(prod.id, updatedStatus);
      await adminAuditService.logAction({
        action: 'UPDATE_PRODUCT_AVAILABILITY',
        entityType: 'products',
        entityId: prod.id,
        details: { name: prod.name, is_available: updatedStatus }
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_available: updatedStatus } : p));
      showToast(`Đã ${updatedStatus ? 'mở bán lại' : 'báo tạm hết món'} "${prod.name}"`);
    } catch (err) {
      alert("Không thể cập nhật trạng thái: " + err.message);
    }
  };

  const handleToggleFeatured = async (prod) => {
    try {
      const updatedFeatured = !prod.is_featured;
      await adminProductsService.toggleProductFeatured(prod.id, updatedFeatured);
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_featured: updatedFeatured } : p));
      showToast(`Đã ${updatedFeatured ? 'đánh dấu đặc sắc' : 'bỏ đặc sắc'} "${prod.name}"`);
    } catch (err) {
      alert("Không thể cập nhật trạng thái: " + err.message);
    }
  };

  const handleDelete = async (prod) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${prod.name}" khỏi cơ sở dữ liệu?`)) return;
    try {
      await adminProductsService.deleteProduct(prod.id);
      await adminAuditService.logAction({
        action: 'DELETE_PRODUCT',
        entityType: 'products',
        entityId: prod.id,
        details: { name: prod.name }
      });
      setProducts(prev => prev.filter(p => p.id !== prod.id));
      showToast(`Đã xóa món "${prod.name}"`);
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Vui lòng điền tên món và giá bán.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingProduct) {
        await adminProductsService.updateProduct(editingProduct.id, formData);
        await adminAuditService.logAction({
          action: 'UPDATE_PRODUCT',
          entityType: 'products',
          entityId: editingProduct.id,
          details: formData
        });
        showToast(`Đã cập nhật món "${formData.name}"`);
      } else {
        await adminProductsService.createProduct(formData);
        await adminAuditService.logAction({
          action: 'CREATE_PRODUCT',
          entityType: 'products',
          details: formData
        });
        showToast(`Đã thêm mới món "${formData.name}"`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert("Lỗi lưu dữ liệu: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      const res = await adminProductsService.seedMockDataToSupabase();
      showToast(`Đã đồng bộ ${res.productsCount} món ăn & ${res.categoriesCount} danh mục lên Supabase thành công!`);
      await loadData();
    } catch (err) {
      alert("Lỗi nạp dữ liệu: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-8 z-50 bg-[#92f7c3] text-[#012d1d] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] text-white font-bold">
            Quản Lý Thực Đơn Đồ Uống
          </h2>
          <p className="text-xs text-white/60">
            Dữ liệu kết nối trực tiếp với Supabase Database ({products.length} món)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedData}
            className="py-2.5 px-3.5 sm:px-4 rounded-xl sm:rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#92f7c3] text-xs font-bold transition-all border border-[#92f7c3]/30 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-[#92f7c3]/10"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>{seeding ? 'Đang nạp lên Supabase...' : 'Nạp 12 Món & Danh Mục Lên Supabase'}</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="btn-primary py-2.5 px-4 sm:px-5 text-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Thêm Món Mới</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#14201a] border border-white/10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên món..."
            className="w-full bg-[#0c1410] pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#92f7c3] transition-colors"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-[#0c1410] px-3.5 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#92f7c3] transition-colors"
          >
            <option value="all">Tất cả danh mục ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Content */}
      {loading ? (
        <LoadingSpinner text="Đang tải dữ liệu sản phẩm..." />
      ) : products.length > 0 ? (
        <>
          {/* Desktop & Tablet Table View (hidden on small mobile screens) */}
          <div className="hidden md:block rounded-3xl bg-[#14201a] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Ảnh</th>
                    <th className="py-3.5 px-4">Tên Món</th>
                    <th className="py-3.5 px-4">Danh Mục</th>
                    <th className="py-3.5 px-4">Giá Bán</th>
                    <th className="py-3.5 px-4 text-center">Đặc Sắc</th>
                    <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Image */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                          <ImageWithFallback
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Name & Desc */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white text-sm">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-white/50 truncate">
                          {prod.description || 'Chưa có mô tả'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/80 border border-white/10 text-[11px]">
                          {prod.category?.name || categories.find(c => c.id === prod.category_id)?.name || 'Chung'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#92f7c3]">
                        {new Intl.NumberFormat('vi-VN').format(prod.price)}đ
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prod)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors mx-auto ${
                            prod.is_featured
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-white/20 hover:text-white/60'
                          }`}
                          title="Bật/Tắt món nổi bật"
                        >
                          <span className="material-symbols-outlined text-base">
                            {prod.is_featured ? 'star' : 'star_border'}
                          </span>
                        </button>
                      </td>

                      {/* Available Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailable(prod)}
                          className={`px-2.5 py-1 rounded-full font-semibold text-[11px] border transition-all ${
                            prod.is_available
                              ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]/30'
                              : 'bg-red-950/60 text-red-400 border-red-500/30'
                          }`}
                        >
                          {prod.is_available ? 'Đang bán' : 'Hết món'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white inline-flex items-center justify-center transition-colors"
                          title="Sửa món"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod)}
                          className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 inline-flex items-center justify-center transition-colors"
                          title="Xóa món"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (optimized for phones) */}
          <div className="block md:hidden space-y-3">
            {products.map(prod => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-[#14201a] border border-white/10 space-y-3 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <ImageWithFallback
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="font-bold text-white text-sm leading-snug">
                        {prod.name}
                      </h4>
                      <span className="font-bold text-[#92f7c3] text-sm shrink-0">
                        {new Intl.NumberFormat('vi-VN').format(prod.price)}đ
                      </span>
                    </div>

                    <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                      {prod.description || 'Chưa có mô tả'}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10 text-[10px]">
                        {prod.category?.name || categories.find(c => c.id === prod.category_id)?.name || 'Chung'}
                      </span>
                      {prod.is_featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] flex items-center gap-0.5 font-semibold">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          Đặc sắc
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Action Controls */}
                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Available Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(prod)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] border transition-all flex items-center gap-1.5 ${
                        prod.is_available
                          ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]/30'
                          : 'bg-red-950/60 text-red-400 border-red-500/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{prod.is_available ? 'Đang bán' : 'Hết món'}</span>
                    </button>

                    {/* Featured Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(prod)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        prod.is_featured
                          ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                          : 'text-white/40 bg-white/5 border-white/10 hover:text-white'
                      }`}
                      title="Bật/Tắt đặc sắc"
                    >
                      <span className="material-symbols-outlined text-base">
                        {prod.is_featured ? 'star' : 'star_border'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod)}
                      className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 inline-flex items-center justify-center transition-colors"
                      title="Xóa món"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10 text-white/50 text-xs">
          Không có sản phẩm nào khớp với tìm kiếm.
        </div>
      )}

      {/* Add / Edit Modal (Completely Responsive & Protected Against Top Cutoff) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-xl my-auto bg-[#14201a] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="px-5 sm:px-6 py-4 bg-[#14201a] border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-['Playfair_Display'] text-white font-bold">
                  {editingProduct ? 'Chỉnh Sửa Món' : 'Thêm Món Mới'}
                </h3>
                <p className="text-[11px] text-white/50">
                  {editingProduct
                    ? 'Cập nhật thông tin món ăn / thức uống'
                    : 'Điền thông tin và lưu vào cơ sở dữ liệu quán'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors text-base"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Tên Món Field - positioned cleanly below header */}
                <div>
                  <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                    Tên Món <span className="text-[#92f7c3]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Cà Phê Muối Kem Béo"
                    className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] focus:ring-1 focus:ring-[#92f7c3] transition-all"
                  />
                </div>

                {/* Danh Mục & Giá Bán */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                      Danh Mục
                    </label>
                    <select
                      value={formData.category_id || ''}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] transition-all"
                    >
                      <option value="" className="bg-[#14201a]">
                        -- Chọn danh mục --
                      </option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#14201a]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-[10px] text-amber-300/80 mt-1">
                        Chưa có danh mục. Bạn có thể sang mục "Danh Mục" để tạo trước.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                      Giá Bán (VNĐ) <span className="text-[#92f7c3]">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] transition-all"
                    />
                  </div>
                </div>

                {/* Đường Dẫn Ảnh & Live Thumbnail Preview */}
                <div>
                  <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                    Đường Dẫn Ảnh (image_url)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] transition-all"
                    />
                    {formData.image_url && (
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-white/15 shrink-0" title="Xem trước ảnh">
                        <ImageWithFallback
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mô Tả Món */}
                <div>
                  <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                    Mô Tả Món
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Hương vị đặc trưng, thành phần nguyên liệu, cách thưởng thức..."
                    className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] resize-none transition-all"
                  />
                </div>

                {/* Checkboxes: Món nổi bật & Còn hàng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#92f7c3] accent-[#92f7c3] cursor-pointer"
                    />
                    <div>
                      <span className="text-white font-medium block text-xs">Món đặc sắc (Featured)</span>
                      <span className="text-white/40 text-[10px]">Hiển thị tại khu vực nổi bật</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4 rounded text-[#92f7c3] accent-[#92f7c3] cursor-pointer"
                    />
                    <div>
                      <span className="text-white font-medium block text-xs">Trạng thái phục vụ</span>
                      <span className="text-white/40 text-[10px]">
                        {formData.is_available ? 'Đang mở bán' : 'Tạm hết món'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="px-5 sm:px-6 py-3.5 bg-[#14201a] border-t border-white/10 flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 sm:py-2.5 sm:px-6 font-bold text-xs"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Vào Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
