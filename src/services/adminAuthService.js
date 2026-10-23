import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Admin Authentication Service
 * Communicates with Supabase Auth & admin_users table
 */
export const adminAuthService = {
  /**
   * Sign in with Supabase Auth and verify role in admin_users table
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Chưa kết nối Supabase. Vui lòng cung cấp VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env."
      );
    }

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw new Error(authError.message || "Email hoặc mật khẩu không chính xác.");
    }

    const user = authData.user;
    if (!user) {
      throw new Error("Không thể xác thực thông tin đăng nhập.");
    }

    // 2. Fetch admin user record from admin_users table
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id, full_name, role, is_active')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminRecord) {
      // If no admin_users record exists, sign out immediately
      await supabase.auth.signOut();
      throw new Error("Tài khoản này không có quyền truy cập vào hệ thống Quản trị (Admin CMS).");
    }

    if (!adminRecord.is_active) {
      await supabase.auth.signOut();
      throw new Error("Tài khoản quản trị viên này đã bị vô hiệu hóa. Vui lòng liên hệ quản trị cấp cao.");
    }

    return {
      user,
      admin: adminRecord
    };
  },

  /**
   * Sign out current admin user
   */
  async signOut() {
    if (!supabase) return;
    return await supabase.auth.signOut();
  },

  /**
   * Get current authenticated admin user
   */
  async getCurrentAdmin() {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session?.user) return null;

    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('user_id, full_name, role, is_active')
      .eq('user_id', session.user.id)
      .single();

    if (!adminRecord || !adminRecord.is_active) {
      return null;
    }

    return {
      user: session.user,
      admin: adminRecord
    };
  },

  /**
   * Subscribe to auth changes
   */
  onAuthStateChange(callback) {
    if (!supabase) return () => {};
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return () => listener.subscription.unsubscribe();
  }
};
