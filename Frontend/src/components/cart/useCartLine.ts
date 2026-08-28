'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useMemo, useState } from 'react'

import { trackAddToCart } from '@/lib/analytics'

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
export function useCartLine(
  productId: number,
  variantId?: number,
  /** Unit price in poisha, so AddToCart can carry a value. Optional: the
   *  quantity steppers on the cart page have no product context and do not
   *  report an add. */
  trackingValue?: null | number,
) {
  const { addItem, cart, decrementItem, incrementItem, removeItem } = useCart()

  /**
   * Pending state is local, not the provider's `isLoading`.
   *
   * That flag is cart-wide: every card on the page subscribes to the same
   * value, so one click would put every Add to cart button into a loading
   * state at once. Only the control that was actually pressed should react.
   */
  const [isPending, setIsPending] = useState(false)

  /**
   * What the shopper just asked for, shown before the server has agreed.
   *
   * Adding costs a write plus a refetch — around a second locally and several
   * over a real connection to the database's region. Waiting on that leaves a
   * spinner where the shopper expects an answer, so the control updates at once
   * and the server's version replaces it when it lands.
   */
  const [optimistic, setOptimistic] = useState<null | number>(null)

  const run = useCallback(async (action: () => Promise<unknown> | undefined) => {
    setIsPending(true)

    try {
      await action()
    } catch (error) {
      // The guess was wrong, so drop it and let the real cart show through
      // rather than leaving a quantity that was never saved.
      setOptimistic(null)
      throw error
    } finally {
      // Always clears, unconditionally. An earlier version guarded this with a
      // mounted ref whose cleanup ran under Strict Mode's double-invoke and was
      // never reset, so the flag stuck on and left the control disabled for
      // good. React 18 dropped the unmounted-setState warning that guard was
      // for, so there is nothing to protect against.
      setIsPending(false)
      // The provider refetches the cart before addItem resolves, so by now the
      // real quantity is in place and the guess can be retired.
      setOptimistic(null)
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

  const serverQuantity = line?.quantity ?? 0
  const quantity = optimistic ?? serverQuantity

  const add = useCallback(
    () => {
      setOptimistic(serverQuantity + 1)

      return run(async () => {
        await addItem({ product: productId, ...(variantId ? { variant: variantId } : {}) })

        // After the add succeeds, so a failed request is not reported as a
        // conversion.
        trackAddToCart(
          [{ id: String(variantId ?? productId), price: trackingValue }],
          trackingValue,
        )
      })
    },
    [addItem, productId, run, serverQuantity, trackingValue, variantId],
  )

  const increment = useCallback(() => {
    if (line?.id) {
      setOptimistic(serverQuantity + 1)

      return run(() => incrementItem(line.id!))
    }
  }, [incrementItem, line, run, serverQuantity])

  /** At one, the next step down empties the line rather than decrementing it. */
  const decrement = useCallback(() => {
    if (!line?.id) {
      return
    }

    setOptimistic(Math.max(0, serverQuantity - 1))

    return run(() => (quantity <= 1 ? removeItem(line.id!) : decrementItem(line.id!)))
  }, [decrementItem, line, quantity, removeItem, run, serverQuantity])

  return { add, decrement, increment, inCart: quantity > 0, isPending, quantity }
}
