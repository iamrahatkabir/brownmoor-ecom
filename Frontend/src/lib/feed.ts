import { mediaURL } from './payload'
import { variantLabel } from './price'
import type { Media, Product, Variant } from './types'

/**
 * Meta (Facebook / Instagram) product catalogue feed.
 *
 * Meta ingests the same RSS 2.0 dialect Google Merchant uses — an `<item>` per
 * buyable thing, with the commerce fields in the `g:` namespace. Meta re-fetches
 * on its own schedule, so this is a document we publish rather than an API it
 * queries: every item has to stand alone.
 *
 * Amounts arrive in poisha like everywhere else in this codebase, but Meta
 * wants a decimal major unit with a currency code, so the formatting here is
 * deliberately *not* `formatBDT` — see `feedPrice`.
 */

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/**
 * The storefront's own public origin.
 *
 * Every link in the feed has to be absolute: Meta resolves them from its own
 * servers, where a relative path means nothing. Nothing else in the storefront
 * needed to know its own address until now, which is why this variable is new.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/$/, '')

const BRAND = 'Brownmoor'

/** Meta's ceilings. Exceeding one rejects the item, so text is cut to fit. */
const MAX_TITLE = 200
const MAX_DESCRIPTION = 5000
/** Meta accepts up to 20 extra images per item. */
const MAX_ADDITIONAL_IMAGES = 20
/** Feed specs accept at most five product types per item. */
const MAX_PRODUCT_TYPES = 5

/** Products per request when walking the catalogue. */
const PAGE_SIZE = 100

/**
 * Stop condition for the pagination loop.
 *
 * A feed is a full catalogue scan, so a miscounted `totalPages` — or a
 * catalogue that grows while we walk it — must not spin forever inside a
 * request. 100 pages is 10,000 products, far beyond this shop.
 */
const MAX_PAGES = 100

/** Catalogue data changes rarely and Meta pulls at most hourly, so cache wide. */
const REVALIDATE_SECONDS = 3600

/**
 * Only what an item needs. The same reasoning as `CARD_FIELDS` in payload.ts:
 * an unprojected query at depth 1 drags back every product's rich text and
 * full gallery, and this one asks for the *whole* catalogue rather than a page
 * of it, so the saving compounds.
 */
const FEED_FIELDS = [
  'categories',
  'compareAtPriceInBDT',
  'description',
  'enableVariants',
  'gallery',
  'inventory',
  'priceInBDT',
  'shortDescription',
  'slug',
  'title',
  'variants',
] as const

/**
 * Characters XML 1.0 forbids outright.
 *
 * One stray control byte pasted into a product description — they arrive via
 * copy-paste from Word often enough — makes the document unparseable, and Meta
 * rejects the *entire* feed rather than the one item. Stripped before escaping.
 */
// Built from a string rather than written as a regex literal: the literal
// form puts real control bytes in this file, where they are invisible in an
// editor and do not survive a copy-paste.
const ILLEGAL_XML = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]', 'g')

const escapeXML = (value: string): string =>
  value
    .replace(ILLEGAL_XML, '')
    // Ampersand first: escaping it after the others would double-escape them.
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** Collapses runs of whitespace; newlines inside an XML element are noise. */
const flatten = (value: string): string => value.replace(/\s+/g, ' ').trim()

const truncate = (value: string, limit: number): string =>
  value.length <= limit ? value : `${value.slice(0, limit - 1).trimEnd()}...`

type LexicalNode = { children?: LexicalNode[]; text?: string; type?: string }

/**
 * Flattens Payload's Lexical rich text to plain text.
 *
 * Meta shows the description as plain text, so the markup the storefront
 * renders is not wanted here — only the words. Walks for `text` nodes and
 * ignores structure, which is enough because the alternative is shipping raw
 * Lexical JSON to a shopper's screen.
 */
