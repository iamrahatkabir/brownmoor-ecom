/**
 * Inline busy indicator.
 *
 * Inherits `currentColor`, so it reads correctly on both the dark and outlined
 * buttons without a variant for each. The track is the same colour at low
 * opacity rather than a second token, so it works on any background.
 */
export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

/**
 * Grey blocks standing in for content that is still loading.
 *
 * Route-level `loading.tsx` files render these, so a navigation shows the shape
 * of the page immediately instead of a blank screen.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-wash ${className}`} />
}
