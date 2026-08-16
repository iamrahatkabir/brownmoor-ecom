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
  admin: {
    ...defaultCollection.admin,
    // Staff work this list to pack and dispatch, so the useful columns are who
    // to call, where it goes and what to collect. The plugin's default shows
    // none of those.
    defaultColumns: ['id', 'customerPhone', 'deliveryAddress', 'orderTotal', 'status', 'createdAt'],
  },
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
    /*
     * List columns, read off the shipping address rather than stored again, so
     * they cannot drift from it and no migration is needed.
     */
    {
      name: 'customerPhone',
      type: 'text',
      admin: { description: 'From the delivery address.', readOnly: true },
      hooks: { afterRead: [({ data }) => data?.shippingAddress?.phone ?? null] },
      label: 'Mobile',
      virtual: true,
    },
    {
      name: 'deliveryAddress',
      type: 'text',
      admin: { description: 'From the delivery address.', readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) =>
            [data?.shippingAddress?.addressLine1, data?.shippingAddress?.addressLine2]
              .filter(Boolean)
              .join(', ') || null,
        ],
      },
      label: 'Address',
      virtual: true,
    },
    {
      name: 'orderTotal',
      type: 'text',
      admin: { description: 'Amount to collect on delivery.', readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) =>
            // Stored in poisha; staff read taka.
            typeof data?.amount === 'number'
              ? `৳${(data.amount / 100).toLocaleString('en-BD')}`
              : null,
        ],
      },
      label: 'Total',
      virtual: true,
    },
  ],
})
