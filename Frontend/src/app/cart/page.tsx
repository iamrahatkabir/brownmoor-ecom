import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'

export const metadata: Metadata = {
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
