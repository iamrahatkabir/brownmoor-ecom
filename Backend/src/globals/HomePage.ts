import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access'

/** A homepage band can hold at most this many products before it stops being an edit. */
const MAX_PRODUCTS_PER_SECTION = 8

/** How many bands the homepage supports below the hero. */
const MAX_SECTIONS = 5

/**
 * Editable homepage content.
 *
 * A global rather than a collection because there is exactly one homepage —
 * staff edit this record in place, and the storefront reads it at
 * `/api/globals/home-page`. Changing the hero or the product bands needs no
 * deploy.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    // Public: the storefront fetches this unauthenticated on every render.
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Storefront',
  },
  fields: [
    {
      type: 'collapsible',
      fields: [
        {
          name: 'image',
          type: 'upload',
          admin: {
            description:
              'Full-width banner. Landscape works best — around 2400×1000 for a crisp result on large screens.',
          },
          relationTo: 'media',
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Optional. Overlaid on the banner.',
          },
        },
        {
          name: 'subheading',
          type: 'textarea',
          maxLength: 200,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              admin: {
                description: 'e.g. "Shop cookware". Leave empty to hide the button.',
                width: '50%',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              admin: {
                description: 'e.g. /category/cookware',
                width: '50%',
              },
            },
          ],
        },
      ],
      label: 'Hero banner',
    },
    {
      name: 'sections',
      type: 'array',
      admin: {
        description: `Product bands shown below the hero, in this order. Up to ${MAX_SECTIONS}. Drag to rearrange; delete one to remove it from the homepage.`,
        initCollapsed: true,
        // Without this every row reads "Section 01" in the collapsed list,
        // which makes reordering five of them guesswork.
        components: {
          RowLabel: '@/globals/SectionRowLabel#SectionRowLabel',
        },
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small label above the heading. Leave empty to hide it.',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'intro',
          type: 'textarea',
          admin: {
            description: 'Short paragraph under the heading. Optional.',
          },
          maxLength: 300,
        },
        {
          name: 'products',
          type: 'relationship',
          admin: {
            description: `Pick up to ${MAX_PRODUCTS_PER_SECTION} products and drag to reorder. The band is hidden if this is empty.`,
          },
          filterOptions: () => ({
            // A draft product would 404 for shoppers, so it should not be
            // offered as something to put on the homepage.
            _status: { equals: 'published' },
          }),
          hasMany: true,
          maxRows: MAX_PRODUCTS_PER_SECTION,
          relationTo: 'products',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'viewAllLabel',
              type: 'text',
              admin: {
                description: 'Button text. Leave empty to hide the button.',
                width: '50%',
              },
              defaultValue: 'View all',
            },
            {
              name: 'viewAllUrl',
              type: 'text',
              admin: {
                description: 'Where the button goes, e.g. /category/cookware',
                width: '50%',
              },
            },
          ],
        },
      ],
      label: 'Product sections',
      maxRows: MAX_SECTIONS,
    },
  ],
  label: 'Home Page',
}
