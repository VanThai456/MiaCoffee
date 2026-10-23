import { supabase, isSupabaseConfigured } from './supabaseClient';
import { jobPositions } from '../data/jobData';

/**
 * Admin Recruitment & Applications Service
 * Connects directly to Supabase tables: `job_positions`, `applications`
 */
export const adminApplicationsService = {
  // ================= APPLICATIONS =================
  async getApplications({ status = 'all', jobId = null } = {}) {
    if (!isSupabaseConfigured || !supabase) {
      // Mock data for demo
      return [
        {
          id: 'mock-app-1',
          job_id: 'job-barista',
          full_name: 'Nguyễn Văn Minh',
          email: 'minh.nguyen@example.com',
          phone: '0912 345 678',
          cover_letter: 'Em đã có 1 năm kinh nghiệm pha chế cà phê phin và máy tại quán The Coffee House.',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          job_position: { title: 'Nhân Viên Pha Chế (Barista)' }
        },
        {
          id: 'mock-app-2',
          job_id: 'job-service',
          full_name: 'Trần Thị Thu Thảo',
          email: 'thao.tran@example.com',
          phone: '0987 654 321',
          cover_letter: 'Sinh viên năm 2 ĐH Kinh Tế, mong muốn tìm việc làm thêm ca tối, nhanh nhẹn, vui vẻ.',
          status: 'reviewing',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          job_position: { title: 'Nhân Viên Phục Vụ Bàn' }
        }
      ];
    }

    let query = supabase
      .from('applications')
      .select(`
        *,
        job_position:job_positions(id, title, employment_type)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (jobId && jobId !== 'all') {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase getApplications error:", error);
      throw error;
    }
    return data || [];
  },

  async updateApplicationStatus(id, status) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ================= JOB POSITIONS =================
  async getJobPositions() {
    if (!isSupabaseConfigured || !supabase) {
      return jobPositions.map(j => ({
        id: j.id,
        title: j.title,
        slug: j.id,
        location: 'Quận Phú Nhuận, TP.HCM',
        employment_type: j.type,
        salary_description: j.salary,
        description: j.responsibilities?.join('\n') || '',
        requirements: j.requirements?.join('\n') || '',
        benefits: 'Bao cơm ca, thưởng doanh thu, đào tạo bài bản',
        is_open: true
      }));
    }

    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase getJobPositions error:", error);
      throw error;
    }
    return data || [];
  },

  async createJobPosition(jobData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const slug = jobData.slug || jobData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('job_positions')
      .insert([{
        ...jobData,
        slug: slug + '-' + Date.now().toString().slice(-4),
        is_open: jobData.is_open !== false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJobPosition(id, jobData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { data, error } = await supabase
      .from('job_positions')
      .update({
        ...jobData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleJobOpen(id, is_open) {
    return this.updateJobPosition(id, { is_open });
  }
};
