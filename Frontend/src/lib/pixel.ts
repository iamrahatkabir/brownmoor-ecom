/**
 * Meta (Facebook) Pixel.
 *
 * Everything here is a no-op when NEXT_PUBLIC_FACEBOOK_PIXEL_ID is unset, which
 * is the normal state locally — development traffic should never land in the
 * ad account's data.
 *
 * The id is read at build time because it is NEXT_PUBLIC_, so changing it on
 * Vercel requires a redeploy, not just a save.
 */

export const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? ''

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Send a standard event.
 *
 * Silently does nothing when the pixel is absent or has not loaded yet — an
 * analytics call must never be the reason a shopper cannot buy something.
 */
export const trackPixel = (event: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return
  }

  window.fbq('track', event, params)
}
