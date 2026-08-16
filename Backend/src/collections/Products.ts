import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { compareAtPriceField } from '../fields/compareAtPrice'
import { weightField } from '../fields/weight'
import { slugField } from '../fields/slugField'

/**
 * The plugin's products collection ships only the commerce machinery — prices,
 * inventory and the variants config. Everything a shopper actually reads
 * (name, photos, copy, category) is ours to add.
 *
 * The plugin's own fields are appended after these so that price and inventory
 * keep whatever behaviour the plugin gives them.
 */
export const productsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection.admin,
    defaultColumns: ['title', 'categories', 'prices', '_status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              admin: {
                description: 'One or two lines for listing pages and search results.',
              },
              maxLength: 300,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'First image is used as the product thumbnail.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
              labels: {
                plural: 'Images',
                singular: 'Image',
              },
              minRows: 1,
            },
            // The plugin's fields: prices, inventory, and the variants setup.
            ...defaultCollection.fields,
            // Sits after the plugin's price field so the two read together in
            // the admin. Only meaningful on products without variants —
            // variants carry their own compare-at price.
            {
              ...compareAtPriceField(),
              admin: {
                ...compareAtPriceField().admin,
                condition: (data) => !data?.enableVariants,
              },
            },
          ],
          label: 'Details',
        },
        {
          fields: [
            {
              name: 'specifications',
              type: 'array',
              admin: {
                description:
                  'Kitchenware buyers compare on specifics — material, capacity, diameter, whether it is dishwasher or induction safe.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: { width: '40%' },
                      required: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      admin: { width: '60%' },
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'careInstructions',
              type: 'textarea',
            },
            // Only used when the product has no variants; a variant carries
            // its own weight, since sizes differ.
            {
              ...weightField(),
              admin: {
                ...weightField().admin,
                condition: (data) => !data?.enableVariants,
              },
            },
          ],
          label: 'Specifications',
        },
      ],
    },
    slugField(),
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Surface this product on the homepage.',
        position: 'sidebar',
      },
    },
  ],
})
