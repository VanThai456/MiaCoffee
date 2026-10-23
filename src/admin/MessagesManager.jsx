import { useState, useEffect } from 'react';
import { adminMessagesService } from '../services/adminMessagesService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * MessagesManager Component
 * Manages Supabase table: `contact_messages`
 */
export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await adminMessagesService.getMessages({ status: statusFilter });
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const handleStatusChange = async (msgId, newStatus) => {
    try {
      await adminMessagesService.updateMessageStatus(msgId, newStatus);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus } : m));
      triggerToast("Đã cập nhật trạng thái tin nhắn!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tin nhắn từ "${msg.full_name}"?`)) return;
    try {
      await adminMessagesService.deleteMessage(msg.id);
      setMessages(prev => prev.filter(m => m.id !== msg.id));
      triggerToast("Đã xóa tin nhắn thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const triggerToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 3000);
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
            Hộp Thư Khách Hàng
          </h2>
          <p className="text-xs text-white/60">
            Bảng <code>contact_messages</code> trên Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unread', label: 'Chưa đọc' },
            { id: 'read', label: 'Đã đọc' },
            { id: 'replied', label: 'Đã phản hồi' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
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

      {/* Messages List */}
      {loading ? (
        <LoadingSpinner text="Đang tải tin nhắn..." />
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all ${
                msg.status === 'unread'
                  ? 'bg-[#182720] border-[#92f7c3]/40 shadow-xl'
                  : 'bg-[#14201a] border-white/10 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                    {msg.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">
                        {msg.full_name}
                      </h4>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#92f7c3] text-[10px] font-bold uppercase border border-[#92f7c3]/30">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50">
                      {msg.email ? `${msg.email} • ` : ''}{msg.phone || 'Không có số ĐT'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/40 text-[11px]">
                    {msg.created_at ? new Date(msg.created_at).toLocaleString('vi-VN') : ''}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(msg.id, msg.status === 'unread' ? 'read' : 'replied')}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    {msg.status === 'unread' ? 'Đánh dấu đã đọc' : 'Đánh dấu đã phản hồi'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(msg)}
                    className="w-7 h-7 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 flex items-center justify-center"
                    title="Xóa tin nhắn"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="pt-4 space-y-2">
                <span className="text-xs text-[#92f7c3] font-semibold block">
                  Chủ đề: {msg.subject}
                </span>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-2xl border border-white/5">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10 text-white/50 text-xs">
          Hộp thư hiện đang trống.
        </div>
      )}
    </div>
  );
}
