import { selectCardFields } from './payload'
import type { Paginated, Product } from './types'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/**
 * Product search across title and short description.
 *
 * Payload maps `like` to ILIKE on Postgres, so matching is case-insensitive
 * without lowering anything by hand. Only published products are readable
 * without auth, so drafts are excluded by access control rather than here.
 */
export async function searchProducts(term: string, limit = 20, page = 1) {
  const params = new URLSearchParams({
    // Both results pages draw product cards, so they need the same narrow
    // projection the catalogue listings use — see selectCardFields.
    depth: '1',
    limit: String(limit),
    page: String(page),
  })

  selectCardFields(params)

  params.set('where[or][0][title][like]', term)
  params.set('where[or][1][shortDescription][like]', term)

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/products?${params.toString()}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return []
    }

    const data = (await res.json()) as Paginated<Product>

    return data.docs ?? []
  } catch {
    return []
  }
}

/** Same query, but keeping the pagination envelope for the results page. */
export async function searchProductsPage(term: string, limit = 20, page = 1) {
  const params = new URLSearchParams({
    // Both results pages draw product cards, so they need the same narrow
    // projection the catalogue listings use — see selectCardFields.
    depth: '1',
    limit: String(limit),
    page: String(page),
  })

  selectCardFields(params)

  params.set('where[or][0][title][like]', term)
  params.set('where[or][1][shortDescription][like]', term)

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/products?${params.toString()}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return { page: 1, products: [], totalDocs: 0, totalPages: 1 }
    }

    const data = (await res.json()) as Paginated<Product>

    return {
      page: data.page ?? 1,
      products: data.docs ?? [],
      totalDocs: data.totalDocs ?? 0,
      totalPages: data.totalPages ?? 1,
    }
  } catch {
    return { page: 1, products: [], totalDocs: 0, totalPages: 1 }
  }
}
