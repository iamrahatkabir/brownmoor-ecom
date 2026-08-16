import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ProductListing } from '@/components/ProductListing'
import { getCategoryBySlug, getProductsPage } from '@/lib/payload'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/** `?page=` arrives as a string and may be anything; clamp it to a real page. */
const toPage = (value: string | undefined): number => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  return { title: category?.title ?? 'Category' }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = toPage(pageParam)

  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { products, totalDocs, totalPages } = await getProductsPage({
    categorySlug: slug,
    page,
  })

  return (
    <ProductListing
      basePath={`/category/${slug}`}
      crumb={category.title}
      page={page}
      products={products}
      title={category.title}
      totalDocs={totalDocs}
      totalPages={totalPages}
    />
  )
}
