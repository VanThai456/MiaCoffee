import { useState, useEffect } from 'react';
import { adminProductsService } from '../services/adminProductsService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * CategoriesManager Component
 * Manages Supabase table: `categories`
 */
export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminProductsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const generateSlug = (text) => {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const openAdd = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: categories.length + 1,
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      sort_order: cat.sort_order || 0,
      is_active: cat.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (cat) => {
    try {
      const updated = !cat.is_active;
      await adminProductsService.updateCategory(cat.id, { is_active: updated });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: updated } : c));
      triggerToast(`Đã ${updated ? 'hiển thị' : 'ẩn'} danh mục "${cat.name}"`);
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${cat.name}"?`)) return;
    try {
      await adminProductsService.deleteCategory(cat.id);
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      triggerToast(`Đã xóa danh mục "${cat.name}"`);
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (editingCat) {
        await adminProductsService.updateCategory(editingCat.id, formData);
        triggerToast(`Đã cập nhật danh mục "${formData.name}"`);
      } else {
        await adminProductsService.createCategory(formData);
        triggerToast(`Đã thêm danh mục mới "${formData.name}"`);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert("Lỗi lưu danh mục: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-24 right-8 z-50 bg-[#92f7c3] text-[#012d1d] px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-['Fraunces'] text-white font-bold">
            Quản Lý Danh Mục
          </h2>
          <p className="text-xs text-white/60">
            Bảng <code>categories</code> trên Supabase
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Thêm Danh Mục</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải danh mục..." />
      ) : categories.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-3xl bg-[#14201a] border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Tên Danh Mục</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Thứ Tự</th>
                  <th className="py-3.5 px-5 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white text-sm">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-5 text-white/60 font-mono text-[11px]">
                      {cat.slug || cat.id}
                    </td>
                    <td className="py-3.5 px-5 text-white/70">
                      {cat.sort_order || 0}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          cat.is_active !== false
                            ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]/30'
                            : 'bg-red-950/60 text-red-400 border-red-500/30'
                        }`}
                      >
                        {cat.is_active !== false ? 'Hiển thị' : 'Đang ẩn'}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 inline-flex items-center justify-center transition-colors"
                        title="Sửa danh mục"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 inline-flex items-center justify-center transition-colors"
                        title="Xóa danh mục"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#14201a] border border-white/10 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    <p className="text-[11px] text-white/50 font-mono mt-0.5">
                      Slug: {cat.slug || cat.id}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/70 text-[10px] border border-white/10">
                    Thứ tự: {cat.sort_order || 0}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                      cat.is_active !== false
                        ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]/30'
                        : 'bg-red-950/60 text-red-400 border-red-500/30'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{cat.is_active !== false ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 inline-flex items-center justify-center transition-colors"
                      title="Xóa danh mục"
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
          Chưa có danh mục nào. Hãy bấm "Thêm Danh Mục" để tạo mới.
        </div>
      )}

      {/* Modal Add / Edit Category (Responsive & Safe Centering) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-md my-auto bg-[#14201a] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-[#14201a] border-b border-white/10 flex items-center justify-between shrink-0">
              <h3 className="text-base sm:text-lg font-['Fraunces'] text-white font-bold">
                {editingCat ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors text-base"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                    Tên Danh Mục <span className="text-[#92f7c3]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name,
                        slug: !editingCat ? generateSlug(name) : prev.slug
                      }));
                    }}
                    placeholder="Ví dụ: Cà phê pha phin"
                    className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] focus:ring-1 focus:ring-[#92f7c3] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-white/90 font-semibold text-xs">
                      Mã Định Danh (Slug)
                    </label>
                    <span className="text-[10px] text-white/40">Tự tạo theo tên (dùng cho URL)</span>
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vi-du: ca-phe-pha-phin"
                    className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-semibold mb-1.5 text-xs">
                    Thứ Tự Hiển Thị (sort_order)
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full bg-[#0c1410] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#92f7c3] transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#92f7c3] accent-[#92f7c3] cursor-pointer"
                  />
                  <label htmlFor="catActive" className="text-white/80 font-medium cursor-pointer text-xs">
                    Kích hoạt hiển thị trên menu website
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
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
                  {submitting ? 'Đang lưu...' : 'Lưu Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
