'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

/** Where the ecommerce provider keeps the cart id — see CartProvider's `syncLocalStorage`. */
const CART_STORAGE_KEY = 'brownmoor-cart'

/** Longest a skeleton stays up if the cart request never comes back. */
const GIVE_UP_MS = 6000

type MaybeCart = undefined | { items?: unknown }

/**
 * Whether the cart has settled enough to render the page.
 *
 * Navigation is a full page load, so the server renders the cart and checkout
 * pages before the browser has fetched anything. The provider starts with an
 * empty cart and `isLoading` false, so without this a shopper sees "Your cart
 * is empty" for a beat before their items appear.
 *
 * Storage tells us which case we are in. A cart id means items are on their way
 * and the page should wait; no id means there is genuinely nothing to fetch, so
 * the empty state is already correct and shows straight away.
 *
 * The timeout is a backstop: a request that fails should leave the shopper with
 * a real page — empty, and recoverable — rather than a skeleton that never ends.
 */
export function useCartHydrated(): boolean {
  const { cart } = useCart()
  const itemsResolved = Array.isArray((cart as MaybeCart)?.items)

  /**
   * Read through `useSyncExternalStore` rather than an effect: localStorage
   * does not exist on the server, so the server snapshot reports "unknown" and
   * both renders agree, then the client swaps in the real answer without a
   * hydration mismatch.
   */
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('storage', onChange)

    return () => window.removeEventListener('storage', onChange)
  }, [])

  const expectsCart = useSyncExternalStore<boolean | null>(
    subscribe,
    () => Boolean(window.localStorage.getItem(CART_STORAGE_KEY)),
    () => null,
  )

  const [gaveUp, setGaveUp] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setGaveUp(true), GIVE_UP_MS)

    return () => window.clearTimeout(timer)
  }, [])

  if (expectsCart === null) {
    return false
  }

  return !expectsCart || itemsResolved || gaveUp
}
