import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { amountField } from '@payloadcms/plugin-ecommerce'

import { BDT, currenciesConfig } from '../currencies'

/**
 * The plugin's order has a single `amount`, which we treat as the grand total
 * — goods plus delivery. Splitting the parts out here means staff can see what
 * was actually charged for shipping, and the courier gets a parcel weight,
 * without having to recompute either from the line items.
 *
 * These are snapshots, deliberately. If rates change next month, an order
 * placed today must still show what the customer was quoted.
 */
export const ordersCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [
    ...defaultCollection.fields,
    amountField({
      currenciesConfig,
      currency: BDT,
      overrides: {
        name: 'shippingAmount',
        admin: {
          description: 'Delivery charge at the time of ordering. Included in the order total.',
          readOnly: true,
        },
        label: 'Shipping charge (BDT)',
      },
    }),
    {
      name: 'shippingZone',
      type: 'text',
      admin: {
        description: 'Delivery zone this order was priced against.',
        readOnly: true,
      },
    },
    {
      name: 'totalWeightGrams',
      type: 'number',
      admin: {
        description: 'Parcel weight for the courier docket.',
        readOnly: true,
      },
      label: 'Parcel weight (g)',
    },
  ],
})
