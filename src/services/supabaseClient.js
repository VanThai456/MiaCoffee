import { createClient } from '@supabase/supabase-js';

// Giá trị mặc định dự phòng của dự án (đảm bảo build GitHub Pages luôn kết nối được Supabase)
const DEFAULT_SUPABASE_URL = 'https://yoscrevwvwwahamatkzr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_T7c2F0n7-RpyYi2eaqHOmg_R-D2Wtxd';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[MIA COFFEE CMS] Supabase chưa được cấu hình. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env.'
  );
}

// Khởi tạo Supabase client với Anon Key (an toàn cho phía Frontend)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
