import type { Payload } from 'payload'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import { CATEGORIES, HOME_PAGE, imageName, PRODUCTS, VARIANT_TYPES } from './data'

/**
 * Installs the demo catalogue defined in ./data.ts.
 *
 * Safe to re-run: every record is looked up by a stable identifier first and
 * skipped if present, so this never duplicates. Remove everything it made with
 * `npm run seed:clear`.
 *
 *   npm run seed
 */

const taka = (amount: number): number => Math.round(amount * 100)

const placeholder = async (
  label: string,
  background: string,
  width: number,
  height: number,
): Promise<Buffer> => {
  const escaped = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const fontSize = Math.round(width / 22)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="${background}"/>
      <text x="${width / 2}" y="${height / 2 + fontSize / 3}" font-family="Georgia, serif"
            font-size="${fontSize}" fill="#ffffff" fill-opacity="0.82"
            text-anchor="middle">${escaped}</text>
    </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}

const uploadImage = async (
  payload: Payload,
  slug: string,
  label: string,
  colour: string,
  width = 1200,
  height = 1200,
) => {
  const data = await placeholder(label, colour, width, height)

  return payload.create({
    collection: 'media',
    data: { alt: label },
    file: { data, mimetype: 'image/png', name: imageName(slug), size: data.length },
  })
}

const findOne = async (
  payload: Payload,
  collection: 'categories' | 'products' | 'variantOptions' | 'variantTypes',
  where: Record<string, unknown>,
) => {
  const { docs } = await payload.find({ collection, depth: 0, limit: 1, where: where as never })
  return docs[0]
}

const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Installing Brownmoor demo data…')

  // ---------------------------------------------------------------- categories
  const categoryIds: Record<string, number> = {}

  // Parents first, so a child always has something to point at.
  for (const spec of [...CATEGORIES].sort((a, b) => Number(!!a.parent) - Number(!!b.parent))) {
    const existing = await findOne(payload, 'categories', { slug: { equals: spec.slug } })

    if (existing) {
      categoryIds[spec.slug] = existing.id as number
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: {
        slug: spec.slug,
        title: spec.title,
        ...(spec.parent ? { parent: categoryIds[spec.parent] } : {}),
      },
    })

    categoryIds[spec.slug] = created.id
  }

  payload.logger.info(`  categories: ${Object.keys(categoryIds).length}`)

  // ------------------------------------------------------------- variant types
  const optionIds: Record<string, Record<string, number>> = {}
  const typeIds: Record<string, number> = {}

  for (const type of VARIANT_TYPES) {
    let variantType = await findOne(payload, 'variantTypes', { name: { equals: type.name } })

    if (!variantType) {
      variantType = await payload.create({
        collection: 'variantTypes',
        data: { label: type.label, name: type.name },
      })
    }

    typeIds[type.name] = variantType.id as number
    optionIds[type.name] = {}

    for (const value of type.options) {
      let option = await findOne(payload, 'variantOptions', {
        and: [{ value: { equals: value } }, { variantType: { equals: variantType.id } }],
      })

      if (!option) {
        option = await payload.create({
          collection: 'variantOptions',
          data: { label: value, value, variantType: variantType.id as number },
        })
      }

      optionIds[type.name][value] = option.id as number
    }
  }

  payload.logger.info(`  variant types: ${VARIANT_TYPES.length}`)

  // ------------------------------------------------------------------ products
  let created = 0

  for (const spec of PRODUCTS) {
    if (await findOne(payload, 'products', { slug: { equals: spec.slug } })) {
      continue
    }

    const image = await uploadImage(payload, spec.slug, spec.title, spec.colour)
    const hasVariants = Boolean(spec.variants?.length && spec.variantType)

    const product = await payload.create({
      collection: 'products',
      data: {
        _status: 'published',
        ...(spec.care ? { careInstructions: spec.care } : {}),
        categories: spec.categories.map((slug) => categoryIds[slug]).filter(Boolean),
        featured: Boolean(spec.featured),
        gallery: [{ image: image.id }],
        shortDescription: spec.shortDescription,
        slug: spec.slug,
        specifications: spec.specs,
        title: spec.title,
        ...(hasVariants
          ? { enableVariants: true, variantTypes: [typeIds[spec.variantType!]] }
          : {
              inventory: spec.stock ?? 0,
              priceInBDT: taka(spec.price ?? 0),
              priceInBDTEnabled: true,
              ...(spec.compareAt ? { compareAtPriceInBDT: taka(spec.compareAt) } : {}),
            }),
      },
    })

    if (hasVariants) {
      for (const variant of spec.variants!) {
        await payload.create({
          collection: 'variants',
          data: {
            _status: 'published',
            inventory: variant.stock,
            options: [optionIds[spec.variantType!][variant.option]],
            priceInBDT: taka(variant.price),
            priceInBDTEnabled: true,
            product: product.id,
            title: `${spec.title} — ${variant.option}`,
            ...(variant.compareAt ? { compareAtPriceInBDT: taka(variant.compareAt) } : {}),
          },
        })
      }
    }

    created += 1
    payload.logger.info(`  product: ${spec.title}`)
  }

  payload.logger.info(`  products created: ${created} (${PRODUCTS.length - created} already present)`)

  // ----------------------------------------------------------------- home page
  const home = await payload.findGlobal({ slug: 'home-page' })

  if (!home?.image) {
    const banner = await uploadImage(
      payload,
      'hero-banner',
      'Brownmoor',
      HOME_PAGE.heroColour,
      2400,
      1000,
    )

    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        ctaLabel: HOME_PAGE.ctaLabel,
        ctaLink: HOME_PAGE.ctaLink,
        featuredHeading: HOME_PAGE.featuredHeading,
        featuredIntro: HOME_PAGE.featuredIntro,
        heading: HOME_PAGE.heading,
        image: banner.id,
        subheading: HOME_PAGE.subheading,
      },
    })

    payload.logger.info('  home page: hero banner set')
  }

  payload.logger.info('Demo data installed. Remove it with: npm run seed:clear')
}

const payload = await getPayload({ config })
await seed(payload)
process.exit(0)
