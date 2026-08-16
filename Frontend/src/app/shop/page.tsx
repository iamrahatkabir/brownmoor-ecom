import type { Metadata } from 'next'

import { ProductListing } from '@/components/ProductListing'
import { getProductsPage } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'All collections',
}

const toPage = (value: string | undefined): number => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = toPage(pageParam)

  const { products, totalDocs, totalPages } = await getProductsPage({ page })

  return (
    <ProductListing
      basePath="/shop"
      crumb="All collections"
      page={page}
      products={products}
      title="All Collections"
      totalDocs={totalDocs}
      totalPages={totalPages}
    />
  )
}
