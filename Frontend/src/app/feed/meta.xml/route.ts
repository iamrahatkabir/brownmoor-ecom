import { buildMetaFeed } from '@/lib/feed'

/**
 * The product feed Meta pulls to build the Facebook and Instagram catalogue.
 *
 * Point a Data Feed at `https://<site>/feed/meta.xml` in Commerce Manager and
 * let Meta fetch it on a schedule; nothing here needs to push.
 *
 * Served from the storefront rather than the backend on purpose. The links and
 * images in it are the storefront's own, and Meta must be able to reach it
 * without credentials — the Payload admin API is the wrong place for either.
 *
 * Route handlers are not cached in Next 16, so this function runs per request.
 * That is fine: the Payload queries underneath it carry their own revalidate
 * window, so a request that arrives inside it costs nothing but the XML
 * assembly. See `REVALIDATE_SECONDS` in lib/feed.ts.
 */
export async function GET() {
  try {
    const { itemCount, xml } = await buildMetaFeed()

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        /*
         * Lets a CDN keep serving the last good feed for a day while it
         * refreshes underneath. Meta retries a failed fetch, but a feed that
         * 500s for long enough has its items marked stale, so staying up with
         * slightly old prices beats being briefly unavailable.
         */
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        /* Read by nothing; here so a human checking the feed can see the count. */
        'X-Item-Count': String(itemCount),
      },
      status: 200,
    })
  } catch (error) {
    /*
     * Deliberately not a partial feed.
     *
     * Meta treats a missing item as "stop advertising this", so serving a
     * half-built document after a failed catalogue walk would pull live
     * products out of the shop's ads. A 503 makes Meta retry and leaves the
     * previous good feed in place.
     */
    console.error('Meta feed: refusing to serve a partial feed', error)

    return new Response('Feed temporarily unavailable.', {
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
      status: 503,
    })
  }
}
