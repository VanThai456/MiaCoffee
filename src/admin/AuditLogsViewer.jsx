import { useState, useEffect } from 'react';
import { adminAuditService } from '../services/adminAuditService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * AuditLogsViewer Component
 * Manages Supabase table: `audit_logs`
 */
export default function AuditLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await adminAuditService.getLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-['Playfair_Display'] text-white font-bold">
          Nhật Ký Quản Trị Hệ Thống
        </h2>
        <p className="text-xs text-white/60">
          Bảng <code>audit_logs</code> trên Supabase
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Đang tải nhật ký..." />
      ) : logs.length > 0 ? (
        <div className="rounded-3xl bg-[#14201a] border border-white/10 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Thời Gian</th>
                <th className="py-3.5 px-5">Người Thực Hiện</th>
                <th className="py-3.5 px-5">Hành Động</th>
                <th className="py-3.5 px-5">Thực Thể</th>
                <th className="py-3.5 px-5">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-5 text-white/50 text-[11px]">
                    {log.created_at ? new Date(log.created_at).toLocaleString('vi-VN') : ''}
                  </td>
                  <td className="py-3.5 px-5 text-white font-sans font-semibold">
                    {log.admin_user?.full_name || 'Hệ thống'}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded bg-[#1b4332] text-[#92f7c3] text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-white/70">
                    {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(0, 8)})` : ''}
                  </td>
                  <td className="py-3.5 px-5 text-white/60 text-[11px] max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10 text-white/50 text-xs">
          Chưa có nhật ký hoạt động nào được ghi nhận.
        </div>
      )}
    </div>
  );
}
