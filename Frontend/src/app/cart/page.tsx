import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'

export const metadata: Metadata = {
  // A cart is per-shopper and empty to a crawler, so there is nothing here
  // worth indexing. Links are still followed to the products it lists.
  robots: { follow: true, index: false },
  title: 'Shopping cart',
}

export default function CartPage() {
  return (
    <>
      <CheckoutSteps current="cart" />
      <CartView />
    </>
  )
}
