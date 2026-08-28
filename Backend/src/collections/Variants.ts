import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { compareAtPriceField } from '../fields/compareAtPrice'
import { weightField } from '../fields/weight'

/**
 * The three collections behind product options, gathered into one sidebar
 * section.
 *
 * The plugin ships them ungrouped, so they sit loose in the nav between the
 * shop's own collections and are easy to miss. A size added to the wrong type,
 * or a stray option nobody uses, is hard to spot when the three are scattered.
 *
 * Nothing else changes: each is an ordinary collection, so listing, creating
 * and deleting all work as they already did.
 */
const VARIANTS_GROUP = 'Variants'

/**
 * Variants carry their own pricing, so a sale on one size but not another has
 * to be expressible per variant rather than per product.
 */
export const variantsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection.admin,
    // Which product a variant belongs to is the first thing you need when
    // reading a list of them; on its own, "20cm" says nothing.
    defaultColumns: ['title', 'product', 'priceInBDT', 'inventory'],
    group: VARIANTS_GROUP,
  },
  fields: [...defaultCollection.fields, compareAtPriceField(), weightField()],
})

/** The kinds of option a product can have — Size, Colour, and so on. */
export const variantTypesCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection.admin,
    defaultColumns: ['label', 'name'],
    group: VARIANTS_GROUP,
  },
})

/** The values within a type — 16cm, 20cm, 24cm under Size. */
export const variantOptionsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection.admin,
    // Without its type, a list of bare labels gives no way to tell which
    // "Small" belongs to which option.
    defaultColumns: ['label', 'value', 'variantType'],
    group: VARIANTS_GROUP,
  },
})
