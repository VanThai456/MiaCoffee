/**
 * Contact & Brand Service Layer
 * Connects to Supabase `contact_messages` table on submission
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { brandInfo } from '../data/brandData';

export const contactService = {
  async getBrandInfo() {
    return Promise.resolve({ ...brandInfo });
  },

  /**
   * Submit customer feedback or inquiry to `contact_messages` table
   * @param {Object} messageData
   */
  async submitFeedback(messageData) {
    if (!messageData.name || !messageData.message) {
      return Promise.reject(new Error("Vui lòng nhập họ tên và nội dung tin nhắn."));
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          full_name: messageData.name.trim(),
          email: messageData.email?.trim() || null,
          subject: messageData.subject?.trim() || 'Ý kiến đóng góp',
          message: messageData.message.trim(),
          status: 'unread',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error("Supabase contact_messages error:", error);
        throw new Error("Không thể gửi tin nhắn qua máy chủ. Vui lòng thử lại sau.");
      }

      return {
        success: true,
        message: "Cảm ơn bạn đã gửi ý kiến đóng góp cho MIA COFFEE! Tin nhắn của bạn đã được lưu vào hệ thống quản lý.",
        id: data.id,
        timestamp: data.created_at
      };
    }

    // Local fallback
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: "Cảm ơn bạn đã gửi ý kiến đóng góp cho MIA COFFEE! Chúng tôi luôn trân trọng mọi chia sẻ từ quý khách.",
      timestamp: new Date().toISOString()
    };
  }
};
