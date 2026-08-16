import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/ProductCard'
import { Gallery } from '@/components/product/Gallery'
import { ProductBuyBox } from '@/components/product/ProductBuyBox'
import { ProductTabs } from '@/components/product/ProductTabs'
import { getProductBySlug, getRelatedProducts } from '@/lib/payload'
import type { Category, Media, Product } from '@/lib/types'

type Params = { params: Promise<{ slug: string }> }

const galleryImages = (product: Product): Media[] =>
  (product.gallery ?? [])
    .map((entry) => entry.image)
    .filter((image): image is Media => typeof image !== 'number')

const primaryCategory = (product: Product): Category | undefined =>
  product.categories?.find((c): c is Category => typeof c !== 'number')

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Not found' }
  }

  return {
    description: product.shortDescription ?? undefined,
    title: product.title,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product)
  const category = primaryCategory(product)
  const images = galleryImages(product)
  const specs = (product.specifications ?? []).slice(0, 2)

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-4 md:py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-faint">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link className="hover:text-ink" href="/">
                Home
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">›</li>
                <li>
                  <Link className="hover:text-ink" href={`/category/${category.slug}`}>
                    {category.title}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">›</li>
            <li className="text-muted">{product.title}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery images={images} title={product.title} />

          <div>
            <h1 className="text-xl font-semibold leading-snug md:text-2xl">{product.title}</h1>

            {category && (
              <p className="mt-2 inline-block bg-wash px-2 py-1 text-[11px] text-muted">
                {category.title}
              </p>
            )}

            {product.shortDescription && (
              <p className="mt-4 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
            )}

            {/* The two specs a buyer compares first, lifted out of the tab so
                they are visible without scrolling. */}
            {specs.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 border border-line">
                {specs.map((spec, index) => (
                  <div
                    className={`p-4 ${index === 0 && specs.length > 1 ? 'border-r border-line' : ''}`}
                    key={spec.id ?? index}
                  >
                    <dt className="text-[11px] text-faint">{spec.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ProductBuyBox product={product} />

            <ul className="mt-6 space-y-2 border border-line bg-wash p-4 text-xs text-muted">
              <li>Cash on delivery available across Bangladesh.</li>
              <li>Delivery inside Dhaka ৳80, outside Dhaka ৳150.</li>
              <li>Questions? Message us on WhatsApp before you order.</li>
            </ul>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
            <h2 className="text-lg font-semibold md:text-xl">Related Products</h2>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clears the fixed mobile bar so it never covers the footer. */}
      <div aria-hidden="true" className="h-20 md:hidden" />
    </>
  )
}
