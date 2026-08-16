import type { Product, Variant } from './types'

/**
 * Every amount from Payload is an integer in the minor unit — 245000 is
 * ৳2,450.00. Formatting happens here and nowhere else, so a stray `/100` can't
 * quietly ship a price that is 100× wrong.
 */
export const formatBDT = (minorUnits: number): string => {
  const taka = minorUnits / 100

  // en-BD gives Bengali digit grouping (1,23,456) which is what shoppers in
  // Bangladesh expect, rather than the Western 123,456.
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: taka % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(taka)

  return `৳${formatted}`
}

export type PriceSummary = {
  /** Lowest live price, in minor units. Null when nothing is priced. */
  amount: number | null
  /** Struck-through "was" price. Only set when genuinely higher than `amount`. */
  compareAt: number | null
  /** Whole-number percentage off, or null when not discounted. */
  discountPercent: number | null
  /** True when variants span more than one price, so the UI can show "from". */
  isRange: boolean
  /** Highest live price; equals `amount` unless `isRange`. */
  maxAmount: number | null
}

const resolvedVariants = (product: Product): Variant[] =>
  (product.variants?.docs ?? []).filter((v): v is Variant => typeof v !== 'number')

/**
 * Collapses a product — with or without variants — into the numbers a card
 * needs.
 *
 * A compare-at price that is missing, zero, or not actually higher than the
 * live price yields no discount. That guard matters: a stale compare-at left
 * below the current price would otherwise render "-0%" or a negative badge.
 */
export const summarisePrice = (product: Product): PriceSummary => {
  const empty: PriceSummary = {
    amount: null,
    compareAt: null,
    discountPercent: null,
    isRange: false,
    maxAmount: null,
  }

  let prices: Array<{ amount: number; compareAt: number | null }> = []

  if (product.enableVariants) {
    prices = resolvedVariants(product)
      .filter((v) => typeof v.priceInBDT === 'number')
      .map((v) => ({
        amount: v.priceInBDT as number,
        compareAt: typeof v.compareAtPriceInBDT === 'number' ? v.compareAtPriceInBDT : null,
      }))
  } else if (typeof product.priceInBDT === 'number') {
    prices = [
      {
        amount: product.priceInBDT,
        compareAt:
          typeof product.compareAtPriceInBDT === 'number' ? product.compareAtPriceInBDT : null,
      },
    ]
  }

  if (prices.length === 0) {
    return empty
  }

  const amounts = prices.map((p) => p.amount)
  const amount = Math.min(...amounts)
  const maxAmount = Math.max(...amounts)

  // Pair the compare-at with the cheapest variant, since that's the price shown.
  const cheapest = prices.find((p) => p.amount === amount)
  const compareAt =
    cheapest?.compareAt && cheapest.compareAt > amount ? cheapest.compareAt : null

  return {
    amount,
    compareAt,
    discountPercent: compareAt ? Math.round(((compareAt - amount) / compareAt) * 100) : null,
    isRange: maxAmount > amount,
    maxAmount,
  }
}

/**
 * Total units available. Variant products sum their variants, since a product
 * with one in-stock size out of three is still buyable.
 */
export const stockLevel = (product: Product): number => {
  if (product.enableVariants) {
    return resolvedVariants(product).reduce((total, v) => total + (v.inventory ?? 0), 0)
  }

  return product.inventory ?? 0
}
