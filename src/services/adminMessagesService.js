import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Admin Messages Service
 * Connects directly to Supabase table: `contact_messages`
 */
export const adminMessagesService = {
  async getMessages({ status = 'all' } = {}) {
    if (!isSupabaseConfigured || !supabase) {
      return [
        {
          id: 'mock-msg-1',
          full_name: 'Lê Hoàng Nam',
          email: 'nam.le@company.vn',
          phone: '0908 111 222',
          subject: 'Đặt bàn nhóm đông người',
          message: 'Thứ 7 tuần này công ty mình khoảng 25 người muốn ghé ăn sáng và uống cà phê lúc 8h, quán có thể ghép bàn khu máy lạnh giúp mình được không?',
          status: 'unread',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'mock-msg-2',
          full_name: 'Chị Mai Lan',
          email: 'mailan@gmail.com',
          phone: '0933 456 789',
          subject: 'Góp ý chất lượng dịch vụ',
          message: 'Cà phê phin và bánh mì chảo ở quán rất ngon, nhân viên phục vụ vui vẻ. Mong quán có thêm món sữa chua hoa quả nhé!',
          status: 'read',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
    }

    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase getMessages error:", error);
      throw error;
    }
    return data || [];
  },

  async updateMessageStatus(id, status) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMessage(id) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
