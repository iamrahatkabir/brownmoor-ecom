'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useMemo, useState } from 'react'

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
  const { addItem, cart, decrementItem, incrementItem, removeItem } = useCart()

  /**
   * Pending state is local, not the provider's `isLoading`.
   *
   * That flag is cart-wide: every card on the page subscribes to the same
   * value, so one click would put every Add to cart button into a loading
   * state at once. Only the control that was actually pressed should react.
   */
  const [isPending, setIsPending] = useState(false)

  const run = useCallback(async (action: () => Promise<unknown> | undefined) => {
    setIsPending(true)

    try {
      await action()
    } finally {
      // Always clears, unconditionally. An earlier version guarded this with a
      // mounted ref whose cleanup ran under Strict Mode's double-invoke and was
      // never reset, so the flag stuck on and left the control disabled for
      // good. React 18 dropped the unmounted-setState warning that guard was
      // for, so there is nothing to protect against.
      setIsPending(false)
    }
  }, [])

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
    () => run(() => addItem({ product: productId, ...(variantId ? { variant: variantId } : {}) })),
    [addItem, productId, run, variantId],
  )

  const increment = useCallback(() => {
    if (line?.id) {
      return run(() => incrementItem(line.id!))
    }
  }, [incrementItem, line, run])

  /** At one, the next step down empties the line rather than decrementing it. */
  const decrement = useCallback(() => {
    if (!line?.id) {
      return
    }

    return run(() => (quantity <= 1 ? removeItem(line.id!) : decrementItem(line.id!)))
  }, [decrementItem, line, quantity, removeItem, run])

  return { add, decrement, increment, inCart: quantity > 0, isPending, quantity }
}
