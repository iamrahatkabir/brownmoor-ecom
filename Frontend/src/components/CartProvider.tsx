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
        // Cart mutations are cross-origin to the Payload app, so the provider
        // needs the absolute origin rather than the storefront's own.
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
