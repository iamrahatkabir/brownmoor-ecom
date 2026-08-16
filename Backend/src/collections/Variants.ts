import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { compareAtPriceField } from '../fields/compareAtPrice'
import { weightField } from '../fields/weight'

/**
 * Variants carry their own pricing, so a sale on one size but not another has
 * to be expressible per variant rather than per product.
 */
export const variantsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [...defaultCollection.fields, compareAtPriceField(), weightField()],
})
