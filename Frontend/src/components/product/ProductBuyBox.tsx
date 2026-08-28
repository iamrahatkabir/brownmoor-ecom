'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Spinner } from '@/components/Spinner'
import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { useCartLine } from '@/components/cart/useCartLine'
import { formatBDT, variantLabel } from '@/lib/price'
import type { Product, Variant } from '@/lib/types'

/** Variants come back as ids or documents depending on query depth. */
const resolveVariants = (product: Product): Variant[] =>
  (product.variants?.docs ?? [])
    .filter((v): v is Variant => typeof v !== 'number')
    // Payload returns join rows newest-first, which put 24cm before 16cm.
    // Cheapest first reads as smallest-to-largest for a size range.
    .sort((a, b) => (a.priceInBDT ?? 0) - (b.priceInBDT ?? 0))

export function ProductBuyBox({ product }: { product: Product }) {
  const variants = useMemo(() => resolveVariants(product), [product])
  const hasVariants = Boolean(product.enableVariants && variants.length > 0)

  // Default to the first variant that is actually buyable, so the page never
  // opens on an out-of-stock size when another is available.
  const [variantId, setVariantId] = useState<number | undefined>(
    () => (variants.find((v) => (v.inventory ?? 0) > 0) ?? variants[0])?.id,
  )

  const selected = variants.find((v) => v.id === variantId)
  const price = hasVariants ? selected?.priceInBDT : product.priceInBDT
  const compareAt = hasVariants ? selected?.compareAtPriceInBDT : product.compareAtPriceInBDT
  const stock = hasVariants ? (selected?.inventory ?? 0) : (product.inventory ?? 0)
  const soldOut = stock <= 0

  const discount =
    typeof price === 'number' && typeof compareAt === 'number' && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null

  // Keyed on the selected variant, so switching size swaps which cart line the
  // controls act on.
  const { add, decrement, inCart, increment, isPending, quantity } = useCartLine(
    product.id,
    hasVariants ? variantId : undefined,
    price,
  )

  /**
   * Which button is mid-request.
   *
   * `isPending` from the hook is per cart line, not per control — add to cart
   * and buy now both call `add()`, so both would spin whichever was pressed.
   * This records the actual button so only it shows a spinner, while both stay
   * disabled to prevent a second add landing on top of the first.
   */
  const [busy, setBusy] = useState<'add' | 'buy' | null>(null)

  // Reveals the sticky bar only once the real buttons have scrolled away, so
  // the two are never on screen competing with each other.
  const anchorRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const node = anchorRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      rootMargin: '0px 0px -100% 0px',
    })

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const stepper = (
    <QuantityStepper
      disabled={isPending}
      max={stock}
      pending={isPending}
      onDecrement={decrement}
      onIncrement={increment}
      quantity={quantity}
    />
  )

  const addButton = (
    <button
      className="h-12 w-full rounded-lg bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted disabled:bg-wash disabled:text-faint"
      disabled={soldOut || isPending}
      onClick={async () => {
        setBusy('add')
        try {
          await add()
        } finally {
          setBusy(null)
        }
      }}
      type="button"
    >
      {busy === 'add' ? (
        <Spinner className="mx-auto h-4 w-4" />
      ) : soldOut ? (
        'Sold out'
      ) : (
        'Add to cart'
      )}
    </button>
  )

  return (
    <>
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline gap-3">
          {typeof price === 'number' ? (
            <>
              <span className="text-3xl font-semibold">{formatBDT(price)}</span>
              {compareAt && discount ? (
                <>
                  <span className="text-base text-faint line-through">{formatBDT(compareAt)}</span>
                  <span className="rounded-lg bg-sale px-1.5 py-0.5 text-[10px] font-semibold text-paper">
                    −{discount}%
                  </span>
                </>
              ) : null}
            </>
          ) : (
            <span className="text-lg text-faint">Price on request</span>
          )}

          {hasVariants && selected && variantLabel(selected) && (
            <span className="text-sm text-muted">{variantLabel(selected)}</span>
          )}
        </div>

        {hasVariants && (
          <fieldset className="mt-6">
            <legend className="text-[11px] tracked text-muted">Size</legend>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {variants.map((variant) => {
                const out = (variant.inventory ?? 0) <= 0
                const active = variant.id === variantId

                return (
                  <button
                    aria-pressed={active}
                    className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      active ? 'border-ink bg-wash' : 'border-line hover:border-muted'
                    } ${out ? 'opacity-45' : ''}`}
                    key={variant.id}
                    onClick={() => setVariantId(variant.id)}
                    type="button"
                  >
                    <span className="text-sm">{variantLabel(variant)}</span>
                    <span className="mt-0.5 text-xs text-muted">
                      {typeof variant.priceInBDT === 'number'
                        ? formatBDT(variant.priceInBDT)
                        : '—'}
                    </span>
                    {out && <span className="mt-0.5 text-[10px] tracked text-faint">Sold out</span>}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-6 space-y-3" ref={anchorRef}>
          {inCart ? stepper : addButton}

          {/* Hidden once the item is in the cart: at that point the basket is
              the natural next step, and two competing CTAs muddle it. */}
          {/* Adds, then sends the shopper to the cart — the delivery zone is
              chosen there, so skipping straight to checkout would leave the
              order with no shipping decision. */}
          {!inCart && !soldOut && (
            <button
              className="flex h-12 w-full items-center justify-center rounded-lg border border-ink text-[11px] tracked text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
              disabled={isPending}
              onClick={async () => {
                setBusy('buy')
                await add()
                // Left set on purpose: the spinner stays until the cart page
                // takes over, rather than flicking back to the label first.
                // Full page load on purpose — the storefront navigates like a traditional
                // site, so this must not become a client-side transition. See components/Link.
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign('/cart')
              }}
              type="button"
            >
              {busy === 'buy' ? <Spinner className="h-4 w-4" /> : 'Buy now'}
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-muted">
          {soldOut
            ? 'Currently unavailable.'
            : stock <= 5
              ? `Only ${stock} left in stock.`
              : 'In stock, ready to ship.'}
        </p>
      </div>

      {/* Sticky mobile CTA. Mirrors whichever control is live above. */}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">{product.title}</p>
              <p className="text-sm font-semibold">
                {typeof price === 'number' ? formatBDT(price) : '—'}
              </p>
            </div>

            <div className="w-40 shrink-0">{inCart ? stepper : addButton}</div>
          </div>
        </div>
      )}
    </>
  )
}
