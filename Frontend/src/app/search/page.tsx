import type { Metadata } from 'next'

import { ProductListing } from '@/components/ProductListing'
import { searchProductsPage } from '@/lib/search'

export const metadata: Metadata = {
  // Google's own guidance is to keep internal search results out of the
  // index — they compete with the category pages that should rank instead.
  robots: { follow: true, index: false },
  title: 'Search',
}

const toPage = (value: string | undefined): number => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageParam, q } = await searchParams
  const term = (q ?? '').trim()
  const page = toPage(pageParam)

  const { products, totalDocs, totalPages } = term
    ? await searchProductsPage(term, 20, page)
    : { products: [], totalDocs: 0, totalPages: 1 }

  return (
    <ProductListing
      basePath={`/search?q=${encodeURIComponent(term)}`}
      crumb="Search"
      page={page}
      products={products}
      title={term ? `Results for “${term}”` : 'Search'}
      totalDocs={totalDocs}
      totalPages={totalPages}
    />
  )
}
