'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * The last cart count this browser saw.
 *
 * Navigation is a full page load, so the header renders before the cart has
 * been fetched. Counting an empty cart gives nought, which flashes in front of
 * a shopper who has five things in their basket.
 *
 * Remembering the previous count lets the badge show the right number the
 * moment the page paints, and the live cart replaces it as soon as it arrives.
 * A stale number for a fraction of a second is far better than a wrong one.
 */

const COUNT_STORAGE_KEY = 'brownmoor-cart_count'

/** Writes the count so the next page load can render it immediately. */
export const rememberCartCount = (count: number): void => {
  try {
    window.localStorage.setItem(COUNT_STORAGE_KEY, String(count))
  } catch {
    // Private browsing and blocked storage both throw. The badge simply falls
    // back to waiting for the cart, which is the old behaviour.
  }
}

/**
 * The remembered count, or null when there is nothing to go on — a first visit,
 * or the server, where localStorage does not exist.
 */
export const useRememberedCartCount = (): null | number => {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('storage', onChange)

    return () => window.removeEventListener('storage', onChange)
  }, [])

  return useSyncExternalStore<null | number>(
    subscribe,
    () => {
      try {
        const stored = window.localStorage.getItem(COUNT_STORAGE_KEY)
        const parsed = stored === null ? Number.NaN : Number(stored)

        return Number.isFinite(parsed) ? parsed : null
      } catch {
        return null
      }
    },
    // Server render: unknown. Matching this on the client's first pass is what
    // keeps hydration quiet.
    () => null,
  )
}
