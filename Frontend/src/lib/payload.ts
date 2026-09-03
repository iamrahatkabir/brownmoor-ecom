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

/**
 * The fields a product tile actually draws.
 *
 * Listings used to query at depth 2, which recursively populated each
 * product's `relatedProducts` — their galleries and rich-text descriptions
 * included — and returned 14MB to render a dozen cards. Vercel's data cache
 * refuses to store a response that large, so the entry could never be
 * replaced: listings kept serving a snapshot taken before the newest products
 * existed, while the products' own pages were fine. Asking for the eight
 * fields a card reads brings the same query back in about 30KB.
 */
const CARD_FIELDS = [
  'compareAtPriceInBDT',
  'enableVariants',
  'gallery',
  'inventory',
  'priceInBDT',
  'slug',
  'title',
  // Variant rows carry their own price and stock, which a card sums for the
  // "From ৳X" label, so the join has to come back populated.
  'variants',
] as const

/** Payload reads `select` as one bracketed parameter per field. */
export const selectCardFields = (params: URLSearchParams): void => {
  for (const field of CARD_FIELDS) {
    params.set(`select[${field}]`, 'true')
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
  // depth 2 so a featured category's own image resolves — at depth 1 the
  // category comes back but its image is still an id, and the tiles render blank.
  return api<HomePageGlobal>('/api/globals/home-page?depth=2')
}

/**
 * Top-level categories with their children attached, for the nav.
 *
 * Fetched in one request and assembled here rather than one query per parent —
 * a nav should not cost N round trips.
 */
export async function getCategoryTree(): Promise<CategoryTree[]> {
  /*
   * Two requests, issued together: the categories themselves, and the order the
   * admin arranged them in. Sorting server-side is not possible here — the
   * order lives in a global, not on the category rows.
   */
  const [result, navigation] = await Promise.all([
    api<Paginated<Category>>('/api/categories?depth=1&limit=100&sort=title'),
    api<{ menu?: Array<Category | number> | null }>('/api/globals/navigation?depth=0'),
  ])

  if (!result?.docs) {
    return []
  }

  const arranged = (navigation?.menu ?? []).map((entry) =>
    typeof entry === 'number' ? entry : entry.id,
  )

  /**
   * Position in the admin's list, or the end for anything not in it.
   *
   * A category added after the menu was last arranged still appears — after the
   * ordered ones, alphabetically, because the base query sorts by title. It is
   * never silently dropped from the navigation.
   */
  const rank = (category: Category): number => {
    const position = arranged.indexOf(category.id)

    return position === -1 ? Number.MAX_SAFE_INTEGER : position
  }

  const inMenuOrder = (a: Category, b: Category): number => rank(a) - rank(b)

  const parentIdOf = (category: Category): number | null => {
    if (!category.parent) {
      return null
    }

    return typeof category.parent === 'number' ? category.parent : category.parent.id
  }

  const roots = result.docs.filter((c) => parentIdOf(c) === null).sort(inMenuOrder)

  return roots.map((root) => ({
    ...root,
    // Children are ordered by the same list, so a dropdown follows the admin's
    // arrangement rather than the alphabet.
    children: result.docs.filter((c) => parentIdOf(c) === root.id).sort(inMenuOrder),
  }))
}

type ProductQuery = {
  categorySlug?: string
  featured?: boolean
  ids?: number[]
  limit?: number
}

export async function getProducts({
  categorySlug,
  featured,
  ids,
  limit = 8,
}: ProductQuery = {}): Promise<Product[]> {
  // An explicit empty selection means "nothing", not "everything" — without
  // this guard the query would drop the filter and return the whole catalogue.
  if (ids && ids.length === 0) {
    return []
  }

  const params = new URLSearchParams({
    // depth 1 resolves the gallery images and the variant rows. Depth 2 also
    // dragged in every related product's own gallery, which no card shows.
    depth: '1',
    limit: String(ids?.length ?? limit),
    sort: '-createdAt',
  })

  selectCardFields(params)

  if (featured) {
    params.set('where[featured][equals]', 'true')
  }

  if (categorySlug) {
    params.set('where[categories.slug][equals]', categorySlug)
  }

  if (ids) {
    params.set('where[id][in]', ids.join(','))
  }

  const result = await api<Paginated<Product>>(`/api/products?${params.toString()}`)
  const docs = result?.docs ?? []

  if (!ids) {
    return docs
  }

  // Payload returns rows in its own order, so restore the sequence the admin
  // arranged in the panel. Missing ids (unpublished or deleted since) simply
  // drop out rather than leaving a gap.
  const byId = new Map(docs.map((doc) => [doc.id, doc]))

  return ids.map((id) => byId.get(id)).filter((doc): doc is Product => Boolean(doc))
}

/** How many products fill one listing page. */
export const PAGE_SIZE = 20

export type ProductPage = {
  page: number
  products: Product[]
  totalDocs: number
  totalPages: number
}

/**
 * A page of products for a listing.
 *
 * Filtering by a parent category also returns its children's products, because
 * the seed assigns a product to both — browsing Cookware should not come back
 * empty just because everything sits under Saucepans.
 */
export async function getProductsPage({
  categorySlug,
  page = 1,
}: {
  categorySlug?: string
  page?: number
}): Promise<ProductPage> {
  const params = new URLSearchParams({
    depth: '1',
    limit: String(PAGE_SIZE),
    page: String(Math.max(1, page)),
    sort: '-createdAt',
  })

  selectCardFields(params)

  if (categorySlug) {
    params.set('where[categories.slug][equals]', categorySlug)
  }

  const result = await api<Paginated<Product>>(`/api/products?${params.toString()}`)

  return {
    page: result?.page ?? 1,
    products: result?.docs ?? [],
    totalDocs: result?.totalDocs ?? 0,
    totalPages: result?.totalPages ?? 1,
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const params = new URLSearchParams({ depth: '0', limit: '1' })
  params.set('where[slug][equals]', slug)

  const result = await api<Paginated<Category>>(`/api/categories?${params.toString()}`)

  return result?.docs?.[0] ?? null
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const params = new URLSearchParams({ depth: '2', limit: '1' })
  params.set('where[slug][equals]', slug)

  const result = await api<Paginated<Product>>(`/api/products?${params.toString()}`)

  return result?.docs?.[0] ?? null
}

/**
 * Curated related products, falling back to others in the same category.
 *
 * The fallback matters: an empty strip at the bottom of every product page
 * would be worse than a slightly loose suggestion, and staff cannot be expected
 * to curate every product by hand.
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const curated = toIds(product.relatedProducts)

  if (curated) {
    return getProducts({ ids: curated })
  }

  const categoryId = product.categories?.find((c) => typeof c !== 'number')
  const slug = typeof categoryId === 'object' ? categoryId.slug : undefined

  if (!slug) {
    return []
  }

  const siblings = await getProducts({ categorySlug: slug, limit: limit + 1 })

  // Drop the product itself, then trim — fetching one extra above means a full
  // row survives that removal.
  return siblings.filter((p) => p.id !== product.id).slice(0, limit)
}

/** Relationship fields arrive as ids or as full documents, depending on depth. */
export const toIds = (
  values: Array<number | { id: number }> | null | undefined,
): number[] | undefined => {
  if (!values || values.length === 0) {
    return undefined
  }

  return values.map((value) => (typeof value === 'number' ? value : value.id))
}
