import { Skeleton } from '@/components/Spinner'

/**
 * Placeholder for a product grid while the page loads.
 *
 * Mirrors the real listing's spacing and card proportions so the layout does
 * not jump when the products arrive.
 */
export function ListingSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 md:py-10">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-4 h-7 w-56 md:mt-6 md:h-10 md:w-72" />

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-8 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {Array.from({ length: cards }, (_, i) => (
          <div className="overflow-hidden rounded-lg border border-line" key={i}>
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-2.5 md:p-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-1.5 h-3 w-2/3" />
              <Skeleton className="mt-3 h-9 w-full md:h-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
