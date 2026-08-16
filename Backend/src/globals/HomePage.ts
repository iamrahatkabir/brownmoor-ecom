import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access'

/**
 * Editable homepage content.
 *
 * A global rather than a collection because there is exactly one homepage —
 * staff edit this record in place, and the storefront reads it at
 * `/api/globals/home-page`. Changing the hero needs no deploy.
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
      type: 'collapsible',
      fields: [
        {
          name: 'featuredHeading',
          type: 'text',
          defaultValue: 'Featured Products',
        },
        {
          name: 'featuredIntro',
          type: 'textarea',
          admin: {
            description: 'Short paragraph under the section heading.',
          },
          maxLength: 300,
        },
      ],
      label: 'Featured section',
    },
  ],
  label: 'Home Page',
}
