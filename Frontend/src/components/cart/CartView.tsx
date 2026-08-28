'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Link } from '@/components/Link'
import { CartSkeleton } from '@/components/cart/CartSkeleton'
import { useCartHydrated } from '@/components/cart/useCartHydrated'
import { CloseIcon } from '@/components/icons'
import { firstImage, mediaURL } from '@/lib/payload'
import { toTaka, trackPixel } from '@/lib/pixel'
import { formatBDT } from '@/lib/price'
import { DEFAULT_ZONE, SHIPPING_ZONES, ZONE_STORAGE_KEY } from '@/lib/shipping'
import type { Product, Variant } from '@/lib/types'

import { QuantityStepper } from './QuantityStepper'
import { useCartLine } from './useCartLine'

type Line = {
  id?: string
  product: Product | number
  quantity: number
  variant?: number | Variant
}

/** Depth 2 populates these; a bare id means the document was deleted. */
const asProduct = (value: Product | number): Product | null =>
  typeof value === 'object' ? value : null

const asVariant = (value: number | undefined | Variant): null | Variant =>
  value && typeof value === 'object' ? value : null

/** Unit price and its "was", taken from the variant when the line has one. */
const linePricing = (line: Line) => {
  const product = asProduct(line.product)
  const variant = asVariant(line.variant)
  const price = variant ? variant.priceInBDT : product?.priceInBDT
  const compareAt = variant ? variant.compareAtPriceInBDT : product?.compareAtPriceInBDT

  return {
    compareAt: typeof compareAt === 'number' && compareAt > (price ?? 0) ? compareAt : null,
    price: typeof price === 'number' ? price : 0,
  }
}

/** One row. Its own component so each line owns its pending state. */
function CartRow({ line }: { line: Line }) {
  const product = asProduct(line.product)
  const variant = asVariant(line.variant)
  const { compareAt, price } = linePricing(line)

  const { decrement, increment, isPending, quantity } = useCartLine(
    product?.id ?? 0,
    variant?.id,
  )

  const { removeItem } = useCart()

  if (!product) {
    return null
  }

  const image = firstImage(product)
  const src = mediaURL(image, 'thumbnail')
  const href = `/product/${product.slug}`
  const stock = variant ? (variant.inventory ?? 0) : (product.inventory ?? 0)
  const subtotal = price * quantity

  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-4 border-b border-line py-5 md:grid-cols-[auto_88px_1fr_140px_150px_140px] md:items-center md:gap-4">
      <button
        aria-label={`Remove ${product.title}`}
        className="order-2 text-faint transition-colors hover:text-ink md:order-none"
        disabled={isPending}
        onClick={() => line.id && removeItem(line.id)}
        type="button"
      >
        <CloseIcon className="h-4 w-4" />
      </button>

      <Link
        className="row-span-2 h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-wash md:h-[88px] md:w-[88px] md:row-span-1"
        href={href}
      >
        {src && (
          <Image alt={image?.alt || product.title} className="h-full w-full object-cover" height={160} src={src} width={160} />
        )}
      </Link>

      <div className="col-start-2 md:col-auto">
        <Link className="text-sm font-medium leading-snug hover:underline" href={href}>
          {product.title}
        </Link>
        {variant?.options?.[0] && (
          <p className="mt-1 text-xs text-muted">{variant.options[0].label}</p>
        )}

        {/* Stacked labels on mobile; on desktop these live in their own
            columns under the table header instead. */}
        <dl className="mt-3 space-y-2 md:hidden">
          <div className="flex items-center justify-between border-b border-dashed border-line pb-2">
            <dt className="text-[11px] tracked text-muted">Price</dt>
            <dd className="text-sm text-muted">{formatBDT(price)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-line pb-2">
            <dt className="text-[11px] tracked text-muted">Quantity</dt>
            <dd>
              <QuantityStepper
                className="h-9 w-28"
                disabled={isPending}
                max={stock}
                pending={isPending}
                onDecrement={decrement}
                onIncrement={increment}
                quantity={quantity}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[11px] tracked text-muted">Subtotal</dt>
            <dd className="text-sm font-semibold">{formatBDT(subtotal)}</dd>
          </div>
        </dl>
      </div>

      <div className="hidden text-sm text-muted md:block">
        {compareAt && <span className="mr-2 text-xs line-through">{formatBDT(compareAt)}</span>}
        {formatBDT(price)}
      </div>

      <div className="hidden md:block">
        <QuantityStepper
          className="h-10 w-32"
          disabled={isPending}
          max={stock}
          onDecrement={decrement}
          onIncrement={increment}
          quantity={quantity}
        />
      </div>

      <div className="hidden text-right text-sm font-semibold md:block">{formatBDT(subtotal)}</div>
    </div>
  )
}

