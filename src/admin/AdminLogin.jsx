import { useState } from 'react';
import { adminAuthService } from '../services/adminAuthService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { brandInfo } from '../data/brandData';

/**
 * Admin Login Page
 * Authenticates against Supabase Auth & admin_users table
 */
export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu quản trị.');
      return;
    }

    try {
      setLoading(true);
      const { user, admin } = await adminAuthService.signIn({ email, password });
      onLoginSuccess({ user, admin });
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#070e0a] flex items-center justify-center p-6 text-[#edece6] relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1b4332]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#92f7c3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#14201a] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border border-white/20 p-1 mx-auto flex items-center justify-center">
            <img
              src={brandInfo.logo}
              alt="MIA COFFEE Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h2 className="text-2xl font-['Fraunces'] text-white font-bold tracking-wide">
            {brandInfo.name} CMS
          </h2>
          <p className="text-xs text-[#92f7c3] uppercase tracking-widest font-semibold">
            Hệ Thống Quản Trị Nội Dung
          </p>
        </div>

        {/* Supabase status banner if not configured */}
        {!isSupabaseConfigured && (
          <div className="p-3.5 rounded-2xl bg-amber-900/30 border border-amber-500/40 text-xs text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>Chưa cấu hình Supabase API Key</span>
            </div>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              Vui lòng bổ sung <code>VITE_SUPABASE_URL</code> và <code>VITE_SUPABASE_ANON_KEY</code> vào file <code>.env</code>.
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Email Quản Trị
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@miacoffee.vn"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Mật Khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#012d1d] border-t-transparent rounded-full animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">login</span>
                <span>Đăng Nhập CMS</span>
              </>
            )}
          </button>
        </form>


        {/* Back link */}
        <div className="text-center pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs text-white/60 hover:text-[#92f7c3] transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Quay lại trang website khách hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
