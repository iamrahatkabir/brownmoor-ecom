import { Hero } from '@/components/Hero'
import { ProductSection } from '@/components/ProductSection'
import { getCategoryTree, getHomePage, getProducts } from '@/lib/payload'

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
  const [content, categories, featured] = await Promise.all([
    getHomePage(),
    getCategoryTree(),
    getProducts({ featured: true, limit: 8 }),
  ])

  const categoryProducts = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await getProducts({ categorySlug: category.slug, limit: 4 }),
    })),
  )

  return (
    <>
      <Hero content={content} />

      <ProductSection
        eyebrow="Handpicked"
        heading={content?.featuredHeading || 'Featured Products'}
        intro={
          content?.featuredIntro ||
          'A short edit of the pieces we reach for most — chosen for how they perform after a hundred meals, not the first one.'
        }
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
