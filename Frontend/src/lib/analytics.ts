import { trackGtag } from './gtag'
import { trackPixel } from './pixel'

/**
 * One description of each commerce event, sent to both Meta and GA4.
 *
 * The two want different event names and different parameter shapes for the
 * same thing, so the mapping lives here rather than in the components. A page
 * that adds a product says so once; adding or removing a provider is a change
 * in this file alone.
 */

/** One line, priced in poisha like everything else in the system. */
export type AnalyticsItem = {
  id: string
  name?: string
  /** Unit price in poisha. */
  price?: null | number
  quantity?: number
}

/**
 * Poisha to Taka.
 *
 * Both services expect the major unit. Reporting 312000 instead of 3120 would
 * inflate revenue a hundredfold and make return on ad spend meaningless.
 */
export const toTaka = (minorUnits: number): number => Math.round(minorUnits) / 100

const CURRENCY = 'BDT'

const gaItems = (items: AnalyticsItem[]) =>
  items.map((item) => ({
    item_id: item.id,
    ...(item.name ? { item_name: item.name } : {}),
    ...(typeof item.price === 'number' ? { price: toTaka(item.price) } : {}),
    quantity: item.quantity ?? 1,
  }))

const contentIds = (items: AnalyticsItem[]) => items.map((item) => item.id)

const countItems = (items: AnalyticsItem[]) =>
  items.reduce((total, item) => total + (item.quantity ?? 1), 0)

/** A product page was opened. */
export const trackViewItem = (items: AnalyticsItem[], value?: null | number): void => {
  const money = typeof value === 'number' ? { currency: CURRENCY, value: toTaka(value) } : {}

  trackPixel('ViewContent', {
    content_ids: contentIds(items),
    content_type: 'product',
    ...(items[0]?.name ? { content_name: items[0].name } : {}),
    ...money,
  })

  trackGtag('view_item', { items: gaItems(items), ...money })
}

/** Something was added to the cart. */
export const trackAddToCart = (items: AnalyticsItem[], value?: null | number): void => {
  const money = typeof value === 'number' ? { currency: CURRENCY, value: toTaka(value) } : {}

  trackPixel('AddToCart', {
    content_ids: contentIds(items),
    content_type: 'product',
    ...money,
  })

  trackGtag('add_to_cart', { items: gaItems(items), ...money })
}

/** The shopper left the cart for checkout. */
export const trackBeginCheckout = (items: AnalyticsItem[], value: number): void => {
  trackPixel('InitiateCheckout', {
    content_ids: contentIds(items),
    content_type: 'product',
    currency: CURRENCY,
    num_items: countItems(items),
    value: toTaka(value),
  })

  trackGtag('begin_checkout', {
    currency: CURRENCY,
    items: gaItems(items),
    value: toTaka(value),
  })
}

/**
 * An order was placed.
 *
 * `value` is the grand total the courier collects, delivery included, and
 * `orderId` lets GA4 discard a duplicate if the confirmation is ever reloaded.
 */
export const trackPurchase = (
  items: AnalyticsItem[],
  value: number,
  orderId: number | string,
): void => {
  trackPixel('Purchase', {
    content_ids: contentIds(items),
    content_type: 'product',
    currency: CURRENCY,
    num_items: countItems(items),
    value: toTaka(value),
  })

  trackGtag('purchase', {
    currency: CURRENCY,
    items: gaItems(items),
    transaction_id: String(orderId),
    value: toTaka(value),
  })
}
