
import { Link } from '@/components/Link'
import { Pagination } from '@/components/Pagination'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

/**
 * Shared layout for any product listing — a category, or the whole shop.
 *
 * Two columns on phones and four from `lg`, matching the homepage bands so a
 * card looks the same wherever a shopper meets it.
 */
export function ProductListing({
  basePath,
  crumb,
  page,
  products,
  title,
  totalDocs,
  totalPages,
}: {
  basePath: string
  crumb: string
  page: number
  products: Product[]
  title: string
  totalDocs: number
  totalPages: number
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 md:py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link className="hover:text-ink" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-muted">{crumb}</li>
        </ol>
      </nav>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 md:mt-6">
        <h1 className="text-xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {totalDocs > 0 && (
          <p className="text-xs text-muted">
            {totalDocs} {totalDocs === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted md:py-24">
          Nothing here yet. Please check back soon.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-8 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                // Only the first row is above the fold on any screen size.
                priority={page === 1 && index < 4}
                product={product}
              />
            ))}
          </div>

          <Pagination basePath={basePath} page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}
