/**
 * EmptyState Component
 * Displays helpful feedback when query or filter yields zero results
 */
export default function EmptyState({
  icon = "search_off",
  title = "Không tìm thấy món phù hợp",
  description = "Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác nhé.",
  actionText = "Xem tất cả món",
  onAction
}) {
  return (
    <div className="text-center py-16 px-4 bg-white/[0.02] border border-white/10 rounded-3xl max-w-lg mx-auto space-y-4">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-[#92f7c3] flex items-center justify-center mx-auto shadow-inner">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-['Fraunces'] text-white font-semibold">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="px-6 py-2 rounded-full bg-[#92f7c3] text-[#012d1d] hover:bg-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}
