import { CategoryTile } from '@/components/CategoryTile'
import { mediaURL } from '@/lib/payload'
import type { Category } from '@/lib/types'

/**
 * Featured categories, shown as a grid of tiles below the hero.
 *
 * Which categories appear, and in what order, is set on the Home Page global.
 * The picture comes from the category itself rather than being chosen again
 * here, so the same image is used wherever a category is shown and there is one
 * place to change it.
 */
export function TopCollections({
  categories,
  heading,
}: {
  categories: Category[]
  heading?: null | string
}) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-16">
      {heading && (
        <h2 className="text-center text-xl font-semibold tracking-tight text-ink md:text-3xl">
          {heading}
        </h2>
      )}

      {/*
       * Three across on a phone, up to seven on a wide screen. Tiles are small
       * and uniform, so more of them fit per row than a product grid — the point
       * is to show the breadth of the range at a glance.
       *
       * Flex rather than grid so a short row centres. A grid would hold seven
       * columns open regardless, leaving four categories hard against the left
       * edge with a stretch of empty space beside them. The widths below are the
       * grid's columns worked out by hand: the row's gaps subtracted, divided by
       * the number of tiles that should fit.
       */}
      <ul
        className={`flex flex-wrap justify-center gap-x-3 gap-y-6 lg:gap-x-4 ${
          heading ? 'mt-6 md:mt-10' : ''
        }`}
      >
        {categories.map((category) => (
          <li
            className="basis-[calc((100%-1.5rem)/3)] sm:basis-[calc((100%-2.25rem)/4)] md:basis-[calc((100%-3rem)/5)] lg:basis-[calc((100%-6rem)/7)]"
            key={category.id}
          >
            <CategoryTile
              href={`/category/${category.slug}`}
              src={mediaURL(category.image, 'card')}
              title={category.title}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
