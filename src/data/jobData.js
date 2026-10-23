/**
 * Recruitment Data for MIA COFFEE
 * Careers, job descriptions, benefits and application information
 * Core highlights:
 * - KHÔNG CẦN KINH NGHIỆM (được đào tạo bài bản từ đầu)
 * - ĐẾN TRỰC TIẾP QUÁN PHỎNG VẤN (trao đổi nhanh, nhận việc ngay)
 * - CHIA NHIỀU CA LÀM KHÁC NHAU (ca sáng, ca trưa/chiều, ca tối, linh hoạt cho sinh viên)
 */

export const recruitmentHighlights = {
  badge: "Tuyển Dụng Thân Thiện",
  title: "Gia Nhập Đại Gia Đình MIA COFFEE",
  highlightNotice: "Không Cần Kinh Nghiệm • Đến Trực Tiếp Quán Phỏng Vấn",
  description: "MIA COFFEE luôn chào đón những bạn trẻ nhiệt huyết, vui vẻ và trung thực. Bạn chưa có kinh nghiệm? Đừng lo lắng! Chúng tôi sẽ đồng hành và đào tạo bạn tận tình từ những kỹ năng cơ bản nhất.",
  interviewPolicy: {
    title: "Hình Thức Phỏng Vấn: Trực Tiếp Tại Quán",
    address: "Nguyễn Đáng, Trà Vinh (Mặt tiền rộng rãi, có chỗ đậu xe)",
    hotline: "076 456 8484",
    hours: "08:00 – 17:00 Hàng ngày",
    note: "Bạn có thể điền thông tin trước trên website hoặc mang CCCD/thẻ sinh viên đến trực tiếp quán để gặp Quản lý ca phỏng vấn nhanh và nhận việc."
  },
  availableShifts: [
    {
      id: "shift-morning",
      name: "Ca 1: Sáng Sớm (06:00 – 11:30)",
      desc: "Phục vụ cao điểm cà phê rang mộc & điểm tâm sáng nóng sốt",
      suitableFor: "Các bạn dậy sớm được, thích không khí tươi vui đầu ngày"
    },
    {
      id: "shift-afternoon",
      name: "Ca 2: Trưa – Chiều (11:30 – 17:00)",
      desc: "Phục vụ đồ uống giải nhiệt, trà trái cây và khách phòng lạnh",
      suitableFor: "Sinh viên học ca sáng, muốn làm thêm buổi chiều"
    },
    {
      id: "shift-evening",
      name: "Ca 3: Chiều Tối (17:00 – 22:30)",
      desc: "Phục vụ nhóm bạn tán gẫu vỉa hè & gia đình thư giãn sân vườn",
      suitableFor: "Sinh viên học ban ngày, rảnh buổi tối kiếm thêm thu nhập"
    },
    {
      id: "shift-flexible",
      name: "Ca Xoay / Part-time Linh Hoạt",
      desc: "Đăng ký lịch làm theo tuần dựa trên thời khóa biểu học tập",
      suitableFor: "Ưu tiên tối đa cho các bạn học sinh, sinh viên vừa học vừa làm"
    }
  ]
};

export const jobBenefits = [
  {
    icon: "school",
    title: "Không Cần Kinh Nghiệm",
    description: "Được đào tạo 1-1 tận tình từ cách pha phin mộc, kỹ năng bưng bê, giao tiếp với khách đến quy trình vận hành quán."
  },
  {
    icon: "schedule",
    title: "Nhiều Ca Làm Linh Hoạt",
    description: "Đa dạng các ca: Ca sáng (06:00 - 11:30), Ca trưa (11:30 - 17:00), Ca tối (17:00 - 22:30) và ca xoay linh hoạt cho sinh viên."
  },
  {
    icon: "handshake",
    title: "Phỏng Vấn Trực Tiếp Nhanh Gọn",
    description: "Đến trực tiếp quán tại đường Nguyễn Đáng, Trà Vinh để trao đổi trực quan, xem môi trường làm việc và nhận việc sớm."
  },
  {
    icon: "payments",
    title: "Thu Nhập Hấp Dẫn & Thưởng",
    description: "Lương part-time từ 24.000đ - 32.000đ/giờ + thưởng chuyên cần; lương cứng + thưởng doanh thu hàng tháng cho full-time."
  },
  {
    icon: "restaurant",
    title: "Bao Cơm Ca & Thức Uống",
    description: "Hỗ trợ bữa ăn ngon miệng theo ca trực và thưởng thức menu đồ uống thơm ngon miễn phí mỗi ngày làm việc."
  },
  {
    icon: "groups",
    title: "Môi Trường Trẻ Trung, Hòa Đồng",
    description: "Đồng đội thân thiện, giúp đỡ lẫn nhau như người nhà, tôn trọng và tạo cơ hội thăng tiến lên Trưởng ca."
  }
];

