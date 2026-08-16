'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons'
import { formatBDT } from '@/lib/price'
import type { Product, Variant } from '@/lib/types'

/** Variants come back as ids or documents depending on query depth. */
const resolveVariants = (product: Product): Variant[] =>
  (product.variants?.docs ?? [])
    .filter((v): v is Variant => typeof v !== 'number')
    // Payload returns join rows newest-first, which put 24cm before 16cm.
    // Cheapest first reads as smallest-to-largest for a size range.
    .sort((a, b) => (a.priceInBDT ?? 0) - (b.priceInBDT ?? 0))

type CartLine = {
  id?: string
  product: { id: number } | number
  quantity: number
  variant?: { id: number } | number
}

const idOf = (value: { id: number } | number | undefined): number | undefined =>
  typeof value === 'object' ? value?.id : value

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem, cart, decrementItem, incrementItem, isLoading, removeItem } = useCart()

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

  // The cart line for exactly this product-and-variant pair. Matching on both
  // is what keeps 20cm and 24cm as separate lines rather than one.
  const line = useMemo(() => {
    const items = (cart?.items ?? []) as CartLine[]

    return items.find(
      (item) =>
        idOf(item.product) === product.id &&
        (hasVariants ? idOf(item.variant) === variantId : !item.variant),
    )
  }, [cart, hasVariants, product.id, variantId])

  const quantity = line?.quantity ?? 0
  const inCart = quantity > 0

  const onAdd = async () => {
    if (soldOut) {
      return
    }

    await addItem({ product: product.id, ...(hasVariants && variantId ? { variant: variantId } : {}) })
  }

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
    <div className="flex h-12 items-center justify-between border border-ink">
      <button
        aria-label={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
        className="flex h-full w-12 items-center justify-center text-ink disabled:opacity-40"
        disabled={isLoading}
        onClick={() => (quantity === 1 ? removeItem(line!.id!) : decrementItem(line!.id!))}
        type="button"
      >
        {/* One left means the next tap empties the line, so the control says so. */}
        {quantity === 1 ? <TrashIcon /> : <MinusIcon />}
      </button>

      <span aria-live="polite" className="text-sm font-medium tabular-nums">
        {quantity}
      </span>

      <button
        aria-label="Increase quantity"
        className="flex h-full w-12 items-center justify-center text-ink disabled:opacity-40"
        disabled={isLoading || quantity >= stock}
        onClick={() => incrementItem(line!.id!)}
        type="button"
      >
        <PlusIcon />
      </button>
    </div>
  )

  const addButton = (
    <button
      className="h-12 w-full bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted disabled:bg-wash disabled:text-faint"
      disabled={soldOut || isLoading}
      onClick={onAdd}
      type="button"
    >
      {soldOut ? 'Sold out' : 'Add to cart'}
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
                  <span className="bg-sale px-1.5 py-0.5 text-[10px] font-semibold text-paper">
                    −{discount}%
                  </span>
                </>
              ) : null}
            </>
          ) : (
            <span className="text-lg text-faint">Price on request</span>
          )}

          {hasVariants && selected?.options?.[0] && (
            <span className="text-sm text-muted">{selected.options[0].label}</span>
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
                    className={`flex flex-col items-start border px-3 py-2.5 text-left transition-colors ${
                      active ? 'border-ink bg-wash' : 'border-line hover:border-muted'
                    } ${out ? 'opacity-45' : ''}`}
                    key={variant.id}
                    onClick={() => setVariantId(variant.id)}
                    type="button"
                  >
                    <span className="text-sm">{variant.options?.[0]?.label ?? variant.title}</span>
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
          {!inCart && !soldOut && (
            <a
              className="flex h-12 w-full items-center justify-center border border-ink text-[11px] tracked text-ink transition-colors hover:bg-ink hover:text-paper"
              href="/checkout"
            >
              Buy now
            </a>
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
