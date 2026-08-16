import type { Metadata } from 'next'

import Link from 'next/link'

import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { CONTACT } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Order complete',
}

/**
 * Confirmation after a cash-on-delivery order.
 *
 * Deliberately does not fetch the order. Orders are readable only by their
 * owner, and a guest checkout has no account to own it — fetching would 403.
 * The reference and the contact numbers are enough for the shopper to chase
 * it, and staff can see the full order in the admin panel.
 */
export default async function OrderCompletePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <CheckoutSteps current="complete" />

      <div className="mx-auto max-w-xl px-4 py-14 text-center md:py-20">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Thank you</h1>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your order is placed. We will call to confirm before it ships.
        </p>

        <div className="mt-8 rounded-lg border border-line p-5">
          <p className="text-[11px] tracked text-muted">Order reference</p>
          <p className="mt-1 text-xl font-semibold">#{id}</p>
        </div>

        <p className="mt-6 text-sm text-muted">
          Pay the courier in cash on delivery. Keep this reference to hand.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            className="flex h-11 w-full items-center justify-center rounded-lg bg-ink px-8 text-[11px] tracked text-paper hover:bg-muted sm:w-auto"
            href="/"
          >
            Continue shopping
          </Link>
          <a
            className="flex h-11 w-full items-center justify-center rounded-lg border border-ink px-8 text-[11px] tracked text-ink hover:bg-ink hover:text-paper sm:w-auto"
            href={CONTACT.whatsapp.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Message us
          </a>
        </div>
      </div>
    </>
  )
}
