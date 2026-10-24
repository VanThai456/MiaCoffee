/**
 * Brand Information & Structured Configuration for MIA COFFEE
 * Easily replaceable via REST API in future backend integration
 */

export const brandInfo = {
  name: "MIA COFFEE",
  tagline: "Cà Phê & Điểm Tâm Sáng",
  subTitle: "Không gian rộng rãi, thoáng mát ngoài trời và trong nhà",
  description:
    "Điểm hẹn thân quen cho bữa sáng ngon miệng và ly cà phê rang mộc thơm nồng mỗi ngày. Nơi lý tưởng để khởi đầu ngày mới tràn đầy năng lượng, họp mặt bạn bè hay quây quần cùng gia đình.",
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzFg69td66EmWjJcjLcP8L0c4-F8z10cu-yEj52L24g6AajSnPyYIUhbZodJ_WSYL7hq-iOuSO7oAbec2cQiEXWeNF27rdctiUQBCZ4ZDwX_pPF_FysGBUNDGneiieFAkXHYApmnHHPATkJEC0IEWmeCgsWgpZBchDnHSjAhl3ed19v4Iaue4HnqHuio_h-9AWyIX1-3ba62C6QfUsuX__dSWn6cP18c6faUpLQpxCB5CbH7QRanew39q28W_JPRhMIw",
  heroImage: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S0D86e5secnWGeCk84tjXg5A6SrXbX1MmF_TeSJNF9za_UjCmXDiNn26Jp19lZOMcRCnf4D7BEUC-r81b2s6I_Fm9BrECWFVjHWjFbKB9M3V96rnBeoNEfU8NS-Aln-T2TZ506=w1920-h1080-k-no",
  contact: {
    address: "Nguyễn Đáng, Trà Vinh, Tỉnh Vĩnh Long 87112, Vietnam",
    shortAddress: "Đường Nguyễn Đáng, Trà Vinh",
    hotline: "076 456 8484",
    hotlineDisplay: "076 456 8484",
    email: "lienhe@miacoffee.vn",
    recruitmentEmail: "tuyendung@miacoffee.vn",
    openingHours: "06:00 – 22:00 Hàng ngày",
    breakfastHours: "06:00 – 11:30 Mỗi sáng",
    mapsUrl: "https://www.google.com/maps/place/MIA+COFFEE/@9.9299152,106.3284272,3a,75y/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDHodyTRQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9S0D86e5secnWGeCk84tjXg5A6SrXbX1MmF_TeSJNF9za_UjCmXDiNn26Jp19lZOMcRCnf4D7BEUC-r81b2s6I_Fm9BrECWFVjHWjFbKB9M3V96rnBeoNEfU8NS-Aln-T2TZ506%3Dw397-h298-k-no!7i4032!8i3024!4m9!3m8!1s0x31a017002c0dd7b3:0xe802be3c83710093!8m2!3d9.9298178!4d106.3283385!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11ld7vtnd8?entry=ttu",
    facebookUrl: "https://facebook.com",
    zaloUrl: "https://zalo.me/0764568484",
    parkingNote: "Bãi đỗ xe ô tô và xe máy rộng rãi ngay trước quán, có nhân viên bảo vệ dắt xe và trông giữ an ninh chu đáo",
  },
  highlights: [
    {
      id: "parking",
      title: "BÃI ĐỖ XE RỘNG RÃI",
      number: "01",
      subtitle: "Mặt tiền thênh thang, an ninh chu đáo",
      description: "Khuôn viên bãi đỗ xe máy và ô tô thoải mái ngay trước quán, ra vào thông thoáng, có nhân viên bảo vệ dắt xe và trông coi an toàn tuyệt đối suốt thời gian bạn thưởng thức cà phê.",
      features: [
        "Sức chứa nhiều xe ô tô & xe máy cùng lúc",
        "Nhân viên bảo vệ dắt xe & trông coi chu đáo",
        "Hoàn toàn an toàn và miễn phí 100%"
      ],
      image: "/images/bai-do-xe.jpg",
      objectPosition: "center"
    },
    {
      id: "phong-lanh",
      title: "PHÒNG LẠNH MÁT MẺ",
      number: "02",
      subtitle: "Yên tĩnh, mát mẻ & đầy đủ tiện nghi",
      description: "2 phòng máy lạnh mát dịu, âm nhạc acoustic nhẹ nhàng, Wi-Fi tốc độ cao và ổ cắm điện tiện lợi tại từng bàn. Không gian lý tưởng để học bài, chạy deadline hay họp nhóm.",
      features: [
        "Điều hòa mát dịu, âm nhạc acoustic thư giãn",
        "Ổ cắm điện & Wi-Fi cáp quang từng vị trí",
        "Bàn ghế chuẩn công thái học ngồi lâu thoải mái"
      ],
      image: "/images/phong-lanh.jpg",
      objectPosition: "center"
    },
    {
      id: "ho-ca",
      title: "HỒ CÁ ĐA DẠNG",
      number: "03",
      subtitle: "Tiếng nước róc rách & đàn cá bơi lội thanh bình",
      description: "Điểm nhấn sinh thái độc đáo với hồ cá trong vắt, quy tụ đàn cá cảnh to khỏe nhiều màu sắc tung tăng bơi lội. Nơi ngắm cảnh thư thái xua tan âu lo cho mọi lứa tuổi.",
      features: [
        "Đàn cá cảnh bơi lội sinh động, gần gũi thiên nhiên",
        "Thanh âm nước róc rách mang lại cảm giác an yên",
        "Góc check-in chụp ảnh ấn tượng cho cả gia đình"
      ],
      image: "/images/ho-ca.jpg",
      objectPosition: "center"
    },
    {
      id: "khong-gian",
      title: "KHÔNG GIAN THOÁNG MÁT",
      number: "04",
      subtitle: "Khuôn viên mở rợp bóng cây xanh & gió mát",
      description: "Khuôn viên rộng lớn với thiết kế mở đón trọn gió trời, kết hợp khu sân vườn cây xanh rợp bóng mát, khu vỉa hè ngắm phố và khu vui chơi ngoài trời an toàn cho trẻ nhỏ.",
      features: [
        "Bàn ghế gỗ mộc mạc bài trí thoáng rộng",
        "Tán cây xanh mát rượi quanh năm trong lành",
        "Khu vui chơi cầu trượt xích đu cho các bé"
      ],
      image: "/images/khong-gian-thoang-mat.jpg",
      objectPosition: "center"
    }
  ],
  stats: [
    { label: "Năm Thành Lập", value: "2019" },
    { label: "Khu Vực Phục Vụ", value: "6 Khu" },
    { label: "Sức Chứa Khách", value: "200+" },
    { label: "Khách Thân Thiết", value: "10K+" }
  ]
};