export function CartView() {
  const { cart } = useCart()
  const hydrated = useCartHydrated()
  const [zoneId, setZoneId] = useState(DEFAULT_ZONE.id)

  // Checkout no longer asks for a district, so the choice made here is the one
  // that decides the delivery charge. Persist it so the next page agrees.
  useEffect(() => {
    window.localStorage.setItem(ZONE_STORAGE_KEY, zoneId)
  }, [zoneId])

  const lines = (cart?.items ?? []) as Line[]
  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId) ?? DEFAULT_ZONE

  const subtotal = lines.reduce((total, line) => total + linePricing(line).price * line.quantity, 0)

  // What the compare-at prices add up to against what is actually charged.
  const savings = lines.reduce((total, line) => {
    const { compareAt, price } = linePricing(line)
    return compareAt ? total + (compareAt - price) * line.quantity : total
  }, 0)

  // The cart lives in the browser, so on a fresh page load it arrives after
  // the first paint. Showing the skeleton until then stops the empty state
  // flashing in front of a shopper who does have items.
  if (!hydrated) {
    return <CartSkeleton />
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:py-24">
        <p className="text-sm text-muted">Your cart is empty.</p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-8 text-[11px] tracked text-paper transition-colors hover:bg-muted"
          href="/"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div>
          {/* Column headings belong to the desktop table only. */}
          <div className="hidden grid-cols-[auto_88px_1fr_140px_150px_140px] gap-4 border-b border-line pb-3 text-[11px] tracked text-muted md:grid">
            <span className="w-4" />
            <span />
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span className="text-right">Subtotal</span>
          </div>

          {lines.map((line, index) => (
            <CartRow key={line.id ?? index} line={line} />
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-line p-5 md:p-6">
          <h2 className="text-base font-semibold md:text-lg">Cart totals</h2>

          <div className="mt-5 flex items-center justify-between border-b border-line pb-4">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="text-sm">{formatBDT(subtotal)}</span>
          </div>

          <fieldset className="border-b border-line py-4">
            <legend className="text-sm font-medium">Shipment</legend>

            <div className="mt-3 space-y-2.5">
              {SHIPPING_ZONES.map((option) => (
                <label
                  className="flex cursor-pointer items-center justify-between text-sm"
                  key={option.id}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      checked={option.id === zoneId}
                      className="h-4 w-4 accent-ink"
                      name="shipping-zone"
                      onChange={() => setZoneId(option.id)}
                      type="radio"
                      value={option.id}
                    />
                    {option.label}
                  </span>
                  <span className={option.id === zoneId ? 'text-ink' : 'text-faint'}>
                    {formatBDT(option.rate)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center justify-between py-4">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-semibold">{formatBDT(subtotal + zone.rate)}</span>
          </div>

          {savings > 0 && (
            <p className="flex items-center justify-between rounded-lg bg-[#eef7f0] px-3 py-2 text-sm text-[#2f6b43]">
              <span>You are saving</span>
              <span className="font-medium">{formatBDT(savings)}</span>
            </p>
          )}

          <Link
            className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted"
            href="/checkout"
            onClick={() =>
              trackPixel('InitiateCheckout', {
                content_ids: lines.map((line) => String(asProduct(line.product)?.id ?? '')),
                content_type: 'product',
                currency: 'BDT',
                num_items: lines.reduce((total, line) => total + line.quantity, 0),
                value: toTaka(subtotal),
              })
            }
          >
            Proceed to checkout
          </Link>

          <p className="mt-3 text-center text-xs text-muted">
            Delivery charge is confirmed at checkout.
          </p>
        </aside>
      </div>
    </div>
  )
}
