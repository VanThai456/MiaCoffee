/**
 * Space Zones, Amenities & Gallery Data for MIA COFFEE
 * Strictly structured according to MIA COFFEE's spacious layout:
 * 1. Khu Sân Vườn (không khí mát, không gian mở, rợp bóng cây xanh)
 * 2. Khu Vỉa Hè (thoáng mát, thoải mái, cho nhóm bạn tán gẫu & các chú ngồi hàn huyên)
 * 3. Khu Hồ Cá (hồ cá với nhiều con cá to phong phú cho mọi người ngắm nhìn)
 * 4. Khu Ngoài Trời & Vui Chơi Trẻ Em (không gian mở, cảnh đẹp, có cầu trượt & xích đu)
 * 5. 2 Phòng Lạnh Riêng Biệt (mát mẻ, yên tĩnh, phù hợp học hành, họp bàn công việc)
 * 6. Khu Nhà Vệ Sinh (rộng rãi, thoáng mát, sạch đẹp, tiện nghi cao cấp)
 * Điểm nổi bật: Không gian rộng lớn, đa dạng khu vực phù hợp mọi lứa tuổi, bãi đỗ xe ô tô rộng rãi có người trông giữ.
 */

export const spaceHighlights = {
  title: "Không Gian Rộng Lớn Đa Thế Hệ",
  badge: "Điểm Đến Lý Tưởng Mọi Lứa Tuổi",
  subtitle: "Từ góc trò chuyện sôi nổi đến không gian yên tĩnh học tập",
  description: "MIA COFFEE sở hữu khuôn viên rộng rãi hiếm có với nhiều phân khu chức năng được thiết kế riêng biệt. Dù là trẻ nhỏ cần chỗ vui chơi, sinh viên cần nơi học tập, nhóm bạn trẻ tụ tập hay các cô chú ngồi hàn huyên ngắm phố — quán luôn có một góc ngồi hoàn hảo dành cho bạn.",
  parkingNotice: {
    title: "Bãi Đỗ Xe Rộng Rãi - An Ninh Chu Đáo",
    desc: "Khu vực đỗ xe máy và ô tô thoải mái ngay mặt tiền quán, có nhân viên bảo vệ tận tình hỗ trợ dắt xe và trông coi an toàn tuyệt đối suốt thời gian bạn thưởng thức cà phê.",
    icon: "local_parking"
  }
};

