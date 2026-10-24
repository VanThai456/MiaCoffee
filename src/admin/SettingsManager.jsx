import { useState, useEffect } from 'react';
import { adminSettingsService } from '../services/adminSettingsService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * SettingsManager Component
 * Manages Supabase table: `site_settings`
 */
export default function SettingsManager() {
  const [settings, setSettings] = useState({
    brand_name: 'MIA COFFEE',
    tagline: 'Cà Phê & Điểm Tâm Sáng',
    description: 'Không gian rộng rãi, thoáng mát ngoài trời và trong nhà. Điểm hẹn thân quen cho bữa sáng ngon miệng và ly cà phê thơm nồng mỗi ngày.',
    address: 'Nguyễn Đáng, Trà Vinh, Tỉnh Vĩnh Long 87112, Vietnam',
    hotline: '076 456 8484',
    email: 'lienhe@miacoffee.vn',
    opening_hours: '06:00 – 22:00 Hàng ngày (Điểm tâm sáng từ 06:00)',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=MIA+COFFEE+Nguyen+Dang+Tra+Vinh'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await adminSettingsService.getAllSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await Promise.all(
        Object.entries(settings).map(([key, val]) =>
          adminSettingsService.updateSetting(key, val)
        )
      );
      setToast("Đã lưu cấu hình website vào Supabase thành công!");
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      alert("Lỗi lưu cấu hình: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {toast && (
        <div className="fixed top-24 right-8 z-50 bg-[#92f7c3] text-[#012d1d] px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-['Fraunces'] text-white font-bold">
          Cấu Hình Thông Tin Quán
        </h2>
        <p className="text-xs text-white/60">
          Bảng <code>site_settings</code> trên Supabase (setting_key, value)
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải cấu hình..." />
      ) : (
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-[#14201a] border border-white/10 shadow-xl space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Tên Quán (brand_name)
              </label>
              <input
                type="text"
                name="brand_name"
                value={settings.brand_name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Khẩu Hiệu (tagline)
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-1.5">
              Đoạn Giới Thiệu Ngắn (description)
            </label>
            <textarea
              name="description"
              rows="3"
              value={settings.description}
              onChange={handleChange}
              className="input-field resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Hotline Liên Hệ (hotline)
              </label>
              <input
                type="text"
                name="hotline"
                value={settings.hotline}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Email Liên Hệ (email)
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-1.5">
              Địa Chỉ Quán (address)
            </label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Giờ Mở Cửa Phục Vụ (opening_hours)
              </label>
              <input
                type="text"
                name="opening_hours"
                value={settings.opening_hours}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-white/80 font-semibold mb-1.5">
                Đường Dẫn Bản Đồ Google Maps (maps_url)
              </label>
              <input
                type="url"
                name="maps_url"
                value={settings.maps_url}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#012d1d] border-t-transparent rounded-full animate-spin" />
                  <span>Đang lưu cấu hình...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
