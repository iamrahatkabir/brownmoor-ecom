import Image from 'next/image'
import Link from 'next/link'

import { firstImage, mediaURL } from '@/lib/payload'
import { formatBDT, stockLevel, summarisePrice } from '@/lib/price'
import type { Product } from '@/lib/types'

/**
 * One product tile.
 *
 * A product with variants can't be bought from a grid — you have to pick a
 * size first — so its action reads "Select options" and links to the product
 * page, while a single-SKU product gets a direct "Add to cart". That mirrors
 * the reference design, and it's also the honest behaviour.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = summarisePrice(product)
  const image = firstImage(product)
  const src = mediaURL(image, 'card')
  const stock = stockLevel(product)
  const soldOut = stock <= 0
  const needsOptions = Boolean(product.enableVariants)
  const href = `/product/${product.slug}`
  // Product pages open in their own tab, so a shopper browsing a grid does not
  // lose their place. rel is required with target to avoid opener access.
  const newTab = { rel: 'noopener', target: '_blank' as const }

  return (
    <article className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink">
      <div className="relative aspect-square overflow-hidden bg-wash">
        {price.discountPercent !== null && (
          <span className="absolute left-2 top-2 z-10 bg-sale px-1.5 py-0.5 text-[10px] font-semibold text-paper">
            −{price.discountPercent}%
          </span>
        )}

        {soldOut && (
          <span className="absolute right-2 top-2 z-10 bg-ink px-1.5 py-0.5 text-[10px] tracked text-paper">
            Sold out
          </span>
        )}

        <Link href={href} {...newTab}>
          {src ? (
            <Image
              alt={image?.alt || product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              height={640}
              // Two columns on phones, four on desktop — telling the browser
              // this stops it downloading a 640px image for a 180px slot.
              priority={priority}
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
              src={src}
              width={640}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-faint">
              No image
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        {/* Fixed two-line height keeps buttons aligned across a row whether a
            title wraps to one line or two. */}
        <h3 className="line-clamp-2-fixed min-h-[2.6rem] text-[13px] leading-[1.45] text-ink md:text-sm">
          <Link className="hover:underline" href={href} {...newTab}>
            {product.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          {price.amount === null ? (
            <span className="text-sm text-faint">Price on request</span>
          ) : (
            <>
              {price.compareAt !== null && (
                <span className="text-xs text-faint line-through">
                  {formatBDT(price.compareAt)}
                </span>
              )}
              <span className="text-sm font-semibold text-ink md:text-base">
                {price.isRange && <span className="text-xs font-normal text-muted">From </span>}
                {formatBDT(price.amount)}
              </span>
            </>
          )}
        </div>

        <div className="mt-3 flex-1" />

        <Link
          aria-disabled={soldOut}
          className={`flex h-10 items-center justify-center text-[11px] tracked transition-colors ${
            soldOut
              ? 'pointer-events-none bg-wash text-faint'
              : 'bg-ink text-paper hover:bg-muted'
          }`}
          href={href}
          {...newTab}
        >
          {soldOut ? 'Sold out' : needsOptions ? 'Select options' : 'Add to cart'}
        </Link>
      </div>
    </article>
  )
}
