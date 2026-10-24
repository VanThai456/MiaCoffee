import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 8 Space Photos from Google Maps (MIA COFFEE Trà Vinh)
 * Categorized by aspect ratio:
 * - Landscape (Ngang): Photo 1 (1600x1200), Photo 3 (1600x900), Photo 7 (1600x1200) -> To bằng cả cuốn sách (Double-spread)
 * - Portrait (Dọc): Photo 2 (1600x2844), Photo 4 (1600x1600), Photo 5 (960x1280), Photo 6 (1600x2844), Photo 8 (1600x2133) -> Nằm 1 bên, trang bên kia ghi thông tin
 */
export const spaceBookPhotos = [
  {
    id: 1,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QFxuMywRSHLq8nwbwORUKaHlvKxuX1Mfsn6P-5lVsdLph6tp1-SP5SxGoV1B8SUwhJeSLqL5DaZrnhvZY0N3EOup4HZW3h9eCqqlz-DtghTbbA2G6VnaJJu2aI4L8cAVox2A1s=w1600",
    title: "Mặt Tiền & Lối Vào Thoáng Đãng",
    isLandscape: true,
    aspectRatio: 1600 / 1200
  },
  {
    id: 2,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TLWv2KWumuNlUnOAZy6AKFQ8qYs_b11P2r7dbx-aohv6cE26sHDmnrA7ovta9L9JLAKaM43EAlmf7NyZ8OsGX9KxZ1WegX3BtdVVaCngTsf1QoI97weD3WpXmrqnZ7zqfhf_Q0eQ=w1600",
    title: "Khuôn Viên Ngoài Trời",
    isLandscape: false,
    category: "Góc Sân Vườn Thiên Nhiên",
    subtitle: "Không Khí Trong Lành & Gió Mát Tự Nhiên",
    description: "Được bao bọc bởi không gian mở chan hòa ánh sáng và cây xanh rợp bóng mát. Nơi lý tưởng để bạn bắt đầu ngày mới tràn đầy năng lượng bên tách cà phê rang mộc và điểm tâm sáng nóng hổi.",
    highlights: [
      "Bàn ghế gỗ mộc mạc bài trí thoáng rộng",
      "Tán cây xanh râm mát dễ chịu suốt ngày dài",
      "Phục vụ cà phê & điểm tâm sáng từ 06:00 mỗi ngày"
    ]
  },
  {
    id: 3,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Tz5TZeumJn9iHmlzusTzUcx7QIItgSUF_F4XOlDRpp1JW-iY94HvusQjf_HcnOWsTEBI3XiL8PuCjVEsbG7alTdm25kEv6kfjQNbBZ8LYDouUb12lCuoNrmAuCoXirkcQti7rkoji7_k4=w1600",
    title: "Quy Mô Quán & Kiến Trúc Hiện Đại",
    isLandscape: true,
    aspectRatio: 1600 / 900
  },
  {
    id: 4,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QEIo-6RQvKm2xozuJVeOSkvyLKAKKwwhsDPAp7RU8Y7vbmZywc79lFceD21f7Ud7WUD6HukOJUegq4-l6liLV899WxqlvQ9jq4mkcjtP4wK08PZq-6j8NKuziWSPLPCNMwCIDy=w1600",
    title: "Hồ Cá Cảnh Thư Thái",
    isLandscape: false,
    category: "Điểm Hẹn Thư Giãn",
    subtitle: "Thanh Âm Róc Rách & Đàn Cá Bơi Lội",
    description: "Điểm dừng chân yêu thích của thực khách mọi lứa tuổi. Ngắm nhìn đàn cá bơi lội thanh bình và lắng nghe tiếng nước róc rách mang lại cảm giác an yên sau những giờ làm việc mệt mỏi.",
    highlights: [
      "Đàn cá cảnh sinh động, gần gũi thiên nhiên",
      "Góc check-in chụp ảnh ấn tượng cho cả gia đình",
      "Cảnh quan nước mát lành giúp xua tan âu lo"
    ]
  },
  {
    id: 5,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QV7zC5-gpKxVahMLTri1tjJk7KFleKNca87u9TRvpEgZRKhaELRCz167RYrSXsIgqEYhPwOb_f-V1DSPwnfztHNz7Ex2DGy0jtiQaE045DBzfK_SS07yMHWyrAJ_vCODgdpx1p=w1600",
    title: "Bàn Ghế Gỗ Sân Vườn",
    isLandscape: false,
    category: "Góc Ngồi Ấm Cúng",
    subtitle: "Không Gian Trò Chuyện & Hàn Huyên",
    description: "Từng bộ bàn ghế gỗ tự nhiên được bài trí khéo léo dưới tán cây râm mát, tạo khoảng cách riêng tư tối đa cho những buổi trò chuyện thân mật cùng bạn bè, đối tác và người thân.",
    highlights: [
      "Chỗ ngồi êm ái, khoảng cách bàn thông thoáng",
      "Thích hợp gặp gỡ bạn bè, gia đình & đối tác",
      "Thưởng thức điểm tâm sáng ngon miệng trong gió sớm"
    ]
  },
  {
    id: 6,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Rkre9O-MocTlMumcjoIzu1uOZo8wn65M8SED1-egq6UPYAGUdYatY9Kc0U3dp6yR5W9YGOKVjDb7O_RXjPZp7M-ZW4W2M-XWf54GlGFm-VTLropTONH3m-fGF1Zt4GAWaN0ZrFnzQi_aBQ=w1600",
    title: "Phòng Lạnh Yên Tĩnh",
    isLandscape: false,
    category: "Học Tập & Làm Việc",
    subtitle: "Không Gian Tập Trung & Tiện Nghi",
    description: "Quán bố trí 2 phòng máy lạnh mát dịu, âm nhạc acoustic nhẹ nhàng, Wi-Fi tốc độ cao và ổ cắm điện trang bị tiện lợi tại từng vị trí ngồi. Không gian lý tưởng để học tập, làm việc hay họp nhóm.",
    highlights: [
      "Điều hòa mát dịu, âm nhạc acoustic thư giãn",
      "Ổ cắm điện và wifi cáp quang tốc độ cao tại từng bàn",
      "Bàn ghế chuẩn công thái học cho làm việc dài lâu"
    ]
  },
  {
    id: 7,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TWJuNior4U8FUEAoDnzTdYDDiO0JDC9bDFZrKstdkHsNLRHs5hKimAhBYKmOC8EMqelwVx0yvq-uJR1CSBIhKAqc8oD2tmp1aDvtTw8CvrSNKSqceeDnlGRjoUgTj8Z4lsgNaGs7xjP81a=w1600",
    title: "Khu Vui Chơi Dành Cho Trẻ Em",
    isLandscape: true,
    aspectRatio: 1600 / 1200
  },
  {
    id: 8,
    url: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QgU24jLmDonzBwYkR-zg2sptz1g2Dn9RgZAO1lZbp8ziSwcnOnaG9727aLaiLzFKxr3gpurBK4whNqk0XdOA_BaL-RN73b-SRpbUXV4E-GDYbt3EjJgC0w5z5dvbnFRgXv5l6e=w1600",
    title: "Bãi Đậu Ô Tô & Xe Máy",
    isLandscape: false,
    category: "Tiện Ích Chu Đáo",
    subtitle: "Đậu Ô Tô Thênh Thang & An Toàn Tuyệt Đối",
    description: "Một trong những ưu thế vượt trội của MIA COFFEE là khuôn viên bãi đỗ ô tô và xe máy rộng thênh thang ngay trước quán, ra vào thuận tiện, có nhân viên bảo vệ trông giữ an ninh chu đáo và hoàn toàn miễn phí.",
    highlights: [
      "Sức chứa nhiều xe ô tô cùng lúc dễ dàng",
      "Nhân viên bảo vệ trông xe chu đáo, an tâm thưởng thức",
      "Đậu xe an toàn và hoàn toàn miễn phí"
    ]
  }
];

