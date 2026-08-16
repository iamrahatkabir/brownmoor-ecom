'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useSyncExternalStore } from 'react'

import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { useCartLine } from '@/components/cart/useCartLine'
import { CloseIcon } from '@/components/icons'
import { firstImage, mediaURL } from '@/lib/payload'
import { formatBDT } from '@/lib/price'
import { ZONE_STORAGE_KEY, zoneById } from '@/lib/shipping'
import type { Product, Variant } from '@/lib/types'

type Line = {
  id?: string
  product: Product | number
  quantity: number
  variant?: number | Variant
}

const asProduct = (v: Product | number): null | Product => (typeof v === 'object' ? v : null)
const asVariant = (v: number | undefined | Variant): null | Variant =>
  v && typeof v === 'object' ? v : null

const unitPrice = (line: Line): number => {
  const variant = asVariant(line.variant)
  const product = asProduct(line.product)
  const price = variant ? variant.priceInBDT : product?.priceInBDT

  return typeof price === 'number' ? price : 0
}

const FIELD =
  'h-11 w-full rounded-lg border border-transparent bg-wash px-3.5 text-sm outline-none transition-colors placeholder:text-faint focus:border-ink'

function OrderLine({ line }: { line: Line }) {
  const product = asProduct(line.product)
  const variant = asVariant(line.variant)
  const { decrement, increment, isPending, quantity } = useCartLine(product?.id ?? 0, variant?.id)
  const { removeItem } = useCart()

  if (!product) {
    return null
  }

  const src = mediaURL(firstImage(product), 'thumbnail')
  const stock = variant ? (variant.inventory ?? 0) : (product.inventory ?? 0)

  return (
    <div className="flex items-start gap-3 border-b border-line py-4">
      <button
        aria-label={`Remove ${product.title}`}
        className="mt-1 shrink-0 text-faint hover:text-ink"
        disabled={isPending}
        onClick={() => line.id && removeItem(line.id)}
        type="button"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>

      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-wash">
        {src && (
          <Image alt="" className="h-full w-full object-cover" height={96} src={src} width={96} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{product.title}</p>
        {variant?.options?.[0] && (
          <p className="mt-0.5 text-xs text-muted">{variant.options[0].label}</p>
        )}
        <div className="mt-2 w-28">
          <QuantityStepper
            className="h-8"
            disabled={isPending}
            max={stock}
            onDecrement={decrement}
            onIncrement={increment}
            quantity={quantity}
          />
        </div>
      </div>

      <p className="shrink-0 text-sm font-medium">{formatBDT(unitPrice(line) * quantity)}</p>
    </div>
  )
}

export function CheckoutView() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  // useCart does not surface the id; useEcommerce does, but the cart document
  // already carries it and that avoids a second context read.
  const cartID = (cart as undefined | { id?: number })?.id

  const [form, setForm] = useState({
    address: '',
    email: '',
    name: '',
    note: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<null | string>(null)

  const lines = (cart?.items ?? []) as Line[]
  const subtotal = lines.reduce((total, line) => total + unitPrice(line) * line.quantity, 0)

  /**
   * The zone is decided on the cart page and read back here.
   *
   * useSyncExternalStore rather than an effect: localStorage does not exist on
   * the server, so the server snapshot returns null and renders the default,
   * then the client swaps in the stored value without a hydration mismatch and
   * without setting state from an effect.
   */
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('storage', onChange)

    return () => window.removeEventListener('storage', onChange)
  }, [])

  const storedZoneId = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(ZONE_STORAGE_KEY),
    () => null,
  )

  const zone = zoneById(storedZoneId)

  const total = subtotal + zone.rate

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const next: Record<string, string> = {}

    if (!form.name.trim()) {
      next.name = 'Please enter your name.'
    }

    // Bangladeshi mobile numbers are 01X plus eight digits.
    if (!/^01\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      next.phone = 'Enter an 11-digit mobile number starting 01.'
    }

    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      next.email = 'That email does not look right.'
    }

    // Open-ended, so the only useful check is that it is long enough to be a
    // real address rather than a word.
    if (form.address.trim().length < 12) {
      next.address = 'Enter your full address so the courier can find you.'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const placeOrder = async () => {
    if (!validate() || submitting) {
      return
    }

    setSubmitting(true)
    setFailure(null)

    const phone = form.phone.replace(/[\s-]/g, '')

    // Steadfast takes a single free-text address, so the whole thing goes on
    // line one rather than being split into fields we no longer collect.
    const address = {
      addressLine1: form.address.trim(),
      // The backend re-derives the zone by matching this against each zone's
      // city list, so it must be a city name, not the zone's label — sending
      // "Inside Dhaka" matches nothing and silently falls through to the
      // outside-Dhaka rate.
      city: zone.id === 'inside-dhaka' ? 'Dhaka' : zone.label,
      country: 'BD',
      firstName: form.name.trim(),
      phone,
    }

    try {
      // The provider stores the guest cart's secret alongside its id, keyed
      // `<key>_secret`. Without it the payment endpoints reject the cart as
      // someone else's and return 403.
      const secret = window.localStorage.getItem('brownmoor-cart_secret') ?? undefined

      const body = {
        billingAddress: address,
        // The endpoint resolves the cart from this, not from a cookie.
        cartID,
        // The plugin rejects a purchase with no customer email, but the design
        // makes it optional — cash on delivery is arranged by phone. Fall back
        // to a placeholder derived from the number so the order still carries a
        // unique, traceable identifier.
        customerEmail: form.email.trim() || `${phone}@cod.brownmoor.invalid`,
        note: form.note.trim() || undefined,
        secret,
        shippingAddress: address,
      }

      const initiate = await fetch('/api/payments/cod/initiate', {
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const started = await initiate.json()

      if (!initiate.ok || !started?.reference) {
        throw new Error(started?.message || 'Could not start the order.')
      }

      const confirm = await fetch('/api/payments/cod/confirm-order', {
        body: JSON.stringify({
          cartID,
          customerEmail: body.customerEmail,
          reference: started.reference,
          secret,
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const done = await confirm.json()

      if (!confirm.ok || !done?.orderID) {
        throw new Error(done?.message || 'Could not confirm the order.')
      }

      // The order owns its own snapshot of the items, so emptying the cart
      // cannot affect it — and leaving it full would show the shopper a basket
      // they have already paid for.
      await clearCart()

      router.push(`/order/${done.orderID}`)
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center md:py-24">
        <p className="text-sm text-muted">Your cart is empty, so there is nothing to check out.</p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-8 text-[11px] tracked text-paper hover:bg-muted"
          href="/"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  const field = (key: keyof typeof form, label: string, extra?: React.ReactNode) => (
    <div>
      <label className="text-xs text-muted" htmlFor={key}>
        {label}
      </label>
      {extra}
      {errors[key] && <p className="mt-1 text-xs text-sale">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-14">
        <section>
          <h1 className="text-lg font-semibold tracking-tight md:text-2xl">Billing details</h1>

          <div className="mt-6 space-y-4">
            {field(
              'name',
              'Full name',
              <input
                autoComplete="name"
                className={`${FIELD} mt-1.5`}
                id="name"
                onChange={(e) => set('name')(e.target.value)}
                placeholder="e.g. Rashed Ahmed"
                value={form.name}
              />,
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {field(
                'email',
                'Email (optional)',
                <input
                  autoComplete="email"
                  className={`${FIELD} mt-1.5`}
                  id="email"
                  onChange={(e) => set('email')(e.target.value)}
                  placeholder="rashed@email.com"
                  type="email"
                  value={form.email}
                />,
              )}

              {field(
                'phone',
                'Mobile',
                <input
                  autoComplete="tel"
                  className={`${FIELD} mt-1.5`}
                  id="phone"
                  inputMode="numeric"
                  onChange={(e) => set('phone')(e.target.value)}
                  placeholder="017xxxxxxxx"
                  value={form.phone}
                />,
              )}
            </div>

            {field(
              'address',
              'Address',
              <textarea
                autoComplete="street-address"
                className={`${FIELD} mt-1.5 h-24 resize-none py-2.5 leading-relaxed`}
                id="address"
                onChange={(e) => set('address')(e.target.value)}
                placeholder="Enter your full address, e.g., House no, Road no, Area, Thana, City."
                value={form.address}
              />,
            )}

            {field(
              'note',
              'Delivery note (optional)',
              <textarea
                className={`${FIELD} mt-1.5 h-20 resize-none py-2.5`}
                id="note"
                onChange={(e) => set('note')(e.target.value)}
                placeholder="e.g. Call at the gate, 4th floor"
                value={form.note}
              />,
            )}
          </div>
        </section>

        <aside className="h-fit rounded-lg bg-wash p-5 md:p-7">
          <h2 className="text-center text-lg font-semibold md:text-xl">Your order</h2>

          <div className="mt-5 rounded-lg bg-paper p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-line pb-3 text-[11px] tracked text-muted">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {lines.map((line, index) => (
              <OrderLine key={line.id ?? index} line={line} />
            ))}

            <dl className="pt-4 text-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <dt className="font-medium">Subtotal</dt>
                <dd>{formatBDT(subtotal)}</dd>
              </div>

              <div className="flex items-center justify-between border-b border-line py-3">
                <dt className="font-medium">Shipment</dt>
                <dd className="text-right">
                  <span className="text-muted">{zone.label}: </span>
                  <span className="font-medium">{formatBDT(zone.rate)}</span>
                </dd>
              </div>

              <div className="flex items-center justify-between pt-4">
                <dt className="text-base font-semibold">Total</dt>
                <dd className="text-xl font-semibold">{formatBDT(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5">
            <label className="flex items-center gap-2.5 text-sm">
              <input checked className="h-4 w-4 accent-ink" name="payment" readOnly type="radio" />
              Cash on delivery
            </label>
            <p className="mt-2 rounded-lg bg-paper p-3.5 text-sm text-muted">
              Pay with cash upon delivery.
            </p>
          </div>

          {failure && (
            <p className="mt-4 rounded-lg bg-paper p-3 text-sm text-sale" role="alert">
              {failure}
            </p>
          )}

          <button
            className="mt-5 h-12 w-full rounded-lg bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted disabled:opacity-60"
            disabled={submitting}
            onClick={placeOrder}
            type="button"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </aside>
      </div>
    </div>
  )
}
