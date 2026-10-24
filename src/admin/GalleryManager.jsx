import { useState, useEffect } from 'react';
import { adminGalleryService } from '../services/adminGalleryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageWithFallback from '../components/ImageWithFallback';
import { cleanGoogleMapsImageUrl } from '../utils/imageUrlHelper';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả ảnh' },
  { id: 'parking', label: 'Bãi đỗ xe' },
  { id: 'garden', label: 'Sân vườn' },
  { id: 'sidewalk', label: 'Vỉa hè' },
  { id: 'pond', label: 'Hồ cá' },
  { id: 'kids', label: 'Vui chơi trẻ em' },
  { id: 'indoor', label: 'Phòng lạnh' }
];

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activePreview, setActivePreview] = useState(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('garden');
  const [formFile, setFormFile] = useState(null);
  const [formUrl, setFormUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'

  useEffect(() => {
    let isMounted = true;
    async function fetchImages() {
      try {
        setLoading(true);
        const data = await adminGalleryService.getGalleryImages({ category: selectedCategory });
        if (isMounted) {
          setImages(data);
        }
      } catch (err) {
        console.error("Lỗi tải thư viện ảnh:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFile(file);
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
    }
  };

  const handleOpenModal = () => {
    setFormTitle('');
    setFormCategory('garden');
    setFormFile(null);
    setFormUrl('');
    setPreviewSrc('');
    setInputMode('file');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Vui lòng nhập tên/mô tả bức ảnh.");
      return;
    }

    let finalImageUrl = formUrl.trim();

    if (inputMode === 'file') {
      if (!formFile) {
        alert("Vui lòng chọn file ảnh từ máy tính.");
        return;
      }
      try {
        setUploading(true);
        finalImageUrl = await adminGalleryService.uploadImage(formFile);
      } catch (err) {
        alert("Lỗi tải ảnh lên: " + err.message);
        setUploading(false);
        return;
      }
    } else {
      if (!finalImageUrl) {
        alert("Vui lòng dán đường dẫn link ảnh.");
        return;
      }
    }

    try {
      setUploading(true);
      const newImg = await adminGalleryService.addImage({
        title: formTitle,
        category: formCategory,
        imageUrl: finalImageUrl
      });

      setImages(prev => [newImg, ...prev]);
      setIsModalOpen(false);
      showToastMsg("Đã tải ảnh lên thư viện thành công!");
    } catch (err) {
      alert("Lỗi lưu ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imgId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bức ảnh này khỏi thư viện?")) {
      return;
    }
    try {
      await adminGalleryService.deleteImage(imgId);
      setImages(prev => prev.filter(item => String(item.id) !== String(imgId)));
      showToastMsg("Đã xóa ảnh khỏi thư viện.");
    } catch (err) {
      alert("Lỗi xóa ảnh: " + err.message);
    }
  };

  const sqlScript = `-- Chạy script này trong SQL Editor của Supabase để tạo bảng thư viện ảnh:
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật phân quyền RLS cho phép xem công khai và quản trị ảnh
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert gallery" ON gallery_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update gallery" ON gallery_images FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete gallery" ON gallery_images FOR DELETE USING (true);`;

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-24 right-8 z-50 bg-[#92f7c3] text-[#012d1d] px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-['Fraunces'] text-white font-bold flex items-center gap-2">
            <span>Thư Viện Ảnh Quán</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b4332] text-[#92f7c3] font-sans font-semibold">
              {images.length} ảnh
            </span>
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Quản lý kho ảnh không gian quán. Ảnh sau khi tải lên sẽ hiển thị ngay tại mục Lookbook của trang <strong>Không Gian Quán</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">code</span>
            <span>{showSqlGuide ? "Ẩn SQL Schema" : "Hướng dẫn Supabase"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenModal}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-lg"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>Tải Ảnh Mới Lên</span>
          </button>
        </div>
      </div>

      {/* SQL Script Accordion Guide */}
      {showSqlGuide && (
        <div className="p-5 rounded-2xl bg-[#0c1410] border border-[#92f7c3]/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#92f7c3] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">database</span>
              <span>Cấu trúc bảng Supabase: <code>gallery_images</code></span>
            </h4>
            <span className="text-[11px] text-white/50">
              Chỉ cần chạy 1 lần trong SQL Editor của Supabase
            </span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Bạn <strong>KHÔNG CẦN sửa bảng <code>applications</code></strong>. Thay vào đó, hãy tạo bảng mới <code>gallery_images</code> bằng đoạn mã SQL dưới đây:
          </p>
          <pre className="p-3.5 rounded-xl bg-black/60 text-[#92f7c3] text-xs font-mono overflow-x-auto select-all border border-white/10">
            {sqlScript}
          </pre>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3] font-bold shadow'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner text="Đang tải thư viện ảnh..." />
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#14201a] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 text-white/40 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">photo_library</span>
          </div>
          <h3 className="text-lg font-bold text-white font-['Fraunces']">
            Chưa có hình ảnh nào trong mục này
          </h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Hãy nhấn nút "Tải Ảnh Mới Lên" phía trên để bổ sung những góc ảnh đẹp của quán.
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            <span>Tải Ảnh Đầu Tiên</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map(img => {
            const catObj = CATEGORIES.find(c => c.id === img.category);
            return (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/50 transition-all shadow-lg flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c1410] cursor-pointer"
                  onClick={() => setActivePreview(img)}
                >
                  <ImageWithFallback
                    src={img.image || img.image_url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[11px] text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                      <span>Xem phóng to</span>
                    </span>
                  </div>

                  {/* Category Pill on Image */}
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 text-[10px] font-bold text-[#92f7c3]">
                    {catObj?.label || img.category}
                  </div>
                </div>

                {/* Info & Action */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate" title={img.title}>
                      {img.title}
                    </h4>
                    <p className="text-[10px] text-white/50 truncate mt-0.5">
                      {new Date(img.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/70 text-red-400 hover:text-white flex items-center justify-center shrink-0 border border-red-500/20 transition-all"
                    title="Xóa ảnh này"
                    aria-label="Xóa ảnh này"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1612] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-['Fraunces'] text-white">
                  Tải Ảnh Lên Thư Viện
                </h3>
                <p className="text-xs text-white/60">
                  Ảnh sẽ hiển thị công khai tại trang Không Gian Quán
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Input Source Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 block">
                  Phương thức tải ảnh:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070e0a] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setInputMode('file')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      inputMode === 'file'
                        ? 'bg-[#92f7c3] text-[#012d1d] font-bold shadow'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Tải từ máy tính
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('url')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      inputMode === 'url'
                        ? 'bg-[#92f7c3] text-[#012d1d] font-bold shadow'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Dán link ảnh URL
                  </button>
                </div>
              </div>

              {/* File Input */}
              {inputMode === 'file' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/80 block">
                    Chọn tệp hình ảnh (JPG, PNG, WebP):
                  </label>
                  <div className="relative border-2 border-dashed border-white/20 hover:border-[#92f7c3]/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#070e0a]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previewSrc ? (
                      <div className="space-y-3">
                        <img
                          src={previewSrc}
                          alt="Preview"
                          className="h-36 mx-auto rounded-xl object-cover shadow"
                        />
                        <p className="text-xs text-[#92f7c3] font-medium">
                          Nhấn để chọn ảnh khác
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="material-symbols-outlined text-4xl text-white/40">
                          cloud_upload
                        </span>
                        <p className="text-xs text-white/80 font-medium">
                          Kéo thả hoặc nhấn vào đây để chọn ảnh từ máy tính
                        </p>
                        <p className="text-[10px] text-white/40">
                          Hệ thống sẽ tự động tối ưu dung lượng ảnh để tải trang siêu nhanh
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/80 block">
                    Đường dẫn URL hình ảnh:
                  </label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const url = cleanGoogleMapsImageUrl(raw);
                      setFormUrl(url);
                      setPreviewSrc(url);
                    }}
                    placeholder="Dán link ảnh (hỗ trợ Google Maps, Google Drive, ảnh web...)"
                    className="input-field text-xs"
                  />
                  {previewSrc && (
                    <div className="mt-2 flex justify-center">
                      <ImageWithFallback
                        src={previewSrc}
                        alt="Preview"
                        className="h-36 mx-auto rounded-xl object-cover border border-white/15"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 block">
                  Tên / Tiêu đề bức ảnh:
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Góc Sân Vườn Buổi Sáng, Bàn Làm Việc Phòng Lạnh..."
                  className="input-field text-xs"
                  required
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 block">
                  Phân loại không gian quán:
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="input-field text-xs bg-[#0c1410]"
                >
                  <option value="garden">Khu Sân Vườn</option>
                  <option value="sidewalk">Khu Vỉa Hè</option>
                  <option value="pond">Khu Hồ Cá</option>
                  <option value="kids">Khu Vui Chơi Trẻ Em</option>
                  <option value="indoor">Phòng Lạnh (Học tập & Họp bàn)</option>
                  <option value="parking">Bãi Đỗ Xe</option>
                  <option value="all">Khu Vực Chung / Khác</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4"
                  disabled={uploading}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                      <span>Đang tải lên...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Lưu & Hiển Thị Lên Web</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#121d18] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>
            <div className="aspect-[16/10] w-full bg-black flex items-center justify-center">
              <img
                src={activePreview.image || activePreview.image_url}
                alt={activePreview.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5 bg-[#14201a] border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-['Fraunces']">
                  {activePreview.title}
                </h4>
                <p className="text-xs text-[#92f7c3] mt-0.5">
                  Phân loại: {CATEGORIES.find(c => c.id === activePreview.category)?.label || activePreview.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(activePreview.id)}
                className="px-4 py-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/70 hover:text-white text-xs font-semibold transition-all border border-red-500/20"
              >
                Xóa ảnh này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
