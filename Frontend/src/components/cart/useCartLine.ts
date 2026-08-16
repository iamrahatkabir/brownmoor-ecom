'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useMemo } from 'react'

type CartLine = {
  id?: string
  product: { id: number } | number
  quantity: number
  variant?: { id: number } | number
}

const idOf = (value: { id: number } | number | undefined): number | undefined =>
  typeof value === 'object' ? value?.id : value

/**
 * The cart line for one product-and-variant pair, plus the actions that change
 * it.
 *
 * Shared by the product page and the grid cards so the two can never drift
 * into behaving differently — the rule that quantity 1 removes rather than
 * decrements lives here, not in each button.
 */
export function useCartLine(productId: number, variantId?: number) {
  const { addItem, cart, decrementItem, incrementItem, isLoading, removeItem } = useCart()

  const line = useMemo(() => {
    const items = (cart?.items ?? []) as CartLine[]

    return items.find(
      (item) =>
        idOf(item.product) === productId &&
        // A product without variants must not match a line that has one.
        (variantId ? idOf(item.variant) === variantId : !item.variant),
    )
  }, [cart, productId, variantId])

  const quantity = line?.quantity ?? 0

  const add = useCallback(
    () => addItem({ product: productId, ...(variantId ? { variant: variantId } : {}) }),
    [addItem, productId, variantId],
  )

  const increment = useCallback(() => {
    if (line?.id) {
      return incrementItem(line.id)
    }
  }, [incrementItem, line])

  /** At one, the next step down empties the line rather than decrementing it. */
  const decrement = useCallback(() => {
    if (!line?.id) {
      return
    }

    return quantity <= 1 ? removeItem(line.id) : decrementItem(line.id)
  }, [decrementItem, line, quantity, removeItem])

  return { add, decrement, increment, inCart: quantity > 0, isLoading, quantity }
}
