'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

/**
 * Live item count on the header cart icon.
 *
 * Counts units rather than lines, so adding a second 20cm pan reads as 2 — the
 * number a shopper is checking against what they think they picked.
 */
export function CartCount() {
  const { cart } = useCart()

  const count = (cart?.items ?? []).reduce(
    (total: number, item: { quantity?: number }) => total + (item.quantity ?? 0),
    0,
  )

  return (
    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-notify px-1 text-[10px] font-medium text-paper">
      {count}
    </span>
  )
}
