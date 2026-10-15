/**
 * A thumbnail of Beverly with some districts highlighted. It draws the outlines that
 * <ThumbDefs /> writes into the page once, so it carries no geometry of its own and can be used
 * from client components without pulling the outlines into the bundle.
 */
export function MiniMap({
  viewBox,
  zones,
  label,
  className = "",
}: {
  viewBox: string;
  zones: string[];
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={`block h-auto w-full ${className}`}>
      <use href="#bz-city" fill="#d9d3c9" />
      {zones.map((z) => (
        // A same-color stroke closes the hairline seams between neighboring districts.
        <use
          key={z}
          href={`#bz-z-${z}`}
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
