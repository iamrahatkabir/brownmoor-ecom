import Link from 'next/link'

/**
 * Page links for a product listing.
 *
 * Renders nothing for a single page — a lone "1" with dead arrows is noise.
 *
 * Long catalogues collapse to a window around the current page with ellipses,
 * so a shop with forty pages does not push forty links across the screen.
 */
export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) {
    return null
  }

  const href = (target: number) => (target === 1 ? basePath : `${basePath}?page=${target}`)

  // First, last, and the pages either side of the current one.
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1,
  )

  const arrow =
    'flex h-10 items-center gap-1.5 rounded-lg border border-line px-3.5 text-[11px] tracked transition-colors'

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5 md:gap-2">
      {page > 1 ? (
        <Link className={`${arrow} text-ink hover:border-ink`} href={href(page - 1)} rel="prev">
          ‹ <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span aria-disabled="true" className={`${arrow} text-faint`}>
          ‹ <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {numbers.map((n, index) => (
        <span className="flex items-center gap-1.5 md:gap-2" key={n}>
          {index > 0 && n - numbers[index - 1] > 1 && (
            <span className="px-1 text-faint" aria-hidden="true">
              …
            </span>
          )}

          <Link
            aria-current={n === page ? 'page' : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
              n === page
                ? 'bg-ink font-medium text-paper'
                : 'text-muted hover:bg-wash hover:text-ink'
            }`}
            href={href(n)}
          >
            {n}
          </Link>
        </span>
      ))}

      {page < totalPages ? (
        <Link className={`${arrow} text-ink hover:border-ink`} href={href(page + 1)} rel="next">
          <span className="hidden sm:inline">Next</span> ›
        </Link>
      ) : (
        <span aria-disabled="true" className={`${arrow} text-faint`}>
          <span className="hidden sm:inline">Next</span> ›
        </span>
      )}
    </nav>
  )
}
