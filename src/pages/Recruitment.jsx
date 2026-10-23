import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import SectionHeading from '../components/SectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import { brandInfo } from '../data/brandData';

/**
 * Recruitment Page Component
 * Showcases job openings (Service & Barista), compensation & benefits, and interview guidelines
 * Strictly follows user requirement: No experience needed, direct interview at cafe, multiple shifts.
 */
export default function Recruitment() {
  const [positions, setPositions] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState('job-service');

  useEffect(() => {
    let isMounted = true;
    async function fetchJobs() {
      try {
        setLoading(true);
        const [posData, benData, faqData] = await Promise.all([
          jobService.getPositions(),
          jobService.getBenefits(),
          jobService.getFaqs()
        ]);
        if (isMounted) {
          setPositions(posData);
          setBenefits(benData);
          setFaqs(faqData);
        }
      } catch (err) {
        console.error("Failed to load recruitment data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchJobs();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ================= 1. HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <SectionHeading
            center
            icon="work"
            badge="Tuyển Dụng Thân Thiện"
            title="Đồng Hành Cùng"
            highlight="MIA COFFEE"
            description="Tìm kiếm những đồng đội trẻ trung, nhiệt tình và tươi vui. Quán không yêu cầu kinh nghiệm, sẵn sàng hướng dẫn bạn từ đầu với các ca làm việc cực kỳ linh hoạt."
          />
        </div>

        {/* ================= 1.5 DIRECT INTERVIEW & NO EXPERIENCE CALLOUT BANNER ================= */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173024] via-[#14201a] to-[#1a2f24] border border-[#92f7c3]/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#92f7c3] text-[#012d1d] text-xs font-bold uppercase tracking-wider shadow">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Tuyển Dụng Trực Tiếp 2026</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-['Playfair_Display'] text-white font-bold">
                KHÔNG CẦN KINH NGHIỆM • ĐẾN TRỰC TIẾP QUÁN PHỎNG VẤN
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                MIA COFFEE coi trọng thái độ niềm nở, tính trung thực và tinh thần ham học hỏi hơn bằng cấp hay kinh nghiệm cũ. Bạn chỉ cần mang CCCD hoặc Thẻ sinh viên đến trực tiếp quán để phỏng vấn nhanh và nhận việc sớm!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-[#92f7c3]/30 text-left shrink-0 space-y-1.5">
              <p className="text-[11px] text-[#92f7c3] uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">place</span>
                <span>Địa chỉ phỏng vấn trực tiếp</span>
              </p>
              <p className="text-sm font-bold text-white">
                {brandInfo.contact.address}
              </p>
              <p className="text-xs text-white/70">
                ⏰ Giờ tiếp đón: <strong>08:00 – 17:00</strong> mỗi ngày
              </p>
              <p className="text-xs text-[#92f7c3] font-semibold pt-1">
                📞 Hotline Quản Lý Ca: {brandInfo.contact.hotlineDisplay}
              </p>
            </div>
          </div>

          {/* ================= SHIFT SCHEDULE GRID (CHIA NHIỀU CA LÀM KHÁC NHAU) ================= */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#92f7c3] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>Các Ca Làm Việc Linh Hoạt (Chọn Ca Theo Nhu Cầu)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#92f7c3]/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#92f7c3] uppercase">Ca 1: Sáng Sớm</span>
                  <span className="material-symbols-outlined text-base text-white/50">wb_sunny</span>
                </div>
                <p className="text-base font-bold text-white mb-1">06:00 – 11:30</p>
                <p className="text-xs text-white/60">
                  Phục vụ cao điểm cà phê mộc & điểm tâm sáng nóng sốt. Phù hợp các bạn dậy sớm.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#92f7c3]/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#92f7c3] uppercase">Ca 2: Trưa – Chiều</span>
                  <span className="material-symbols-outlined text-base text-white/50">light_mode</span>
                </div>
                <p className="text-base font-bold text-white mb-1">11:30 – 17:00</p>
                <p className="text-xs text-white/60">
                  Phục vụ trà trái cây và khách phòng máy lạnh yên tĩnh. Phù hợp sinh viên học sáng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#92f7c3]/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#92f7c3] uppercase">Ca 3: Chiều Tối</span>
                  <span className="material-symbols-outlined text-base text-white/50">dark_mode</span>
                </div>
                <p className="text-base font-bold text-white mb-1">17:00 – 22:30</p>
                <p className="text-xs text-white/60">
                  Phục vụ nhóm bạn vỉa hè & gia đình sân vườn ngắm phố. Thích hợp kiếm thêm buổi tối.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#92f7c3]/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#92f7c3] uppercase">Ca Xoay / Part-Time</span>
                  <span className="material-symbols-outlined text-base text-white/50">sync</span>
                </div>
                <p className="text-base font-bold text-white mb-1">Linh Hoạt Theo Lịch</p>
                <p className="text-xs text-white/60">
                  Đăng ký lịch rảnh theo tuần theo thời khóa biểu sinh viên, không sợ cấn giờ học.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. BENEFITS GRID ================= */}
        <div className="mb-20">
          <SectionHeading
            center
            icon="star"
            badge="Quyền Lợi & Đãi Ngộ"
            title="Tại Sao Bạn Sẽ Thích"
            highlight="Làm Việc Tại MIA?"
            description="Chính sách phúc lợi minh bạch, môi trường hòa đồng và cơ hội nâng cao tay nghề."
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((ben, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#14201a] border border-white/10 hover:border-[#92f7c3]/40 transition-all hover:-translate-y-1 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1b4332] text-[#92f7c3] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{ben.icon}</span>
                </div>
                <h4 className="text-base font-bold text-white font-['Playfair_Display']">
                  {ben.title}
                </h4>
                <p className="text-xs text-white/65 leading-relaxed">
                  {ben.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. OPEN POSITIONS (CHỈ GIỮ PHỤC VỤ & PHA CHẾ) ================= */}
        <div className="max-w-4xl mx-auto mb-24 space-y-8">
          <div className="text-center">
            <SectionHeading
              center
              icon="badge"
              badge="Vị Trí Đang Tuyển Dụng"
              title="2 Vị Trí Tuyển Dụng"
              highlight="Chính Thức"
              description="Chỉ tuyển Nhân viên phục vụ bàn và Nhân viên pha chế đồ uống. Không cần kinh nghiệm, đến trực tiếp quán phỏng vấn."
            />
          </div>

          {loading ? (
            <LoadingSpinner text="Đang tải danh sách vị trí..." />
          ) : (
            <div className="space-y-6">
              {positions.map((pos) => {
                const isExpanded = expandedJobId === pos.id;
                return (
                  <div
                    key={pos.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'bg-[#14201a] border-[#92f7c3]/50 shadow-2xl'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedJobId(isExpanded ? null : pos.id)}
                      className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xl sm:text-2xl font-bold text-white font-['Playfair_Display']">
                            {pos.title}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#1b4332] text-[#92f7c3] text-xs font-bold uppercase tracking-wider">
                            {pos.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="text-[#92f7c3] font-bold">
                            Lương: {pos.salary}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-amber-300 font-medium">
                            {pos.experienceRequired || 'Không cần kinh nghiệm'}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/70">
                            Cần tuyển: <strong>{pos.slots}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white shrink-0 group-hover:bg-[#92f7c3] group-hover:text-[#012d1d] transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-white/10 space-y-6 text-xs sm:text-sm animate-fade-in">
                        {/* Badges for interview & slots */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-3 py-1.5 rounded-full bg-[#92f7c3]/15 text-[#92f7c3] border border-[#92f7c3]/30 font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Không yêu cầu kinh nghiệm – Đào tạo từ đầu</span>
                          </span>
                          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white font-medium border border-white/15 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">storefront</span>
                            <span>Phỏng vấn trực tiếp tại quán</span>
                          </span>
                        </div>

                        {/* Shift details */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-xs text-white/70">
                            <strong className="text-white">Khung ca làm việc:</strong> {pos.shifts}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h5 className="font-bold uppercase text-xs tracking-wider text-[#92f7c3] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">checklist</span>
                              <span>Yêu Cầu Ứng Viên:</span>
                            </h5>
                            <ul className="list-disc list-inside space-y-1.5 text-white/80 text-xs sm:text-sm">
                              {pos.requirements.map((req, rIdx) => (
                                <li key={rIdx}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-bold uppercase text-xs tracking-wider text-[#92f7c3] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">description</span>
                              <span>Mô Tả Công Việc:</span>
                            </h5>
                            <ul className="list-disc list-inside space-y-1.5 text-white/80 text-xs sm:text-sm">
                              {pos.responsibilities.map((res, sIdx) => (
                                <li key={sIdx}>{res}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Direct interview actions */}
                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-white/70">
                            Mang theo CCCD / Thẻ sinh viên đến trực tiếp quán:
                            <span className="block text-white font-semibold mt-0.5">
                              {brandInfo.contact.shortAddress} (08:00 – 17:00 hàng ngày)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <a
                              href={brandInfo.contact.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary py-2.5 px-5 flex items-center gap-2 text-xs"
                            >
                              <span className="material-symbols-outlined text-base">near_me</span>
                              <span>Đến Quán Phỏng Vấn Ngay</span>
                            </a>

                            <a
                              href={`tel:${brandInfo.contact.hotline.replace(/\s+/g, '')}`}
                              className="btn-secondary py-2.5 px-5 flex items-center gap-2 text-xs"
                            >
                              <span className="material-symbols-outlined text-base">call</span>
                              <span>Hotline: {brandInfo.contact.hotlineDisplay}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= 4. RECRUITMENT FAQ ================= */}
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            center
            icon="help_outline"
            badge="Giải Đáp Thắc Mắc"
            title="Câu Hỏi Thường Gặp"
            highlight="Tuyển Dụng"
            className="mb-8"
          />

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
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
