import type { Payload } from 'payload'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from './payload.config'

/**
 * Development seed data.
 *
 * Safe to re-run: everything is keyed on a stable identifier (category slug,
 * variant type name, product slug) and skipped if already present. Nothing is
 * ever deleted.
 *
 *   npm run seed
 */

/** Prices are stored in the minor unit. ৳2,450.00 is 245000 poisha. */
const taka = (amount: number): number => Math.round(amount * 100)

/**
 * Placeholder photography, generated rather than downloaded so the seed has no
 * network dependency. Swap for real product shots in the admin panel.
 */
const placeholderImage = async (label: string, background: string): Promise<Buffer> => {
  const escaped = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
      <rect width="1200" height="1200" fill="${background}"/>
      <text x="600" y="620" font-family="Georgia, serif" font-size="64"
            fill="#ffffff" text-anchor="middle">${escaped}</text>
    </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}

const uploadImage = async (payload: Payload, label: string, background: string) => {
  const data = await placeholderImage(label, background)

  return payload.create({
    collection: 'media',
    data: { alt: label },
    file: {
      name: `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      data,
      mimetype: 'image/png',
      size: data.length,
    },
  })
}

const findBy = async (
  payload: Payload,
  collection: 'categories' | 'products' | 'variantTypes' | 'variantOptions',
  where: Record<string, unknown>,
) => {
  const { docs } = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    where: where as never,
  })

  return docs[0]
}

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding Brownmoor development data…')

  // ---------------------------------------------------------------- categories
  const categorySpec = [
    { title: 'Cookware', slug: 'cookware', parent: null },
    { title: 'Saucepans', slug: 'saucepans', parent: 'cookware' },
    { title: 'Frying Pans', slug: 'frying-pans', parent: 'cookware' },
    { title: 'Cutlery', slug: 'cutlery', parent: null },
    { title: 'Bakeware', slug: 'bakeware', parent: null },
  ]

  const categories: Record<string, number> = {}

  // Parents first, so a child always has something to point at.
  for (const spec of [...categorySpec].sort((a, b) => Number(!!a.parent) - Number(!!b.parent))) {
    const existing = await findBy(payload, 'categories', { slug: { equals: spec.slug } })

    if (existing) {
      categories[spec.slug] = existing.id as number
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: {
        title: spec.title,
        slug: spec.slug,
        ...(spec.parent ? { parent: categories[spec.parent] } : {}),
      },
    })

    categories[spec.slug] = created.id
    payload.logger.info(`  category: ${spec.title}`)
  }

  // ------------------------------------------------------------- variant types
  let sizeType = await findBy(payload, 'variantTypes', { name: { equals: 'size' } })

  if (!sizeType) {
    sizeType = await payload.create({
      collection: 'variantTypes',
      data: { name: 'size', label: 'Size' },
    })
    payload.logger.info('  variant type: Size')
  }

  const sizeSpec = [
    { label: '16cm', value: '16cm' },
    { label: '20cm', value: '20cm' },
    { label: '24cm', value: '24cm' },
  ]

  const sizes: Record<string, number> = {}

  for (const spec of sizeSpec) {
    let option = await findBy(payload, 'variantOptions', {
      and: [{ value: { equals: spec.value } }, { variantType: { equals: sizeType.id } }],
    })

    if (!option) {
      option = await payload.create({
        collection: 'variantOptions',
        data: { label: spec.label, value: spec.value, variantType: sizeType.id as number },
      })
      payload.logger.info(`  size option: ${spec.label}`)
    }

    sizes[spec.value] = option.id as number
  }

  // ------------------------------------------------------------------ products
  const existingSaucepan = await findBy(payload, 'products', {
    slug: { equals: 'tri-ply-stainless-steel-saucepan' },
  })

  if (!existingSaucepan) {
    const image = await uploadImage(payload, 'Tri-Ply Saucepan', '#3f4b3b')

    const saucepan = await payload.create({
      collection: 'products',
      data: {
        title: 'Tri-Ply Stainless Steel Saucepan',
        slug: 'tri-ply-stainless-steel-saucepan',
        shortDescription:
          'Three bonded layers for even heat, with a cool-touch handle and a pouring rim.',
        gallery: [{ image: image.id }],
        categories: [categories.cookware, categories.saucepans],
        featured: true,
        // Price and stock live on each variant, so nothing is set here.
        enableVariants: true,
        variantTypes: [sizeType.id as number],
        specifications: [
          { label: 'Material', value: 'Tri-ply stainless steel' },
          { label: 'Induction safe', value: 'Yes' },
          { label: 'Dishwasher safe', value: 'Yes' },
        ],
        careInstructions: 'Dishwasher safe, though hand washing keeps the exterior brighter.',
        _status: 'published',
      },
    })

    const variantSpec = [
      { size: '16cm', price: 2450, stock: 24 },
      { size: '20cm', price: 3100, stock: 18 },
      { size: '24cm', price: 3850, stock: 11 },
    ]

    for (const spec of variantSpec) {
      await payload.create({
        collection: 'variants',
        data: {
          title: `Tri-Ply Saucepan — ${spec.size}`,
          product: saucepan.id,
          options: [sizes[spec.size]],
          inventory: spec.stock,
          priceInBDTEnabled: true,
          priceInBDT: taka(spec.price),
          _status: 'published',
        },
      })
      payload.logger.info(`  variant: saucepan ${spec.size} — ৳${spec.price}`)
    }

    payload.logger.info('  product: Tri-Ply Stainless Steel Saucepan (3 variants)')
  }

  // A deliberately simple product: one price, one stock count, no variants.
  const simpleSpec = [
    {
      title: 'Acacia Wood Chopping Board',
      slug: 'acacia-wood-chopping-board',
      shortDescription: 'End-grain acacia that stays kind to knife edges.',
      category: 'cutlery',
      colour: '#6b4f2a',
      price: 1850,
      stock: 40,
      specs: [
        { label: 'Material', value: 'Solid acacia' },
        { label: 'Dimensions', value: '38 × 25 × 3 cm' },
      ],
    },
    {
      title: 'Carbon Steel Loaf Tin',
      slug: 'carbon-steel-loaf-tin',
      shortDescription: 'Non-stick carbon steel with a rolled edge that resists warping.',
      category: 'bakeware',
      colour: '#4a4a52',
      price: 1250,
      stock: 33,
      specs: [
        { label: 'Material', value: 'Carbon steel' },
        { label: 'Capacity', value: '900 g loaf' },
      ],
    },
  ]

  for (const spec of simpleSpec) {
    if (await findBy(payload, 'products', { slug: { equals: spec.slug } })) {
      continue
    }

    const image = await uploadImage(payload, spec.title, spec.colour)

    await payload.create({
      collection: 'products',
      data: {
        title: spec.title,
        slug: spec.slug,
        shortDescription: spec.shortDescription,
        gallery: [{ image: image.id }],
        categories: [categories[spec.category]],
        inventory: spec.stock,
        priceInBDTEnabled: true,
        priceInBDT: taka(spec.price),
        specifications: spec.specs,
        _status: 'published',
      },
    })

    payload.logger.info(`  product: ${spec.title} — ৳${spec.price}`)
  }

  payload.logger.info('Seed complete.')
}

const payload = await getPayload({ config })

await seed(payload)

process.exit(0)