export const spaceZones = [
  {
    id: "zone-garden",
    name: "Khu Sân Vườn Cây Xanh",
    tagline: "Không khí mát lành, không gian mở hòa mình vào thiên nhiên",
    description: "Khu vực sân vườn rộng mở được bao phủ bởi những tán cây xanh mướt và gió trời tự nhiên. Nơi lý tưởng để bạn bắt đầu ngày mới với một tách cà phê rang mộc thơm nồng, hít thở không khí trong lành và lắng nghe tiếng chim ríu rít.",
    capacity: "60+ chỗ ngồi",
    targetAudience: "Mọi lứa tuổi, gia đình & người yêu thích sự thư thái",
    features: [
      "Không khí trong lành, gió mát tự nhiên",
      "Rợp bóng cây xanh mát rượi quanh năm",
      "Bố trí bàn đôi và bàn nhóm rộng rãi",
      "Không gian mở thư thái, thoáng đãng"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb6qXq04Jjw1veQKs-KEmREkHTmsHv3gSuIn5r3187vztdF8UFGHuA3jb4D2Hsj0_LGILyokSrrQT5DZrN6nIXgQvY3X71uATmY9wHR9LGHJxSTMjQZoJQfRmEUxXcs2bHMx0ACE00J2K86iZ8e7NfVRsiGar050Rr302KbBIw6jE7VHmJ7StGhnpe0uzDhqsUtvhvcFSgHW9Fwzk-HKbBJ1ewGmQL5RsqDikmY7T-nmIYGnsd3XBp"
  },
  {
    id: "zone-sidewalk",
    name: "Khu Vỉa Hè Thoáng Mát",
    tagline: "Thoải mái ngắm phố, nơi nhóm bạn tụ tập & các chú ngồi hàn huyên",
    description: "Dãy bàn ghế vỉa hè thoáng mát, đón trọn nhịp sống phố thị sôi động. Đây là góc ngồi quen thuộc cho những buổi sáng hàn huyên nhâm nhi tách cà phê đen của các chú bác, hay những buổi tối rôm rả chuyện trò cùng hội bạn thân bên ly trà trái cây mát lạnh.",
    capacity: "40+ chỗ ngồi",
    targetAudience: "Nhóm bạn trẻ tán gẫu, chú bác đàm đạo hàn huyên",
    features: [
      "Vị trí mặt tiền thoáng mát, tầm nhìn rộng mở",
      "Không khí tự nhiên, thoải mái trò chuyện",
      "Thích hợp đàm đạo sáng sớm và ngắm phố về đêm",
      "Phục vụ cà phê phin và điểm tâm sáng nhanh chóng"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsH4bCbh21rg5WaS4iDje-Q5_oR1ZFcAzAz6ZfD3M22NIMFc__rTSyllXSzxWFDglXbsMiUYRZ6mnjtdxAjy4SlmhJoBxeVDvWemX5BZWC02YXELxqkztubUNi9nfiOVPZ1SdPuTfluW97G-uMEHfh-5W5tJm2REtBxGqiza-_XsS4zU0VnELN5lpZlVDRvjPUivc09TQQ1Z2gNLZvDcSg4Uy-oT7NC0-K298USiD3QUyasQGIMXx8vHcITy95wflGsg"
  },
  {
    id: "zone-fishpond",
    name: "Khu Hồ Cá Cảnh Thư Giãn",
    tagline: "Ngắm đàn cá to nhiều chủng loại bơi lội thanh bình",
    description: "Điểm nhấn sinh thái độc đáo tại MIA COFFEE với hồ cá trong vắt, nơi quy tụ nhiều loại cá to khỏe khoắn bơi lội tung tăng. Tiếng nước róc rách êm dịu kết hợp cùng hình ảnh đàn cá đủ sắc màu mang lại cảm giác an yên tuyệt đối cho cả người lớn lẫn các bạn nhỏ thích thú ngắm nhìn.",
    capacity: "35+ chỗ ngồi quanh hồ",
    targetAudience: "Khách thích thư giãn, người lớn tuổi & trẻ em",
    features: [
      "Hồ cá rộng với nhiều loại cá to bơi lội sinh động",
      "Tiếng nước chảy róc rách tạo cảm giác tĩnh tâm",
      "Bàn ghế gỗ mộc bố trí sát hồ ngắm cá thoải mái",
      "Góc check-in và thư giãn được nhiều khách yêu thích"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAavs3BoaSNZ3jP6O6kv0ImbMrJ7yrcSOcdewHBBcUSfCXrl9nkfjY3NOrZrSxMUxcKR6TYFVgvoSU_AooWR3Qf77HE7_SD8ObX2NKR-XDO-1350BPGy6K0NTO1p4SKY2UBB33fcHKLNNTHmJBQvbcze7VXsAIBd4SCQGXHnhyz4HdNbdz3yXbyCo3-8G6koLIQO-DnbBoe72WQNw9hHAz4Jy0jU6CnzpDZ8DEZ5uIbYoPDFS9Sa3CQ"
  },
  {
    id: "zone-outdoor-playground",
    name: "Khu Ngoài Trời & Vui Chơi Trẻ Em",
    tagline: "Không gian mở thoáng đãng, có cầu trượt & xích đu cho các bé",
    description: "Khu vực sân chơi ngoài trời rộng rãi, râm mát, có sẵn xích đu và cầu trượt an toàn dành riêng cho các thiên thần nhỏ. Bố mẹ vừa an tâm nhâm nhi đồ uống ngon lành, vừa có thể quan sát các con thỏa sức vui đùa trong khuôn viên an toàn của quán.",
    capacity: "50+ chỗ ngồi gia đình",
    targetAudience: "Gia đình có con nhỏ, nhóm bạn trẻ thích ngoại cảnh",
    features: [
      "Trang bị cầu trượt & xích đu sạch sẽ, an toàn cho trẻ",
      "Không gian mở cảnh quan đẹp, thoáng đãng",
      "Bàn ghế gia đình bố trí tầm nhìn bao quát khu vui chơi",
      "Nơi lý tưởng cho các buổi tụ họp gia đình cuối tuần"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkkxEEFq0AoIH9I0_ymnz3UsVPufaOv2Z9PUJCvgli4ugZJRH-3t3ipRYNvnYNvi-XAb7NC9VlxfxX5sh_1Cl6kR3tm7QAkPxLqM2i-yUjE9fM2CCNVvyOqdOE4fhZadfqMQQihz4KqnEoP4Nlbn6JWPDDWJCjQ0pgLAOuo2nyAdEPfBflOJJsYVAvAh-Q5UP0Ld4sf09HwLkQksXEFPLssidxWGdi4Lfd5YOfYRCkRyF2IdE1Gbb9"
  },
  {
    id: "zone-ac-rooms",
    name: "2 Phòng Lạnh Riêng Biệt (Study & Meeting)",
    tagline: "Mát lạnh, yên tĩnh, chuyên dành cho học tập & họp bàn công việc",
    description: "Hệ thống 2 phòng máy lạnh khép kín, được cách âm tương đối và duy trì nhiệt độ lý tưởng mát rượi suốt cả ngày. Trang bị đầy đủ ổ cắm điện tại từng vị trí ngồi, bàn ghế công thái học và mạng Wifi tốc độ cao, cực kỳ thích hợp cho học sinh sinh viên ôn bài hoặc các nhóm họp bàn dự án.",
    capacity: "2 phòng riêng biệt (40+ chỗ ngồi)",
    targetAudience: "Học sinh sinh viên, người làm việc tự do & họp bàn nhóm",
    features: [
      "2 phòng máy lạnh biệt lập nhiệt độ 23 - 24°C mát rượi",
      "Không gian yên tĩnh, lịch sự, tập trung cao độ",
      "Ổ cắm điện đa năng bố trí thuận tiện tại mỗi bàn",
      "Wifi cáp quang tốc độ cao, hỗ trợ học tập & làm việc online"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKXJgdmhHnLXaXltr0y80lpPhakfha-dzwB84tejQRqeQR9ZESkVAWDXwQCTjytrdFyzcSuBa0ioICW-lGfbPUxPt8GsgD62tZKctiJwsOnR_y1HF_F4mKM0z53rsjDWrVyI9dYs_05UA69lo0D1zAdLGKKmGcFm_nRpu9RQ-pvb5n80ErP-Zr671tdPlOaUTEcxatBwvce3WMzVX5Nq3Yn6QFSYvIaX5jnfaKNhujSuqoqzNbr1D-"
  },
  {
    id: "zone-restroom",
    name: "Khu Nhà Vệ Sinh Sạch Đẹp & Thoáng Mát",
    tagline: "Rộng rãi, thông thoáng, thơm mát và giữ gìn vệ sinh liên tục",
    description: "MIA COFFEE đặc biệt chú trọng khu vực vệ sinh với thiết kế hiện đại, diện tích rộng rãi, thông gió tự nhiên thoáng đãng và tách biệt khu vực nam/nữ. Được nhân viên kiểm tra, lau dọn liên tục đảm bảo luôn sạch sẽ, thơm tho và khô ráo để khách hàng cảm thấy thoải mái nhất.",
    capacity: "Tách biệt Nam & Nữ",
    targetAudience: "Phục vụ chu đáo mọi quý khách hàng",
    features: [
      "Không gian rộng rãi, thông gió thoáng mát tự nhiên",
      "Trang bị gương đèn led, bồn rửa tay sạch đẹp",
      "Lau dọn, khử khuẩn và khử mùi thơm mát liên tục trong ngày",
      "Đầy đủ nước rửa tay diệt khuẩn, giấy lau sạch sẽ"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjY5S8xCVQ5fo1uymKBVjznL5dvQ0Bt4TJ4CtWbP-ZvV1-anY6YQOZygjxMEmfITxf1-fDmpUbPq3ggghYkGf23Q3EACV089DQ83Z-sC-pIM_WadNpZZxvzOLqahepUcf9nfmxNxgvl5p3oL7dJ2N1jjx6q5pggr1wlyBlJnuU4-4dJ1ZGhgBTe4J8mlBMdQ_SCJHjZKOc4mCh50-q8B6r4Cvwaxd1sjTlv3T-UiHlX-4bBMyHtiOM"
  }
];

export const spaceAmenities = [
  {
    icon: "local_parking",
    title: "Bãi Đậu Xe Ô Tô & Xe Máy Có Người Giữ",
    description: "Mặt tiền rộng rãi, đậu được nhiều ô tô và xe máy cùng lúc, có nhân viên bảo vệ hỗ trợ dắt xe và trông coi an toàn chu đáo."
  },
  {
    icon: "groups_2",
    title: "Phù Hợp Cho Mọi Lứa Tuổi",
    description: "Thiết kế nhiều khu vực riêng biệt: từ trẻ nhỏ chơi cầu trượt/xích đu đến học sinh sinh viên học bài và người lớn tuổi hàn huyên."
  },
  {
    icon: "toys",
    title: "Khu Vui Chơi Trẻ Em",
    description: "Cầu trượt, xích đu ngoài trời an toàn giúp các bé thỏa sức vui chơi trong khi bố mẹ thoải mái thưởng thức đồ uống."
  },
  {
    icon: "set_meal",
    title: "Hồ Cá Thư Giãn Độc Đáo",
    description: "Hồ cá lớn với nhiều con cá to sinh động, cảnh quan mát mắt giúp xua tan mọi căng thẳng mệt mỏi."
  },
  {
    icon: "ac_unit",
    title: "2 Phòng Lạnh Học Hành & Họp Bàn",
    description: "Không gian máy lạnh êm ái, yên tĩnh, trang bị ổ điện đầy đủ phục vụ học tập, làm việc nhóm hiệu quả."
  },
  {
    icon: "clean_hands",
    title: "Nhà Vệ Sinh Rộng Thoáng & Sạch Đẹp",
    description: "Khu vực vệ sinh rộng rãi, thông thoáng, thơm mát được lau dọn thường xuyên mang lại sự hài lòng cao nhất."
  }
];

export const spaceGallery = [
  {
    id: "gal-1",
    title: "Bãi Đậu Xe Rộng Rãi Mặt Tiền",
    category: "parking",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsH4bCbh21rg5WaS4iDje-Q5_oR1ZFcAzAz6ZfD3M22NIMFc__rTSyllXSzxWFDglXbsMiUYRZ6mnjtdxAjy4SlmhJoBxeVDvWemX5BZWC02YXELxqkztubUNi9nfiOVPZ1SdPuTfluW97G-uMEHfh-5W5tJm2REtBxGqiza-_XsS4zU0VnELN5lpZlVDRvjPUivc09TQQ1Z2gNLZvDcSg4Uy-oT7NC0-K298USiD3QUyasQGIMXx8vHcITy95wflGsg"
  },
  {
    id: "gal-2",
    title: "Khu Sân Vườn Xanh Mát",
    category: "garden",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb6qXq04Jjw1veQKs-KEmREkHTmsHv3gSuIn5r3187vztdF8UFGHuA3jb4D2Hsj0_LGILyokSrrQT5DZrN6nIXgQvY3X71uATmY9wHR9LGHJxSTMjQZoJQfRmEUxXcs2bHMx0ACE00J2K86iZ8e7NfVRsiGar050Rr302KbBIw6jE7VHmJ7StGhnpe0uzDhqsUtvhvcFSgHW9Fwzk-HKbBJ1ewGmQL5RsqDikmY7T-nmIYGnsd3XBp"
  },
  {
    id: "gal-3",
    title: "Phòng Lạnh Yên Tĩnh Học Tập & Họp Bàn",
    category: "indoor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKXJgdmhHnLXaXltr0y80lpPhakfha-dzwB84tejQRqeQR9ZESkVAWDXwQCTjytrdFyzcSuBa0ioICW-lGfbPUxPt8GsgD62tZKctiJwsOnR_y1HF_F4mKM0z53rsjDWrVyI9dYs_05UA69lo0D1zAdLGKKmGcFm_nRpu9RQ-pvb5n80ErP-Zr671tdPlOaUTEcxatBwvce3WMzVX5Nq3Yn6QFSYvIaX5jnfaKNhujSuqoqzNbr1D-"
  },
  {
    id: "gal-4",
    title: "Khu Vực Hồ Cá Cảnh Thư Thái",
    category: "pond",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAavs3BoaSNZ3jP6O6kv0ImbMrJ7yrcSOcdewHBBcUSfCXrl9nkfjY3NOrZrSxMUxcKR6TYFVgvoSU_AooWR3Qf77HE7_SD8ObX2NKR-XDO-1350BPGy6K0NTO1p4SKY2UBB33fcHKLNNTHmJBQvbcze7VXsAIBd4SCQGXHnhyz4HdNbdz3yXbyCo3-8G6koLIQO-DnbBoe72WQNw9hHAz4Jy0jU6CnzpDZ8DEZ5uIbYoPDFS9Sa3CQ"
  },
  {
    id: "gal-5",
    title: "Khu Vui Chơi Cầu Trượt & Xích Đu Trẻ Em",
    category: "kids",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkkxEEFq0AoIH9I0_ymnz3UsVPufaOv2Z9PUJCvgli4ugZJRH-3t3ipRYNvnYNvi-XAb7NC9VlxfxX5sh_1Cl6kR3tm7QAkPxLqM2i-yUjE9fM2CCNVvyOqdOE4fhZadfqMQQihz4KqnEoP4Nlbn6JWPDDWJCjQ0pgLAOuo2nyAdEPfBflOJJsYVAvAh-Q5UP0Ld4sf09HwLkQksXEFPLssidxWGdi4Lfd5YOfYRCkRyF2IdE1Gbb9"
  },
  {
    id: "gal-6",
    title: "Khu Vỉa Hè Tán Gẫu & Hàn Huyên",
    category: "sidewalk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjY5S8xCVQ5fo1uymKBVjznL5dvQ0Bt4TJ4CtWbP-ZvV1-anY6YQOZygjxMEmfITxf1-fDmpUbPq3ggghYkGf23Q3EACV089DQ83Z-sC-pIM_WadNpZZxvzOLqahepUcf9nfmxNxgvl5p3oL7dJ2N1jjx6q5pggr1wlyBlJnuU4-4dJ1ZGhgBTe4J8mlBMdQ_SCJHjZKOc4mCh50-q8B6r4Cvwaxd1sjTlv3T-UiHlX-4bBMyHtiOM"
  }
];