/**
 * Pure Scroll-Driven 3D Book Component
 * Features:
 * 1. Chỉ cuộn chuột / cuộn xuống mới lật sách (loại bỏ kéo chuột).
 * 2. Loại bỏ toàn bộ chức năng và nút phóng to ảnh.
 * 3. Kích thước sách ~90% section, hạ xít xuống dưới thanh header.
 * 4. Ảnh ngang mở ra to bằng cả cuốn sách (double-spread seamless).
 * 5. Ảnh dọc nằm 1 bên, trang bên kia ghi thông tin.
 * 6. Hiệu ứng lật trang mềm mại như giấy thật.
 */
export default function SpaceBookFlip() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic Dimension Calculation (Taking into account the ~72px-85px fixed header)
  const [bookDims, setBookDims] = useState({
    width: 1180,
    height: 620,
    pageWidth: 590
  });

  const updateBookDims = useCallback(() => {
    if (typeof window === 'undefined') return;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const isMobile = winW < 640;
    const isTablet = winW >= 640 && winW < 1024;
    const headerHeight = isMobile ? 56 : 85;

    // Available space strictly below the fixed header
    const visibleH = winH - headerHeight;

    let w, h;

    if (isMobile) {
      // Mobile: Width is 94% of screen (capped at 430px)
      w = Math.min(winW * 0.94, 430);
      // Realistic open book ratio (Width / Height ≈ 1.14)
      // Fills viewport nicely without large empty top/bottom voids
      const idealH = w / 1.14;
      h = Math.min(idealH, visibleH * 0.65);
    } else if (isTablet) {
      w = Math.min(winW * 0.90, 780);
      const idealH = w / 1.35;
      h = Math.min(idealH, visibleH * 0.72, 540);
    } else {
      // Desktop / Laptop
      const availW = winW * 0.90;
      const availH = visibleH * 0.85;
      w = Math.min(availW, 1260);
      h = Math.min(availH, 640);
      if (w / h < 1.4) {
        h = w / 1.4;
      }
    }

    setBookDims({
      width: Math.round(w),
      height: Math.round(h),
      pageWidth: Math.round(w / 2)
    });
  }, []);

  useEffect(() => {
    updateBookDims();
    window.addEventListener('resize', updateBookDims);
    return () => window.removeEventListener('resize', updateBookDims);
  }, [updateBookDims]);

  // Pure Scroll listener (Driven strictly by vertical page scrolling)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current.getBoundingClientRect();
          const windowH = window.innerHeight;
          const containerH = containerRef.current.offsetHeight;
          const scrollDistance = containerH - windowH;

          if (scrollDistance > 0) {
            const isMobile = window.innerWidth < 640;
            const stickyOffset = isMobile ? 56 : 0;
            const currentScroll = -(rect.top - stickyOffset);
            const rawProgress = currentScroll / scrollDistance;
            const clamped = Math.min(Math.max(rawProgress, 0), 1);
            setScrollProgress(clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth natural easing for 3D flip (0 -> -180 deg)
  const getPhaseAngle = (progress, start, end) => {
    if (progress <= start) return 0;
    if (progress >= end) return -180;
    const p = (progress - start) / (end - start);
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    return -180 * eased;
  };

  // Rotation angles for 8 photo spreads + cover & closing:
  const coverAngle = getPhaseAngle(scrollProgress, 0.02, 0.13);
  const sheet1Angle = getPhaseAngle(scrollProgress, 0.15, 0.25);
  const sheet2Angle = getPhaseAngle(scrollProgress, 0.27, 0.37);
  const sheet3Angle = getPhaseAngle(scrollProgress, 0.39, 0.49);
  const sheet4Angle = getPhaseAngle(scrollProgress, 0.51, 0.61);
  const sheet5Angle = getPhaseAngle(scrollProgress, 0.63, 0.73);
  const sheet6Angle = getPhaseAngle(scrollProgress, 0.75, 0.85);
  const sheet7Angle = getPhaseAngle(scrollProgress, 0.87, 0.94);
  const closeAngle = getPhaseAngle(scrollProgress, 0.95, 0.99);

  // Active Photo Index for Ambient Backdrop
  let activePhotoIdx = -1;
  if (scrollProgress >= 0.02 && scrollProgress < 0.15) activePhotoIdx = 0;
  else if (scrollProgress >= 0.15 && scrollProgress < 0.27) activePhotoIdx = 1;
  else if (scrollProgress >= 0.27 && scrollProgress < 0.39) activePhotoIdx = 2;
  else if (scrollProgress >= 0.39 && scrollProgress < 0.51) activePhotoIdx = 3;
  else if (scrollProgress >= 0.51 && scrollProgress < 0.63) activePhotoIdx = 4;
  else if (scrollProgress >= 0.63 && scrollProgress < 0.75) activePhotoIdx = 5;
  else if (scrollProgress >= 0.75 && scrollProgress < 0.87) activePhotoIdx = 6;
  else if (scrollProgress >= 0.87 && scrollProgress <= 1.0) activePhotoIdx = 7;

  // Dynamic Horizontal Centering
  const halfPage = bookDims.pageWidth / 2;
  let horizontalShiftPx = 0;
  if (coverAngle > -180) {
    const openRatio = Math.abs(coverAngle) / 180;
    horizontalShiftPx = -halfPage * (1 - openRatio);
  } else if (closeAngle < 0) {
    const closeRatio = Math.abs(closeAngle) / 180;
    horizontalShiftPx = halfPage * closeRatio;
  }

  // Soft Paper Flip: Organic paper curl curve (skewY)
  const getSoftPaperTransform = (angle) => {
    const progress = Math.abs(angle) / 180;
    const curlSkew = Math.sin(progress * Math.PI) * 2.2;
    return `rotateY(${angle}deg) skewY(${curlSkew}deg)`;
  };

  // Dynamic z-index stacking
  const getZIndex = (angle, rightZ, leftZ) => {
    if (angle > -5) return rightZ;
    if (angle < -175) return leftZ;
    return 130;
  };

  const isCoverClosed = coverAngle >= -5;
  const isBookClosed = closeAngle <= -175;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[250vh] sm:min-h-[580vh] w-full"
      id="khong-gian-cuon-sach"
    >
      {/* Pinned Sticky Stage - Shifted down below header, strictly scroll-driven */}
      <div className="sticky top-14 sm:top-0 h-[calc(100dvh-3.5rem)] sm:h-screen w-full flex flex-col items-center justify-center py-2 sm:pt-24 sm:pb-6 overflow-hidden px-2 sm:px-4 select-none">
        
        {/* ================= DYNAMIC AMBIENT BACKDROP ================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#09150e]" />
          {spaceBookPhotos.map((photo, idx) => {
            const isActive = activePhotoIdx === idx;
            return (
              <div
                key={idx}
                className="absolute inset-0 will-change-transform"
                style={{
                  opacity: isActive ? 0.42 : 0,
                  transform: isActive ? 'scale(1.1)' : 'scale(1.18)',
                  transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s ease-out'
                }}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover filter blur-[65px] saturate-150"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-radial from-transparent via-[#08130d]/55 to-[#040906]/95" />
              </div>
            );
          })}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-[#92f7c3]/6 rounded-full blur-[160px]" />
        </div>

        {/* ================= 3D BOOK STAGE CONTAINER (90% SIZED, LOWERED BELOW HEADER) ================= */}
        <div
          className="relative z-10 flex items-center justify-center will-change-transform transition-transform duration-75"
          style={{
            width: `${bookDims.width}px`,
            height: `${bookDims.height}px`,
            transform: `translateX(${horizontalShiftPx}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* 3D PERSPECTIVE WRAPPER */}
          <div
            className="relative w-full h-full"
            style={{
              perspective: '2500px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {/* UNDERLAY BASE: Parchment Pages */}
            <div
              className="absolute inset-0 flex transition-opacity duration-300 pointer-events-none"
              style={{ opacity: isCoverClosed || isBookClosed ? 0 : 1 }}
            >
              <div className="w-1/2 h-full bg-[#f4eee4] rounded-l-xl sm:rounded-l-2xl border-y border-l border-black/10 shadow-lg" />
              <div className="w-1/2 h-full bg-[#f4eee4] rounded-r-xl sm:rounded-r-2xl border-y border-r border-black/10 shadow-lg" />
            </div>

            {/* REALISTIC CENTER SPINE SHADOW */}
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-10 bg-gradient-to-r from-black/40 via-black/75 to-black/40 z-40 pointer-events-none transition-opacity duration-200"
              style={{ opacity: isCoverClosed || isBookClosed ? 0 : 1 }}
            />

            {/* =========================================================================
                1. FRONT COVER (BÌA SÁCH: 1 TRANG DUY NHẤT, CHỈ ĐỂ CHỮ "MIA COFFEE")
                Back: Nửa trái của Ảnh 1 (Ảnh ngang to bằng cả cuốn sách)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(coverAngle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(coverAngle, 90, 10)
              }}
            >
              {/* FRONT OF COVER: BÌA TRƯỚC */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#0e271a] via-[#091a11] to-[#050f09] border-2 border-[#92f7c3]/40 p-3.5 sm:p-8 lg:p-14 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:shadow-[0_35px_80px_rgba(0,0,0,0.88)]"
                style={{
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7), -10px 0 25px rgba(0,0,0,0.85)'
                }}
              >
                <div className="absolute inset-2 sm:inset-5 border border-[#92f7c3]/30 rounded-lg sm:rounded-xl pointer-events-none" />
                <div className="absolute inset-3 sm:inset-7 border border-dashed border-[#92f7c3]/20 rounded-md sm:rounded-lg pointer-events-none" />

                <div className="absolute top-0 bottom-0 left-0 w-4 sm:w-8 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-1 sm:left-2 w-[1.5px] sm:w-[2px] bg-[#92f7c3]/30 pointer-events-none" />

                <div className="text-center relative z-10 space-y-2 sm:space-y-5 my-auto select-none">
                  <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-full bg-[#143525] border-2 border-[#92f7c3]/50 mx-auto flex items-center justify-center text-[#92f7c3] shadow-2xl">
                    <span className="material-symbols-outlined text-2xl sm:text-5xl">coffee</span>
                  </div>

                  <h1 className="text-lg sm:text-5xl lg:text-7xl font-['Fraunces'] font-black text-[#92f7c3] tracking-[0.14em] sm:tracking-[0.24em] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                    MIA COFFEE
                  </h1>

                  <div className="w-16 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#92f7c3]/70 to-transparent mx-auto" />
                </div>
              </div>

              {/* BACK OF COVER: NỬA TRÁI CỦA ẢNH 1 (Ảnh ngang to bằng cuốn sách) */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[0]}
                side="left"
                bookDims={bookDims}
                isBack
              />
            </div>

            {/* =========================================================================
                2. SHEET 1: FRONT = NỬA PHẢI ẢNH 1 | BACK = THÔNG TIN ẢNH 2 (Dọc)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet1Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet1Angle, 80, 20)
              }}
            >
              {/* FRONT: NỬA PHẢI CỦA ẢNH 1 */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[0]}
                side="right"
                bookDims={bookDims}
              />

              {/* BACK: TRANG THÔNG TIN CHO ẢNH 2 */}
              <BookPageInfo
                photo={spaceBookPhotos[1]}
                isBack
              />
            </div>

            {/* =========================================================================
                3. SHEET 2: FRONT = ẢNH 2 (Ảnh Dọc) | BACK = NỬA TRÁI ẢNH 3 (Ngang)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet2Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet2Angle, 70, 30)
              }}
            >
              {/* FRONT: ẢNH DỌC 2 */}
              <BookPagePortraitPhoto
                photo={spaceBookPhotos[1]}
              />

              {/* BACK: NỬA TRÁI ẢNH 3 (Ảnh ngang to bằng cuốn sách) */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[2]}
                side="left"
                bookDims={bookDims}
                isBack
              />
            </div>

            {/* =========================================================================
                4. SHEET 3: FRONT = NỬA PHẢI ẢNH 3 | BACK = THÔNG TIN ẢNH 4 (Dọc)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet3Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet3Angle, 60, 40)
              }}
            >
              {/* FRONT: NỬA PHẢI ẢNH 3 */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[2]}
                side="right"
                bookDims={bookDims}
              />

              {/* BACK: THÔNG TIN ẢNH 4 */}
              <BookPageInfo
                photo={spaceBookPhotos[3]}
                isBack
              />
            </div>

            {/* =========================================================================
                5. SHEET 4: FRONT = ẢNH 4 (Dọc) | BACK = THÔNG TIN ẢNH 5 (Dọc)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet4Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet4Angle, 50, 50)
              }}
            >
              {/* FRONT: ẢNH DỌC 4 */}
              <BookPagePortraitPhoto
                photo={spaceBookPhotos[3]}
              />

              {/* BACK: THÔNG TIN ẢNH 5 */}
              <BookPageInfo
                photo={spaceBookPhotos[4]}
                isBack
              />
            </div>

            {/* =========================================================================
                6. SHEET 5: FRONT = ẢNH 5 (Dọc) | BACK = THÔNG TIN ẢNH 6 (Dọc)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet5Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet5Angle, 40, 60)
              }}
            >
              {/* FRONT: ẢNH DỌC 5 */}
              <BookPagePortraitPhoto
                photo={spaceBookPhotos[4]}
              />

              {/* BACK: THÔNG TIN ẢNH 6 */}
              <BookPageInfo
                photo={spaceBookPhotos[5]}
                isBack
              />
            </div>

            {/* =========================================================================
                7. SHEET 6: FRONT = ẢNH 6 (Dọc) | BACK = NỬA TRÁI ẢNH 7 (Ngang)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet6Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet6Angle, 30, 70)
              }}
            >
              {/* FRONT: ẢNH DỌC 6 */}
              <BookPagePortraitPhoto
                photo={spaceBookPhotos[5]}
              />

              {/* BACK: NỬA TRÁI ẢNH 7 (Ảnh ngang to bằng cuốn sách) */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[6]}
                side="left"
                bookDims={bookDims}
                isBack
              />
            </div>

            {/* =========================================================================
                8. SHEET 7: FRONT = NỬA PHẢI ẢNH 7 | BACK = THÔNG TIN ẢNH 8 (Dọc)
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(sheet7Angle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(sheet7Angle, 20, 80)
              }}
            >
              {/* FRONT: NỬA PHẢI ẢNH 7 */}
              <BookPageHalfPhoto
                photo={spaceBookPhotos[6]}
                side="right"
                bookDims={bookDims}
              />

              {/* BACK: THÔNG TIN ẢNH 8 */}
              <BookPageInfo
                photo={spaceBookPhotos[7]}
                isBack
              />
            </div>

            {/* =========================================================================
                9. SHEET 8: FRONT = ẢNH 8 (Dọc) | BACK = MẶT TRONG BÌA SAU
                ========================================================================= */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                transform: getSoftPaperTransform(closeAngle),
                transformStyle: 'preserve-3d',
                zIndex: getZIndex(closeAngle, 10, 100)
              }}
            >
              {/* FRONT: ẢNH DỌC 8 */}
              <BookPagePortraitPhoto
                photo={spaceBookPhotos[7]}
              />

              {/* BACK: BÌA SAU ĐÓNG LẠI HOÀN TOÀN */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#0e271a] via-[#091a11] to-[#050f09] border-2 border-[#92f7c3]/40 p-3.5 sm:p-8 lg:p-14 flex flex-col items-center justify-center text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:shadow-[0_35px_80px_rgba(0,0,0,0.88)]"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7), 10px 0 25px rgba(0,0,0,0.85)'
                }}
              >
                <div className="absolute inset-2 sm:inset-5 border border-[#92f7c3]/30 rounded-lg sm:rounded-xl pointer-events-none" />
                <div className="absolute inset-3 sm:inset-7 border border-dashed border-[#92f7c3]/20 rounded-md sm:rounded-lg pointer-events-none" />

                <div className="absolute top-0 bottom-0 right-0 w-4 sm:w-8 bg-gradient-to-l from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-1 sm:right-2 w-[1.5px] sm:w-[2px] bg-[#92f7c3]/30 pointer-events-none" />

                <div className="space-y-2 sm:space-y-5 relative z-10 select-none">
                  <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-full bg-[#143525] text-[#92f7c3] mx-auto flex items-center justify-center border-2 border-[#92f7c3]/40 shadow-2xl">
                    <span className="material-symbols-outlined text-2xl sm:text-5xl">check</span>
                  </div>

                  <h4 className="text-lg sm:text-5xl lg:text-6xl font-['Fraunces'] font-black text-[#92f7c3] tracking-[0.14em] sm:tracking-[0.22em] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                    MIA COFFEE
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Pixel-Perfect Double-Spread Half Photo (Ảnh ngang to bằng cả cuốn sách)
 * Non-clickable (no zoom modal)
 */
function BookPageHalfPhoto({ photo, side = 'left', bookDims, isBack = false }) {
  const isRight = side === 'right';
  const W = bookDims.width;
  const H = bookDims.height;
  const R = photo.aspectRatio || (16 / 9);
  const bookR = W / H;

  let imgW, imgH, offX, offY;
  if (bookR > R) {
    imgW = W;
    imgH = W / R;
    offX = 0;
    offY = (H - imgH) / 2;
  } else {
    imgH = H;
    imgW = H * R;
    offX = (W - imgW) / 2;
    offY = 0;
  }

  const leftPos = isRight ? (offX - W / 2) : offX;

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#0c1611] shadow-inner select-none ${
        isRight
          ? 'rounded-r-xl sm:rounded-r-2xl border-y border-r border-black/20'
          : 'rounded-l-xl sm:rounded-l-2xl border-y border-l border-black/20'
      }`}
      style={{
        backfaceVisibility: 'hidden',
        transform: isBack ? 'rotateY(180deg)' : 'none'
      }}
    >
      {/* Seamless Half-Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title}
          className="absolute block"
          style={{
            width: `${imgW}px`,
            height: `${imgH}px`,
            minWidth: `${imgW}px`,
            maxWidth: 'none',
            left: `${leftPos}px`,
            top: `${offY}px`,
            objectFit: 'cover'
          }}
          loading="lazy"
        />
      </div>

      {/* Spine Gradient Shadow */}
      <div
        className={`absolute top-0 bottom-0 ${
          isRight ? 'left-0 w-6 sm:w-12 bg-gradient-to-r' : 'right-0 w-6 sm:w-12 bg-gradient-to-l'
        } from-black/45 via-black/15 to-transparent pointer-events-none z-20`}
      />

      {/* Corner Title Tag for Landscape Spread (Clean, non-clickable) */}
      {!isRight && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/70 text-white/90 text-[9px] sm:text-xs font-semibold backdrop-blur-md border border-white/10 z-30 flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#92f7c3]" />
          <span className="truncate max-w-[110px] sm:max-w-none">{photo.title}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Information Page (Trang bên kia ghi thông tin khi ảnh dọc nằm 1 bên)
 */
function BookPageInfo({ photo, isBack = false }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#faf7f0] border-y border-l border-black/10 rounded-l-xl sm:rounded-l-2xl p-2.5 sm:p-8 lg:p-12 flex flex-col justify-between text-[#14241b] shadow-inner select-text"
      style={{
        backfaceVisibility: 'hidden',
        transform: isBack ? 'rotateY(180deg)' : 'none'
      }}
    >
      {/* Spine Fold Shadow */}
      <div className="absolute top-0 bottom-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-black/10 pb-1 sm:pb-3">
        <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[#007a4d] bg-[#007a4d]/10 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full truncate max-w-[105px] sm:max-w-none">
          {photo.category || "Không Gian Quán"}
        </span>
        <span className="material-symbols-outlined text-[#007a4d] text-sm sm:text-lg">local_cafe</span>
      </div>

      {/* Main Info Content */}
      <div className="space-y-1 sm:space-y-4 my-auto pr-1 sm:pr-2 overflow-hidden">
        <h3 className="text-xs sm:text-2xl lg:text-3xl font-['Fraunces'] font-bold text-[#0d2117] leading-tight line-clamp-2">
          {photo.title}
        </h3>

        {photo.subtitle && (
          <p className="text-[9px] sm:text-sm font-semibold text-[#007a4d] italic flex items-center gap-1 line-clamp-1">
            <span className="w-1 h-1 rounded-full bg-[#007a4d] shrink-0" />
            <span className="truncate">{photo.subtitle}</span>
          </p>
        )}

        <div className="w-8 sm:w-14 h-0.5 bg-[#007a4d]/30" />

        <p className="text-[9px] sm:text-xs lg:text-sm text-[#384b40] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
          {photo.description}
        </p>

        {photo.highlights && photo.highlights.length > 0 && (
          <div className="hidden sm:block space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#24352b] pt-1.5 sm:pt-2 border-t border-black/10">
            {photo.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 sm:gap-2.5">
                <span className="material-symbols-outlined text-[#007a4d] text-xs sm:text-base shrink-0 mt-0.5">check_circle</span>
                <span className="leading-snug text-[11px] sm:text-xs lg:text-sm">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-[8px] sm:text-[11px] text-[#384b40] font-semibold border-t border-black/15 pt-1 sm:pt-2.5 flex justify-between">
        <span className="truncate max-w-[80px] sm:max-w-none">MIA COFFEE</span>
        <span className="font-mono shrink-0">Ảnh {photo.id}/8</span>
      </div>
    </div>
  );
}

/**
 * Portrait Photo Page (Ảnh dọc nằm 1 bên, vừa vặn không phóng to)
 */
function BookPagePortraitPhoto({ photo }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#faf7f0] border-y border-r border-black/10 p-2 sm:p-6 lg:p-8 rounded-r-xl sm:rounded-r-2xl flex flex-col justify-center items-center shadow-inner select-none"
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Spine Fold Shadow */}
      <div className="absolute top-0 bottom-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-20" />

      {/* Frame vừa vặn tự nhiên, không zoom/phóng to */}
      <div className="relative w-full h-full rounded-lg sm:rounded-2xl overflow-hidden bg-black/5 border border-black/10 shadow-md">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
