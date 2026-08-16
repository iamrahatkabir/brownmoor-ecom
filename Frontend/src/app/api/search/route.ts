import { NextResponse } from 'next/server'

import { firstImage, mediaURL } from '@/lib/payload'
import { searchProducts } from '@/lib/search'

/**
 * Suggestions for the header search.
 *
 * A storefront route rather than calling Payload from the browser: it shapes
 * the response down to what the dropdown draws, so a keystroke does not ship a
 * full product document per hit.
 */
export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get('q')?.trim() ?? ''

  if (term.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const products = await searchProducts(term, 6)

  return NextResponse.json({
    results: products.map((product) => ({
      href: `/product/${product.slug}`,
      id: product.id,
      image: mediaURL(firstImage(product), 'thumbnail'),
      price: typeof product.priceInBDT === 'number' ? product.priceInBDT : null,
      title: product.title,
    })),
  })
}
