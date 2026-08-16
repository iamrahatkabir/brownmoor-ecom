/**
 * Shapes returned by the Payload REST API.
 *
 * Deliberately hand-written and narrow rather than importing the backend's
 * generated `payload-types.ts`: the storefront is a separate deployable and
 * should not reach into the backend's source tree. These describe only the
 * fields the storefront actually reads.
 */

export type Media = {
  id: number
  alt?: string | null
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null }>
}

export type Category = {
  id: number
  title: string
  slug: string
  description?: string | null
  parent?: Category | number | null
}

/** A category with its children resolved, ready for a nav dropdown. */
export type CategoryTree = Category & { children: Category[] }

export type Variant = {
  id: number
  title?: string | null
  inventory?: number | null
  priceInBDT?: number | null
  compareAtPriceInBDT?: number | null
  options?: Array<{ id: number; label: string; value: string }>
}

export type Product = {
  id: number
  title: string
  slug: string
  shortDescription?: string | null
  gallery?: Array<{ image: Media | number }> | null
  categories?: Array<Category | number> | null
  featured?: boolean | null
  inventory?: number | null
  enableVariants?: boolean | null
  priceInBDT?: number | null
  compareAtPriceInBDT?: number | null
  variants?: { docs?: Array<Variant | number> }
  relatedProducts?: Array<Product | number> | null
  description?: unknown
  careInstructions?: string | null
  specifications?: Array<{ id?: string; label: string; value: string }> | null
}

/** One admin-configured product band on the homepage. */
export type HomeSection = {
  id?: string
  eyebrow?: string | null
  heading: string
  intro?: string | null
  /** Hand-picked, in the order arranged in the admin panel. No fixed limit. */
  products?: Array<Product | number> | null
  viewAllLabel?: string | null
  viewAllUrl?: string | null
}

export type HomePageGlobal = {
  image?: Media | number | null
  heading?: string | null
  subheading?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  sections?: HomeSection[] | null
}

export type Paginated<T> = {
  docs: T[]
  hasNextPage?: boolean
  hasPrevPage?: boolean
  page?: number
  totalDocs: number
  totalPages?: number
}
