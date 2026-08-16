import type {
  Category,
  CategoryTree,
  HomePageGlobal,
  Media,
  Paginated,
  Product,
} from './types'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/**
 * Next 16 does not cache `fetch` by default, so every request would otherwise
 * hit Payload on each render. Catalogue data changes rarely, so a short
 * revalidation window keeps the homepage fast without going stale for long.
 */
const REVALIDATE_SECONDS = 60

async function api<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<T | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate },
    })

    if (!res.ok) {
      console.error(`Payload ${res.status} for ${path}`)
      return null
    }

    return (await res.json()) as T
  } catch (error) {
    // A homepage that renders without its product grid beats a 500. Callers
    // fall back to empty state when this returns null.
    console.error(`Payload request failed for ${path}`, error)
    return null
  }
}

/** Absolute URL for a Payload upload; relative paths won't resolve cross-origin. */
export const mediaURL = (media: Media | number | null | undefined, size?: string): string | null => {
  if (!media || typeof media === 'number') {
    return null
  }

  const url = (size && media.sizes?.[size]?.url) || media.url

  if (!url) {
    return null
  }

  return url.startsWith('http') ? url : `${PAYLOAD_URL}${url}`
}

export const firstImage = (product: Product): Media | null => {
  const image = product.gallery?.[0]?.image
  return image && typeof image !== 'number' ? image : null
}

export async function getHomePage(): Promise<HomePageGlobal | null> {
  return api<HomePageGlobal>('/api/globals/home-page?depth=1')
}

/**
 * Top-level categories with their children attached, for the nav.
 *
 * Fetched in one request and assembled here rather than one query per parent —
 * a nav should not cost N round trips.
 */
export async function getCategoryTree(): Promise<CategoryTree[]> {
  const result = await api<Paginated<Category>>('/api/categories?depth=1&limit=100&sort=title')

  if (!result?.docs) {
    return []
  }

  const parentIdOf = (category: Category): number | null => {
    if (!category.parent) {
      return null
    }

    return typeof category.parent === 'number' ? category.parent : category.parent.id
  }

  const roots = result.docs.filter((c) => parentIdOf(c) === null)

  return roots.map((root) => ({
    ...root,
    children: result.docs.filter((c) => parentIdOf(c) === root.id),
  }))
}

type ProductQuery = {
  categorySlug?: string
  featured?: boolean
  limit?: number
}

export async function getProducts({
  categorySlug,
  featured,
  limit = 8,
}: ProductQuery = {}): Promise<Product[]> {
  const params = new URLSearchParams({
    // depth 2 resolves gallery images and the variants' option labels.
    depth: '2',
    limit: String(limit),
    sort: '-createdAt',
  })

  if (featured) {
    params.set('where[featured][equals]', 'true')
  }

  if (categorySlug) {
    params.set('where[categories.slug][equals]', categorySlug)
  }

  const result = await api<Paginated<Product>>(`/api/products?${params.toString()}`)

  return result?.docs ?? []
}
