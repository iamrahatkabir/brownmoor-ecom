import type { Metadata } from 'next'

import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { CheckoutView } from '@/components/checkout/CheckoutView'

export const metadata: Metadata = {
  // Same reasoning as the cart: no crawlable content, and a checkout form
  // is not a useful search result.
  robots: { follow: true, index: false },
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <>
      <CheckoutSteps current="checkout" />
      <CheckoutView />
    </>
  )
}
