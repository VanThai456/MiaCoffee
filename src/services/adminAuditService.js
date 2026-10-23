import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Admin Audit Logs Service
 * Connects directly to Supabase table: `audit_logs`
 */
export const adminAuditService = {
  async logAction({ action, entityType, entityId = null, details = {} }) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || null;

      await supabase.from('audit_logs').insert([{
        actor_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        details,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn("Failed to record audit log:", err);
    }
  },

  async getLogs({ limit = 50 } = {}) {
    if (!isSupabaseConfigured || !supabase) {
      return [
        {
          id: 1,
          action: 'LOGIN',
          entity_type: 'AUTH',
          entity_id: null,
          details: { ip: '127.0.0.1', message: 'Quản trị viên đăng nhập thành công' },
          created_at: new Date().toISOString(),
          admin_user: { full_name: 'Quản Trị Viên (Demo)' }
        }
      ];
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        admin_user:admin_users(user_id, full_name, role)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase audit_logs error:", error);
      return [];
    }
    return data || [];
  }
};
