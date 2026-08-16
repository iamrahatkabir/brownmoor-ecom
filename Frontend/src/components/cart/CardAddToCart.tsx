'use client'

import { QuantityStepper } from './QuantityStepper'
import { useCartLine } from './useCartLine'

/**
 * The action on a grid card, for products with no variants.
 *
 * Adds straight to the cart and turns into a stepper — a shopper buying three
 * chopping boards should not have to open the product page three times.
 *
 * Products with variants never reach this: a size has to be chosen first, so
 * their card links to the product page instead.
 */
export function CardAddToCart({
  productId,
  stock,
}: {
  productId: number
  stock: number
}) {
  const { add, decrement, inCart, increment, isPending, quantity } = useCartLine(productId)

  if (inCart) {
    return (
      <QuantityStepper
        className="h-10"
        disabled={isPending}
        max={stock}
        onDecrement={decrement}
        onIncrement={increment}
        quantity={quantity}
      />
    )
  }

  return (
    <button
      className="h-10 w-full rounded-lg bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted disabled:bg-wash disabled:text-faint"
      disabled={isPending}
      onClick={() => add()}
      type="button"
    >
      Add to cart
    </button>
  )
}
