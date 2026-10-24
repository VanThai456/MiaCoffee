import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ImageCropperModal Component
 * Interactive cropping, panning, zooming, rotating, and color-tuning modal for product photos.
 */
export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropSave,
  initialAspect = '1:1'
}) {
  const [aspect, setAspect] = useState(initialAspect); // '1:1' | '4:3' | '3:4'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Pan offsets (in viewport pixels)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Image & Canvas references
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Viewport display dimensions
  const getViewportDimensions = useCallback(() => {
    switch (aspect) {
      case '4:3':
        return { width: 340, height: 255 };
      case '3:4':
        return { width: 255, height: 340 };
      case '1:1':
      default:
        return { width: 300, height: 300 };
    }
  }, [aspect]);

  const { width: vpWidth, height: vpHeight } = getViewportDimensions();

  // Reset adjustments whenever a new image is loaded or aspect changes
  const resetAdjustments = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrast(100);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!imageSrc) return;
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      if (!isMounted) return;
      imageRef.current = img;
      setImageLoaded(true);
    };
    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // Redraw the preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    canvas.width = vpWidth;
    canvas.height = vpHeight;

    // Background
    ctx.fillStyle = '#070e0a';
    ctx.fillRect(0, 0, vpWidth, vpHeight);

    // Filter adjustments
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    ctx.save();
    // Move to viewport center
    ctx.translate(vpWidth / 2 + pan.x, vpHeight / 2 + pan.y);

    // Apply rotation & flip
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);

    // Calculate scale to cover viewport
    const isRotated90or270 = rotation % 180 !== 0;
    const effectiveImgWidth = isRotated90or270 ? img.height : img.width;
    const effectiveImgHeight = isRotated90or270 ? img.width : img.height;

    const baseScale = Math.max(vpWidth / effectiveImgWidth, vpHeight / effectiveImgHeight);
    const finalScale = baseScale * zoom;

    const drawW = img.width * finalScale;
    const drawH = img.height * finalScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }, [vpWidth, vpHeight, pan, zoom, rotation, flipH, brightness, contrast, imageLoaded]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Dragging event handlers (Mouse & Touch)
  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    panStartRef.current = { ...pan };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomStep = 0.08;
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(3, Number((prev + zoomStep).toFixed(2))));
    } else {
      setZoom(prev => Math.max(1, Number((prev - zoomStep).toFixed(2))));
    }
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Generate cropped output at high resolution
  const handleSaveCrop = async () => {
    const img = imageRef.current;
    if (!img) return;

    try {
      setProcessing(true);

      const targetWidth = 800;
      const targetHeight = Math.round((targetWidth * vpHeight) / vpWidth);
      const ratio = targetWidth / vpWidth;

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = targetWidth;
      outputCanvas.height = targetHeight;
      const ctx = outputCanvas.getContext('2d');

      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      ctx.save();
      ctx.translate(targetWidth / 2 + pan.x * ratio, targetHeight / 2 + pan.y * ratio);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) ctx.scale(-1, 1);

      const isRotated90or270 = rotation % 180 !== 0;
      const effectiveImgWidth = isRotated90or270 ? img.height : img.width;
      const effectiveImgHeight = isRotated90or270 ? img.width : img.height;

      const baseScale = Math.max(vpWidth / effectiveImgWidth, vpHeight / effectiveImgHeight);
      const finalScale = baseScale * zoom * ratio;

      const drawW = img.width * finalScale;
      const drawH = img.height * finalScale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Export as high quality WebP
      const croppedDataUrl = outputCanvas.toDataURL('image/webp', 0.88);
      onCropSave(croppedDataUrl);
    } catch (err) {
      console.error("Crop error:", err);
      alert("Không thể cắt ảnh: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-[#14201a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#14201a] border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-['Fraunces'] text-white font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#92f7c3] text-xl">crop</span>
              <span>Cắt & Điều Chỉnh Ảnh Sản Phẩm</span>
            </h3>
            <p className="text-[11px] text-white/50 mt-0.5">
              Kéo chuột để định vị ảnh, dùng thanh trượt để phóng to và tinh chỉnh màu sắc
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors text-base"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Main Viewport Container */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-[#92f7c3]/60 shadow-[0_0_30px_rgba(146,247,195,0.15)] select-none bg-black flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{ width: vpWidth, height: vpHeight }}
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handlePointerUp}
              onWheel={handleWheel}
              title="Kéo để di chuyển vị trí ảnh, cuộn chuột để phóng to/thu nhỏ"
            >
              <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />

              {/* Grid 3x3 Rule-of-Thirds Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Hint badge */}
              <div className="absolute bottom-2 left-2 pointer-events-none px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/70">
                Kéo để căn góc • Cuộn để phóng to
              </div>
            </div>
          </div>

          {/* Aspect Ratio Tabs */}
          <div>
            <label className="block text-white/70 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">
              Tỉ Lệ Cắt Ảnh
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspect('1:1')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  aspect === '1:1'
                    ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="w-3.5 h-3.5 border border-current rounded-sm inline-block shrink-0" />
                <span>1:1 (Vuông - Menu)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspect('4:3')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  aspect === '4:3'
                    ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="w-4 h-3 border border-current rounded-sm inline-block shrink-0" />
                <span>4:3 (Ngang)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspect('3:4')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  aspect === '3:4'
                    ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="w-3 h-4 border border-current rounded-sm inline-block shrink-0" />
                <span>3:4 (Dọc)</span>
              </button>
            </div>
          </div>

          {/* Zoom & Transform Controls */}
          <div className="bg-[#0c1410] rounded-2xl p-4 border border-white/10 space-y-3.5 text-xs">
            {/* Zoom Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/80 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#92f7c3]">zoom_in</span>
                  Phóng to / Thu nhỏ: <span className="text-[#92f7c3] font-bold">{Math.round(zoom * 100)}%</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.max(1, Number((prev - 0.1).toFixed(1))))}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.min(3, Number((prev + 0.1).toFixed(1))))}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#92f7c3] cursor-pointer"
              />
            </div>

            {/* Rotate & Flip Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-sm">rotate_right</span>
                <span>Xoay 90° ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipH(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-colors ${
                  flipH
                    ? 'bg-[#1b4332] text-[#92f7c3] border-[#92f7c3]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-sm">flip</span>
                <span>Lật ảnh ngang</span>
              </button>

              <button
                type="button"
                onClick={resetAdjustments}
                className="ml-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-[11px] transition-colors"
              >
                Đặt lại ban đầu
              </button>
            </div>

            {/* Brightness & Contrast Adjustments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-[11px] text-white/70 mb-1">
                  <span>Độ sáng</span>
                  <span className="text-[#92f7c3] font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[#92f7c3] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-white/70 mb-1">
                  <span>Độ tương phản</span>
                  <span className="text-[#92f7c3] font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#92f7c3] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#14201a] border-t border-white/10 flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            disabled={processing || !imageLoaded}
            className="btn-primary py-2 px-5 sm:py-2.5 sm:px-6 font-bold text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>{processing ? 'Đang cắt ảnh...' : 'Cắt & Áp Dụng'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
