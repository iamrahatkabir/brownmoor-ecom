import { Hero } from '@/components/Hero'
import { ProductSection } from '@/components/ProductSection'
import { getCategoryTree, getHomePage, getProducts, toIds } from '@/lib/payload'

/**
 * Home page.
 *
 * Structure follows the reference layout: hero, a featured band, then one band
 * per top-level category. The category bands are generated from live data, so
 * the page grows as the catalogue does without anyone editing this file.
 */
export default async function HomePage() {
  // Independent requests, so they run concurrently rather than in series —
  // waterfalling these would add up to the slowest possible first paint.
  const [content, categories] = await Promise.all([getHomePage(), getCategoryTree()])

  // Two ways to fill the featured band. A hand-picked list in the admin wins,
  // in the order it was arranged there; with nothing picked we fall back to
  // whichever products are ticked "Featured" on their own page.
  const pickedIds = toIds(content?.featuredProducts)

  const [featured, categoryProducts] = await Promise.all([
    pickedIds ? getProducts({ ids: pickedIds }) : getProducts({ featured: true, limit: 8 }),
    Promise.all(
      categories.map(async (category) => ({
        category,
        products: await getProducts({ categorySlug: category.slug, limit: 4 }),
      })),
    ),
  ])

  return (
    <>
      <Hero content={content} />

      <ProductSection
        eyebrow={content?.featuredEyebrow || undefined}
        heading={content?.featuredHeading || 'Featured Products'}
        intro={content?.featuredIntro}
        priority
        products={featured}
        viewAllHref="/shop"
      />

      {categoryProducts.map(({ category, products }) => (
        <ProductSection
          heading={category.title}
          intro={category.description}
          key={category.id}
          products={products}
          viewAllHref={`/category/${category.slug}`}
        />
      ))}
    </>
  )
}