const lexicalToText = (content: unknown): string => {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root

  if (!root?.children?.length) {
    return ''
  }

  const parts: string[] = []

  const walk = (nodes: LexicalNode[]): void => {
    for (const node of nodes) {
      if (typeof node.text === 'string') {
        parts.push(node.text)
      }

      if (node.children?.length) {
        walk(node.children)
      }
    }
  }

  walk(root.children)

  return flatten(parts.join(' '))
}

/**
 * Poisha to the decimal major unit Meta expects, e.g. `1250.00 BDT`.
 *
 * Explicitly not `formatBDT`: that renders a currency symbol and Bengali digit
 * grouping, which is right for a shopper and unparseable to Meta.
 */
const feedPrice = (poisha: number): string => `${(poisha / 100).toFixed(2)} BDT`

const resolvedVariants = (product: Product): Variant[] =>
  (product.variants?.docs ?? []).filter((v): v is Variant => typeof v !== 'number')

const galleryImages = (product: Product): Media[] =>
  (product.gallery ?? [])
    .map((entry) => entry.image)
    .filter((image): image is Media => typeof image !== 'number')

/**
 * The product's categories, one per entry.
 *
 * Deliberately *not* joined into a `A > B > C` path. `categories` is a flat
 * `hasMany` list, so a product filed under both Tableware and Storage would
 * render as a hierarchy that does not exist and reads as nonsense in Meta's
 * catalogue. The real parent chain is not available here: resolving it needs
 * depth 2, which is what bloated the listing queries to 14MB (see payload.ts).
 *
 * `g:product_type` is a repeatable element, so each category gets its own tag.
 */
const productTypes = (product: Product): string[] =>
  (product.categories ?? [])
    .filter((c): c is Exclude<typeof c, number> => typeof c !== 'number')
    .map((c) => c.title)
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_TYPES)

/**
 * One row of the feed.
 *
 * `itemGroupId` is set only on a variant: it tells Meta that several items are
 * one product in different sizes, so the catalogue shows a single entry with a
 * size picker instead of near-duplicate listings competing with each other in
 * the same ad auction.
 */
type FeedItem = {
  additionalImageLinks: string[]
  availability: 'in stock' | 'out of stock'
  description: string
  id: string
  imageLink: string
  itemGroupId?: string
  link: string
  /** Regular price. When on sale this is the compare-at, and `salePrice` is live. */
  price: string
  productTypes: string[]
  quantity: number
  salePrice?: string
  title: string
}

/**
 * Pairs a live price with its "was".
 *
 * Meta reads `price` as the regular price and `sale_price` as what is charged
 * now, which is the reverse of how the storefront holds them — so a product on
 * sale sends its compare-at as `price`. Getting this backwards advertises the
 * discounted figure as the regular one, and the saving never shows.
 */
const pricing = (
  amount: number,
  compareAt: null | number | undefined,
): { price: string; salePrice?: string } => {
  const onSale = typeof compareAt === 'number' && compareAt > amount

  return onSale
    ? { price: feedPrice(compareAt), salePrice: feedPrice(amount) }
    : { price: feedPrice(amount) }
}

/**
 * Turns one product into its feed rows — one per variant, or one for the
 * product itself.
 *
 * Returns an array because a product with three sizes is three buyable things
 * to Meta, each with its own price, stock and id.
 *
 * A product with no image or no price yields nothing: Meta requires both, so
 * emitting the item would only produce a rejection in the catalogue's error
 * report, where it is far harder to notice than an absence.
 */
