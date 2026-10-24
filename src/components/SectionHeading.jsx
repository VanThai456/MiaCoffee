/**
 * SectionHeading Component
 * Unified typography & visual anchor for all section titles
 */
export default function SectionHeading({
  title,
  highlight = "",
  description = "",
  center = false,
  className = ""
}) {
  return (
    <div className={`space-y-3 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Fraunces'] text-white font-normal leading-tight">
          {title} {highlight && <span className="italic text-[#92f7c3]">{highlight}</span>}
        </h2>
      )}

      {description && (
        <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
