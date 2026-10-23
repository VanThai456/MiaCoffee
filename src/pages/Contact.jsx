import { useState } from 'react';
import { brandInfo } from '../data/brandData';
import { contactService } from '../services/contactService';
import SectionHeading from '../components/SectionHeading';

/**
 * Contact Page Component
 * Showcases direct contact channels, Google Maps directions, feedback form and customer FAQs
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Góp ý chất lượng dịch vụ',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setErrorMessage("Vui lòng điền Họ tên và Nội dung góp ý.");
      return;
    }

    try {
      setSending(true);
      const res = await contactService.submitFeedback(formData);
      setStatusMessage(res.message);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Góp ý chất lượng dịch vụ',
        message: ''
      });
    } catch (err) {
      setErrorMessage(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  const contactFaqs = [
    {
      q: "Quán có bãi đỗ xe ô tô không và có tính phí không?",
      a: "Có! MIA COFFEE có khoảng sân rộng thênh thang ngay trước quán đỗ được nhiều xe ô tô 4 - 7 chỗ và xe máy hoàn toàn MIỄN PHÍ. Nhân viên bảo vệ túc trực hỗ trợ dắt xe và trông giữ an ninh chu đáo."
    },
    {
      q: "Điểm tâm sáng phục vụ đến mấy giờ?",
      a: "Điểm tâm sáng (Bánh mì chảo, bánh mì ốp la xúc xích, v.v.) được phục vụ nóng sốt từ 06:00 sáng đến 11:30 trưa mỗi ngày."
    },
    {
      q: "Tôi có cần đặt bàn trước khi đến quán không?",
      a: "Không gian MIA COFFEE rất rộng rãi với hơn 150+ chỗ ngồi cả trong nhà và sân vườn, bạn không cần đặt chỗ trước mà có thể ghé bất cứ lúc nào. Trường hợp đi nhóm đông trên 20 người, bạn có thể gọi hotline để quán chuẩn bị bàn chu đáo nhất."
    },
    {
      q: "Quán có xuất hóa đơn đỏ (VAT) cho doanh nghiệp không?",
      a: "Có! Quán hỗ trợ xuất hóa đơn điện tử VAT cho khách hàng doanh nghiệp hoặc khách đoàn. Vui lòng báo cho nhân viên thu ngân khi thanh toán."
    }
  ];

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ================= 1. HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionHeading
            center
            icon="location_on"
            badge="Liên Hệ & Chỉ Đường"
            title="Ghé Thăm Không Gian"
            highlight="MIA COFFEE"
            description="Chào đón bạn đến thưởng thức cà phê nguyên chất và điểm tâm sáng nóng sốt mỗi ngày. Dưới đây là thông tin chỉ đường và các kênh liên hệ trực tiếp."
          />
        </div>

        {/* ================= 2. CONTACT INFO CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Địa chỉ */}
          <div className="p-6 rounded-3xl bg-[#14201a] border border-white/10 space-y-3 shadow-lg hover:border-[#92f7c3]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">pin_drop</span>
            </div>
            <h4 className="text-base font-bold text-white font-['Playfair_Display']">
              Địa Chỉ Quán
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              {brandInfo.contact.address}
            </p>
            <p className="text-[11px] text-[#92f7c3] font-medium pt-1">
              {brandInfo.contact.shortAddress}
            </p>
          </div>

          {/* Card 2: Hotline */}
          <div className="p-6 rounded-3xl bg-[#14201a] border border-white/10 space-y-3 shadow-lg hover:border-[#92f7c3]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h4 className="text-base font-bold text-white font-['Playfair_Display']">
              Hotline Quán
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Tư vấn thực đơn & hỗ trợ thông tin nhanh chóng:
            </p>
            <a
              href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
              className="inline-block text-base font-bold text-[#92f7c3] hover:underline pt-1"
            >
              {brandInfo.contact.hotlineDisplay}
            </a>
          </div>

          {/* Card 3: Giờ mở cửa */}
          <div className="p-6 rounded-3xl bg-[#14201a] border border-white/10 space-y-3 shadow-lg hover:border-[#92f7c3]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <h4 className="text-base font-bold text-white font-['Playfair_Display']">
              Giờ Phục Vụ
            </h4>
            <div className="text-xs text-white/70 space-y-1">
              <p><strong>Cả ngày:</strong> {brandInfo.contact.openingHours}</p>
              <p><strong>Điểm tâm sáng:</strong> {brandInfo.contact.breakfastHours}</p>
            </div>
          </div>

          {/* Card 4: Bãi xe */}
          <div className="p-6 rounded-3xl bg-[#14201a] border border-white/10 space-y-3 shadow-lg hover:border-[#92f7c3]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">local_parking</span>
            </div>
            <h4 className="text-base font-bold text-white font-['Playfair_Display']">
              Bãi Đỗ Xe Tiện Lợi
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              {brandInfo.contact.parkingNote}
            </p>
          </div>
        </div>

        {/* ================= 3. MAP & FEEDBACK FORM SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-24">
          {/* Left: Interactive Map Container */}
          <div className="lg:col-span-7 bg-[#14201a] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#92f7c3] uppercase tracking-wider font-bold">
                  Bản Đồ Trực Quan
                </span>
                <h3 className="text-xl font-['Playfair_Display'] text-white font-bold">
                  Vị Trí Quán Trên Google Maps
                </h3>
              </div>

              <a
                href={brandInfo.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2.5 px-5 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Mở Trong Ứng Dụng Maps</span>
              </a>
            </div>

            {/* Simulated Clean Map / Embed */}
            <div className="relative aspect-[16/10] w-full bg-[#0d1612] overflow-hidden flex items-center justify-center">
              <iframe
                title="Bản đồ MIA COFFEE - Nguyễn Đáng, Trà Vinh"
                src="https://maps.google.com/maps?q=Nguy%E1%BB%85n+%C4%90%C3%A1ng,+Tr%C3%A0+Vinh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#92f7c3]">assistant_navigation</span>
                <span>Mặt tiền đường rộng, dễ tìm, ô tô quay đầu thuận tiện</span>
              </span>
              <a
                href={brandInfo.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#92f7c3] font-semibold hover:underline"
              >
                Chỉ đường ngay →
              </a>
            </div>
          </div>

          {/* Right: Feedback & Inquiries Form */}
          <div className="lg:col-span-5 bg-[#14201a] p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#92f7c3] uppercase tracking-wider font-bold mb-1">
                <span className="material-symbols-outlined text-sm">mark_email_read</span>
                <span>Hòm Thư Khách Hàng</span>
              </div>
              <h3 className="text-2xl font-['Playfair_Display'] text-white font-bold">
                Gửi Ý Kiến Đóng Góp
              </h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                MIA COFFEE luôn trân trọng mọi góp ý để không ngừng nâng cao chất lượng dịch vụ phục vụ quý khách.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {statusMessage && (
              <div className="p-3.5 rounded-xl bg-[#1b4332] border border-[#92f7c3]/40 text-xs text-[#92f7c3] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Họ và tên của bạn <span className="text-[#92f7c3]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Hoàng Minh"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@domain.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Chủ đề phản hồi
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field bg-[#0c1410]"
                >
                  <option value="Góp ý chất lượng dịch vụ" className="bg-[#14201a]">Góp ý chất lượng dịch vụ</option>
                  <option value="Góp ý hương vị món ăn / đồ uống" className="bg-[#14201a]">Góp ý hương vị món ăn / đồ uống</option>
                  <option value="Đặt bàn nhóm đông người" className="bg-[#14201a]">Đặt bàn nhóm đông người</option>
                  <option value="Liên hệ hợp tác & Sự kiện" className="bg-[#14201a]">Liên hệ hợp tác & Sự kiện</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Nội dung chia sẻ <span className="text-[#92f7c3]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hãy chia sẻ trải nghiệm hoặc thắc mắc của bạn cùng chúng tôi..."
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#012d1d] border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi phản hồi...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Gửi Phản Hồi Cho Quán</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ================= 4. CUSTOMER FAQS ================= */}
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            center
            icon="quiz"
            badge="Giải Đáp Nhanh"
            title="Những Câu Hỏi"
            highlight="Thường Gặp"
            className="mb-8"
          />

          <div className="space-y-4">
            {contactFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2"
              >
                <h4 className="text-sm sm:text-base font-bold text-white flex items-start gap-2.5">
                  <span className="text-[#92f7c3]">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-white/70 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