const itemsForProduct = (product: Product): FeedItem[] => {
  const images = galleryImages(product)
  const imageLink = mediaURL(images[0], 'feature')

  if (!imageLink || !product.slug) {
    return []
  }

  const additionalImageLinks = images
    .slice(1, MAX_ADDITIONAL_IMAGES + 1)
    .map((image) => mediaURL(image, 'feature'))
    .filter((url): url is string => Boolean(url))

  const description = truncate(
    flatten(product.shortDescription || lexicalToText(product.description) || product.title),
    MAX_DESCRIPTION,
  )

  const shared = {
    additionalImageLinks,
    description,
    imageLink,
    link: `${SITE_URL}/product/${product.slug}`,
    productTypes: productTypes(product),
  }

  const variants = resolvedVariants(product)

  // `enableVariants` can be ticked before any variant exists; the product is
  // then still bought at its own price, exactly as the buy box treats it.
  if (product.enableVariants && variants.length > 0) {
    return variants.flatMap((variant) => {
      if (typeof variant.priceInBDT !== 'number') {
        return []
      }

      const stock = variant.inventory ?? 0
      const label = variantLabel(variant)

      return [
        {
          ...shared,
          ...pricing(variant.priceInBDT, variant.compareAtPriceInBDT),
          availability: stock > 0 ? ('in stock' as const) : ('out of stock' as const),
          // Distinct per variant, prefixed with the product so the pair stays
          // readable in Meta's error reports.
          id: `${product.id}-${variant.id}`,
          itemGroupId: String(product.id),
          quantity: stock,
          title: truncate(label ? `${product.title} - ${label}` : product.title, MAX_TITLE),
        },
      ]
    })
  }

  if (typeof product.priceInBDT !== 'number') {
    return []
  }

  const stock = product.inventory ?? 0

  return [
    {
      ...shared,
      ...pricing(product.priceInBDT, product.compareAtPriceInBDT),
      availability: stock > 0 ? ('in stock' as const) : ('out of stock' as const),
      id: String(product.id),
      quantity: stock,
      title: truncate(product.title, MAX_TITLE),
    },
  ]
}

const tag = (name: string, value: string): string => `      <${name}>${escapeXML(value)}</${name}>`

const renderItem = (item: FeedItem): string =>
  [
    '    <item>',
    tag('g:id', item.id),
    tag('g:title', item.title),
    tag('g:description', item.description),
    tag('g:link', item.link),
    tag('g:image_link', item.imageLink),
    ...item.additionalImageLinks.map((url) => tag('g:additional_image_link', url)),
    tag('g:availability', item.availability),
    tag('g:condition', 'new'),
    tag('g:price', item.price),
    ...(item.salePrice ? [tag('g:sale_price', item.salePrice)] : []),
    tag('g:brand', BRAND),
    ...item.productTypes.map((type) => tag('g:product_type', type)),
    ...(item.itemGroupId ? [tag('g:item_group_id', item.itemGroupId)] : []),
    tag('g:quantity_to_sell_on_facebook', String(item.quantity)),
    '    </item>',
  ].join('\n')

/**
 * Every published product, walked a page at a time.
 *
 * Drafts never appear: the products collection is readable unauthenticated
 * only where `_status` is published, so access control filters them out and
 * this does not have to.
 *
 * Throws rather than returning a short list. A partial feed is worse than no
 * feed — Meta reads an item's absence as a signal to stop advertising it, so a
 * catalogue walk that broke half way would quietly pull live products from the
 * shop's ads.
 */
const fetchAllProducts = async (): Promise<Product[]> => {
  const products: Product[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      depth: '1',
      limit: String(PAGE_SIZE),
      page: String(page),
      sort: '-createdAt',
    })

    for (const field of FEED_FIELDS) {
      params.set(`select[${field}]`, 'true')
    }

    const res = await fetch(`${PAYLOAD_URL}/api/products?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) {
      throw new Error(`Payload returned ${res.status} for products page ${page}`)
    }

    const batch = (await res.json()) as { docs?: Product[]; totalPages?: number }

    products.push(...(batch.docs ?? []))

    if (!batch.totalPages || page >= batch.totalPages) {
      break
    }
  }

  return products
}

/** The whole document, plus a count the caller can log or sanity-check. */
export const buildMetaFeed = async (): Promise<{ itemCount: number; xml: string }> => {
  const products = await fetchAllProducts()
  const items = products.flatMap(itemsForProduct)

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">',
    '  <channel>',
    `    <title>${escapeXML(`${BRAND}.com`)}</title>`,
    `    <link>${escapeXML(SITE_URL)}</link>`,
    `    <description>${escapeXML('Kitchenware, delivered across Bangladesh.')}</description>`,
    ...items.map(renderItem),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  return { itemCount: items.length, xml }
}
