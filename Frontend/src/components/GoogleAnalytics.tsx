import Script from 'next/script'

import { GA_MEASUREMENT_ID } from '@/lib/gtag'

/**
 * Google Analytics 4 tag.
 *
 * Renders nothing without a measurement id, so environments that have not been
 * given one carry no tracking at all.
 *
 * GA4 counts a page_view on load by itself. Because the storefront navigates
 * with full page loads rather than client-side routing, that happens on every
 * page without a route-change listener — the piece a single-page app needs and
 * most guides get wrong.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
