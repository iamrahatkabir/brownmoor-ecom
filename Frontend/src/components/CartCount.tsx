'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect } from 'react'

import { rememberCartCount, useRememberedCartCount } from '@/components/cart/cartCountCache'

/**
 * Live item count on the header cart icon.
 *
 * Counts units rather than lines, so adding a second 20cm pan reads as 2 — the
 * number a shopper is checking against what they think they picked.
 *
 * Until the cart arrives the badge shows the count this browser last saw, so a
 * full page load never flashes nought at someone holding five items. Nothing is
 * drawn when neither number is known, which is a first visit — better an icon
 * with no badge for a moment than a wrong number.
 */
export function CartCount() {
  const { cart } = useCart()
  const remembered = useRememberedCartCount()

  // An items array means the cart has actually been fetched. Absent it, the
  // provider's empty default would read as a real, empty cart.
  const items = (cart as undefined | { items?: { quantity?: number }[] })?.items
  const live = Array.isArray(items)
    ? items.reduce((total, item) => total + (item.quantity ?? 0), 0)
    : null

  useEffect(() => {
    if (live !== null) {
      rememberCartCount(live)
    }
  }, [live])

  const count = live ?? remembered

  if (count === null) {
    return null
  }

  return (
    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-notify px-1 text-[10px] font-medium text-paper">
      {count}
    </span>
  )
}
