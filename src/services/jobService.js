/**
 * Recruitment Service Layer
 * Connects to Supabase `job_positions` and `applications` tables
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { jobPositions, jobBenefits, recruitmentFaq, recruitmentHighlights } from '../data/jobData';

export const jobService = {
  async getHighlights() {
    return Promise.resolve({ ...recruitmentHighlights });
  },

  async getPositions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('*')
          .eq('is_open', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(j => ({
            id: j.id,
            title: j.title,
            type: j.employment_type || 'Full-time / Part-time',
            salary: j.salary_description || 'Thỏa thuận theo năng lực',
            slots: '02 - 04 người',
            shifts: 'Ca sáng (06:00 - 11:30), Ca chiều (11:30 - 17:00), Ca tối (17:00 - 22:30)',
            experienceRequired: 'Không cần kinh nghiệm – Đào tạo từ đầu',
            interviewMode: 'Đến trực tiếp quán phỏng vấn',
            requirements: j.requirements ? j.requirements.split('\n') : ['Không cần kinh nghiệm, được đào tạo từ đầu', 'Nhiệt tình, thân thiện, đúng giờ'],
            responsibilities: j.description ? j.description.split('\n') : ['Thực hiện công việc theo phân công của Trưởng ca']
          }));
        }
      } catch (err) {
        console.warn("Supabase job_positions fallback:", err);
      }
    }

    return Promise.resolve([...jobPositions]);
  },

  async getBenefits() {
    return Promise.resolve([...jobBenefits]);
  },

  async getFaqs() {
    return Promise.resolve([...recruitmentFaq]);
  },

  /**
   * Submit job application form to Supabase `applications` table
   * @param {Object} applicationData
   */
  async submitApplication(applicationData) {
    if (!applicationData.fullName || !applicationData.phone) {
      return Promise.reject(new Error("Vui lòng điền đầy đủ các thông tin bắt buộc."));
    }

    if (isSupabaseConfigured && supabase) {
      // Find job_id if UUID or string
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationData.positionId);
      const insertPayload = {
        full_name: applicationData.fullName.trim(),
        phone: applicationData.phone.trim(),
        email: applicationData.email?.trim() || null,
        cover_letter: `Ca mong muốn: ${applicationData.shiftPref || 'Linh hoạt'}\nKinh nghiệm: ${applicationData.experience || 'Chưa có'}\nGhi chú: ${applicationData.note || 'Không có'}`,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      if (isUUID) {
        insertPayload.job_id = applicationData.positionId;
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        console.error("Supabase applications insert error:", error);
        throw new Error("Không thể gửi hồ sơ lên máy chủ. Vui lòng liên hệ trực tiếp hotline quán.");
      }

      return {
        success: true,
        message: "Hồ sơ ứng tuyển đã được lưu trực tiếp vào cơ sở dữ liệu quản trị MIA COFFEE! Bộ phận nhân sự sẽ liên hệ với bạn sớm nhất.",
        submittedData: { ...applicationData, id: data.id, submittedAt: data.created_at }
      };
    }

    // Local simulation fallback
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      success: true,
      message: "Hồ sơ ứng tuyển đã được ghi nhận thành công! Bộ phận nhân sự MIA COFFEE sẽ liên hệ với bạn trong vòng 24 - 48h.",
      submittedData: { ...applicationData, submittedAt: new Date().toISOString() }
    };
  }
};
