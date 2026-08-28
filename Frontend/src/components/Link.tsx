import type { AnchorHTMLAttributes } from 'react'

/**
 * A plain anchor, used everywhere the storefront previously used `next/link`.
 *
 * Every navigation is a full browser page load rather than Next's client-side
 * routing, which is how a traditional ecommerce site behaves: each page arrives
 * fresh from the server, the browser draws its own progress indicator, and
 * nothing carries over between pages.
 *
 * It lives in one component on purpose. The choice is a trade — soft navigation
 * is faster and keeps client state alive — so keeping it in a single file means
 * swapping this implementation back to `next/link` restores the old behaviour
 * across the whole site, rather than editing every call site again.
 */
export function Link({
  href,
  ...rest
}: { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return <a href={href} {...rest} />
}
