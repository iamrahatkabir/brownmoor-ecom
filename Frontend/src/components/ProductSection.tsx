import Link from 'next/link'

import type { Product } from '@/lib/types'

import { ProductCard } from './ProductCard'

/**
 * A titled band of products: eyebrow, heading, optional intro, then the grid.
 *
 * Two columns on phones and four from `lg`, which keeps tap targets usable on
 * a narrow screen instead of squeezing four tiles across.
 *
 * Renders nothing at all when there are no products — an empty heading over
 * blank space looks broken, and a homepage assembled from live data will hit
 * that case whenever a category is unstocked.
 */
export function ProductSection({
  eyebrow,
  heading,
  intro,
  products,
  viewAllHref,
  priority = false,
}: {
  eyebrow?: string
  heading: string
  intro?: string | null
  products: Product[]
  viewAllHref?: string
  priority?: boolean
}) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && <p className="text-[11px] tracked text-faint">{eyebrow}</p>}

        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {heading}
        </h2>

        {intro && <p className="mt-3 text-sm leading-relaxed text-muted">{intro}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            // Only the first row of the first section is worth preloading;
            // beyond that, eager images compete with the hero for bandwidth.
            priority={priority && index < 4}
            product={product}
          />
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-8 text-center">
          <Link
            className="inline-flex h-11 items-center justify-center border border-ink px-8 text-[11px] tracked text-ink transition-colors hover:bg-ink hover:text-paper"
            href={viewAllHref}
          >
            View all
          </Link>
        </div>
      )}
    </section>
  )
}
