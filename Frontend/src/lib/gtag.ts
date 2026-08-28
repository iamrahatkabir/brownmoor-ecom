/**
 * Google Analytics 4 transport.
 *
 * Mirrors lib/pixel.ts: a no-op when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, so
 * local development never reaches the property. The id is NEXT_PUBLIC_, so it
 * is compiled in at build time and changing it needs a redeploy.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Send a GA4 event. Silently does nothing if the tag is absent or still loading. */
export const trackGtag = (event: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', event, params)
}
