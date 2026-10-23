/**
 * LoadingSpinner Component
 * Provides clean feedback during async repository data loading
 */
export default function LoadingSpinner({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-10 h-10 border-2 border-white/10 border-t-[#92f7c3] rounded-full animate-spin" />
      <span className="text-xs text-white/50 tracking-wider uppercase font-medium">
        {text}
      </span>
    </div>
  );
}
