'use client'

import { Spinner } from '@/components/Spinner'

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
        className="h-9 md:h-10"
        disabled={isPending}
        pending={isPending}
        max={stock}
        onDecrement={decrement}
        onIncrement={increment}
        quantity={quantity}
      />
    )
  }

  return (
    <button
      className="h-9 w-full rounded-lg bg-ink text-[11px] tracked text-paper transition-colors hover:bg-muted disabled:bg-wash disabled:text-faint md:h-10"
      disabled={isPending}
      onClick={() => add()}
      type="button"
    >
      {/* The label is swapped rather than sitting beside the spinner, so the
          button does not change width mid-press. */}
      {isPending ? <Spinner className="mx-auto h-4 w-4" /> : 'Add to cart'}
    </button>
  )
}
