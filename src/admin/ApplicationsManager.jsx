import { useState, useEffect } from 'react';
import { adminApplicationsService } from '../services/adminApplicationsService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * ApplicationsManager Component
 * Manages Supabase table: `applications` & `job_positions`
 */
export default function ApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await adminApplicationsService.getApplications({ status: statusFilter });
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, [statusFilter]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await adminApplicationsService.updateApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      setToast("Đã cập nhật trạng thái hồ sơ!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert("Lỗi cập nhật trạng thái: " + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">Chờ xem xét</span>;
      case 'reviewing':
        return <span className="px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-500/30 text-[11px] font-semibold">Đang liên hệ</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full bg-[#1b4332] text-[#92f7c3] border border-[#92f7c3]/30 text-[11px] font-semibold">Đã tuyển dụng</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-500/30 text-[11px] font-semibold">Từ chối</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-24 right-8 z-50 bg-[#92f7c3] text-[#012d1d] px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-['Playfair_Display'] text-white font-bold">
            Hồ Sơ Ứng Tuyển
          </h2>
          <p className="text-xs text-white/60">
            Bảng <code>applications</code> & <code>job_positions</code> trên Supabase
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'reviewing', label: 'Đang liên hệ' },
            { id: 'accepted', label: 'Đã nhận' },
            { id: 'rejected', label: 'Từ chối' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === tab.id
                  ? 'bg-[#92f7c3] text-[#012d1d] border-[#92f7c3]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <LoadingSpinner text="Đang tải danh sách hồ sơ..." />
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#14201a] border border-white/10 shadow-lg space-y-4 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white font-['Playfair_Display']">
                      {app.full_name}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-xs text-[#92f7c3] font-medium mt-0.5">
                    Ứng tuyển: {app.job_position?.title || 'Nhân viên MIA Coffee'}
                  </p>
                </div>

                {/* Status Changer */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/50 uppercase font-semibold">
                    Đổi trạng thái:
                  </span>
                  <select
                    value={app.status || 'pending'}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="bg-[#0c1410] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#92f7c3]"
                  >
                    <option value="pending">Chờ xem xét</option>
                    <option value="reviewing">Đang liên hệ</option>
                    <option value="accepted">Nhận vào làm</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
              </div>

              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Số điện thoại / Zalo</span>
                  <a href={`tel:${app.phone}`} className="text-white font-semibold hover:text-[#92f7c3]">
                    {app.phone}
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Email</span>
                  <span className="text-white/80">{app.email || 'Chưa cung cấp'}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Thời gian nộp</span>
                  <span className="text-white/60">
                    {app.created_at ? new Date(app.created_at).toLocaleString('vi-VN') : 'Mới đây'}
                  </span>
                </div>
              </div>

              {/* Cover letter */}
              {app.cover_letter && (
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                    Giới thiệu / Kinh nghiệm:
                  </span>
                  <p className="text-xs text-white/80 whitespace-pre-line leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                    {app.cover_letter}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10 text-white/50 text-xs">
          Không có hồ sơ nào trong trạng thái này.
        </div>
      )}
    </div>
  );
}
