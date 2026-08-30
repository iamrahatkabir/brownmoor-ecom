import { Hero } from '@/components/Hero'
import { ProductSection } from '@/components/ProductSection'
import { TopCollections } from '@/components/TopCollections'
import { getHomePage, getProducts, toIds } from '@/lib/payload'
import type { Category } from '@/lib/types'

/**
 * Home page.
 *
 * Everything below the hero is admin-configured: the bands, their order, their
 * copy, which products sit in each, and where the button goes. Editing the
 * homepage is a content task, not a code change.
 */
export default async function HomePage() {
  const content = await getHomePage()
  const sections = content?.sections ?? []

  // Numbers survive here when a featured category has since been deleted; they
  // are dropped rather than rendered as an empty tile.
  const featured = (content?.topCollections ?? []).filter(
    (entry): entry is Category => typeof entry === 'object' && entry !== null,
  )

  // One request per band, issued together rather than in series — five
  // sequential fetches would stack their latency into the first paint.
  const resolved = await Promise.all(
    sections.map(async (section) => {
      const ids = toIds(section.products)

      return {
        section,
        products: ids ? await getProducts({ ids }) : [],
      }
    }),
  )

  return (
    <>
      <Hero content={content} />

      <TopCollections categories={featured} heading={content?.topCollectionsHeading} />

      {resolved.map(({ section, products }, index) => (
        <ProductSection
          eyebrow={section.eyebrow}
          heading={section.heading}
          intro={section.intro}
          key={section.id ?? index}
          // Only the first band sits above the fold, so only its images are
          // worth preloading.
          priority={index === 0}
          products={products}
          viewAllHref={section.viewAllUrl}
          viewAllLabel={section.viewAllLabel}
        />
      ))}
    </>
  )
}
