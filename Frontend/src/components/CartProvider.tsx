'use client'

import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import type { ReactNode } from 'react'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/**
 * Cart state for the whole storefront.
 *
 * The plugin's provider handles the parts that are easy to get subtly wrong:
 * creating a guest cart on first add, mirroring it to localStorage so a refresh
 * doesn't empty the basket, and merging that guest cart into the customer's own
 * when they log in.
 *
 * `enableVariants` matters — without it the provider ignores the variant id and
 * every size of a pan collapses into one cart line.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <EcommerceProvider
      api={{
        apiRoute: '/api',
        /**
         * The provider's own query populates only `priceInBDT` on products —
         * enough to total a cart, but not to draw one. Without widening this
         * the cart page gets lines whose product has a price and nothing else,
         * so every row renders an empty title and a /product/undefined link.
         */
        cartsFetchQuery: {
          depth: 2,
          populate: {
            products: {
              compareAtPriceInBDT: true,
              enableVariants: true,
              gallery: true,
              inventory: true,
              priceInBDT: true,
              slug: true,
              title: true,
            },
            variants: {
              compareAtPriceInBDT: true,
              inventory: true,
              options: true,
              priceInBDT: true,
              title: true,
            },
          },
        },
        // Ignored by this version of the provider — it builds URLs relative to
        // the page — which is why next.config.ts proxies /api to Payload.
        serverURL: PAYLOAD_URL,
      }}
      currenciesConfig={{
        defaultCurrency: 'BDT',
        supportedCurrencies: [
          { code: 'BDT', decimals: 2, label: 'Bangladeshi Taka', symbol: '৳' },
        ],
      }}
      enableVariants
      syncLocalStorage={{ key: 'brownmoor-cart' }}
    >
      {children}
    </EcommerceProvider>
  )
}
