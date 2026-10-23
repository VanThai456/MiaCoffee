/**
 * SectionHeading Component
 * Unified typography & visual anchor for all section titles
 */
export default function SectionHeading({
  icon = "coffee",
  badge = "MIA COFFEE",
  title,
  highlight = "",
  description = "",
  center = false,
  className = ""
}) {
  return (
    <div className={`space-y-3 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 text-[#92f7c3] text-xs font-bold uppercase tracking-[0.2em] ${center ? 'justify-center' : ''}`}>
          {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] text-white font-normal leading-tight">
          {title} {highlight && <span className="italic text-[#92f7c3]">{highlight}</span>}
        </h2>
      )}

      {description && (
        <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