export const jobPositions = [
  {
    id: "job-service",
    title: "Nhân Viên Phục Vụ Bàn (Không cần kinh nghiệm)",
    type: "Part-time linh hoạt / Full-time",
    salary: "24.000đ – 28.000đ/giờ + Thưởng chuyên cần",
    slots: "05 người",
    shifts: "Ca sáng (06:00 – 11:30), Ca chiều (11:30 – 17:00), Ca tối (17:00 – 22:30)",
    experienceRequired: "Không cần kinh nghiệm – Đào tạo từ đầu",
    interviewMode: "Đến trực tiếp quán phỏng vấn",
    requirements: [
      "Độ tuổi từ 18 – 25 tuổi (ưu tiên sinh viên cần việc làm thêm)",
      "KHÔNG CẦN KINH NGHIỆM – Quán sẽ hướng dẫn chi tiết từng bước",
      "Vui vẻ, lễ phép, tươi cười niềm nở với khách hàng",
      "Nhanh nhẹn, trung thực, có mặt đúng giờ làm việc"
    ],
    responsibilities: [
      "Chào đón khách niềm nở khi bước vào quán",
      "Gợi ý menu món nước và điểm tâm sáng cho khách",
      "Bưng bê thức uống và món ăn ra bàn nhanh chóng, chu đáo",
      "Dọn dẹp bàn ghế gọn gàng, giữ gìn khu vực phục vụ luôn sạch sẽ"
    ]
  },
  {
    id: "job-barista",
    title: "Nhân Viên Pha Chế Đồ Uống (Được đào tạo tay nghề)",
    type: "Full-time / Part-time",
    salary: "6.500.000đ – 8.500.000đ/tháng (hoặc 28k – 32k/giờ)",
    slots: "03 người",
    shifts: "Ca sáng (06:00 – 14:00), Ca tối (14:00 – 22:00) hoặc Ca linh hoạt",
    experienceRequired: "Không cần kinh nghiệm – Sẽ được huấn luyện công thức chuẩn",
    interviewMode: "Đến trực tiếp quán phỏng vấn",
    requirements: [
      "Độ tuổi từ 18 – 28 tuổi, yêu thích cà phê và đồ uống",
      "KHÔNG CẦN KINH NGHIỆM – Được hướng dẫn pha phin truyền thống, trà trái cây và kem béo",
      "Sạch sẽ, tỉ mỉ, cẩn thận và có trách nhiệm với quầy bar",
      "Có tinh thần học hỏi và lắng nghe đóng góp của khách hàng"
    ],
    responsibilities: [
      "Chuẩn bị nguyên liệu sạch sẽ đầu ca làm việc",
      "Pha chế cà phê mộc, trà trái cây và thức uống theo đúng định lượng của quán",
      "Bảo quản nguyên vật liệu tươi mới và vệ sinh máy móc, dụng cụ sạch sẽ"
    ]
  }
];

export const recruitmentFaq = [
  {
    q: "Em chưa từng làm quán cà phê, chưa có kinh nghiệm gì có được nhận không?",
    a: "Chắc chắn ĐƯỢC! MIA COFFEE không đặt nặng kinh nghiệm cũ. Chỉ cần bạn chăm chỉ, đúng giờ, vui vẻ và có tinh thần học hỏi, quán sẽ đào tạo bạn từ A đến Z hoàn toàn miễn phí."
  },
  {
    q: "Phỏng vấn như thế nào? Em cần mang theo giấy tờ gì?",
    a: "Bạn hãy ĐẾN TRỰC TIẾP QUÁN tại đường Nguyễn Đáng, Trà Vinh trong khung giờ 08:00 – 17:00 hàng ngày. Khi đi chỉ cần mang theo CCCD (hoặc Thẻ sinh viên) để gặp Quản lý ca trao đổi trực tiếp, nhận ca làm và bắt đầu thử việc ngay."
  },
  {
    q: "Sinh viên có lịch học thay đổi theo tuần thì chia ca làm như thế nào?",
    a: "MIA COFFEE có nhiều ca làm (Sáng, Trưa, Tối) và hỗ trợ ca linh hoạt. Mỗi cuối tuần, bạn chỉ cần gửi thời khóa biểu học tập để Trưởng ca sắp xếp lịch làm việc phù hợp, đảm bảo không ảnh hưởng đến việc học."
  },
  {
    q: "Bao lâu sau khi phỏng vấn trực tiếp thì em được đi làm?",
    a: "Sau khi phỏng vấn trực tiếp tại quán, nếu hai bên cảm thấy phù hợp, bạn có thể nhận ca và đi làm ngay trong ngày hôm sau!"
  }
];
