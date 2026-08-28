import { Skeleton } from '@/components/Spinner'

/**
 * Placeholder for the cart while its items are being fetched.
 *
 * Mirrors the real two-column layout and row proportions, so the page does not
 * jump when the cart arrives.
 */
export function CartSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div>
          <div className="hidden grid-cols-[auto_88px_1fr_140px_150px_140px] gap-4 border-b border-line pb-3 md:grid">
            <span className="w-4" />
            <span />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16 justify-self-end" />
          </div>

          {Array.from({ length: rows }, (_, i) => (
            <div className="flex items-center gap-4 border-b border-line py-4" key={i}>
              <Skeleton className="h-16 w-16 shrink-0 md:h-[88px] md:w-[88px]" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-3/5" />
                <Skeleton className="mt-2 h-3 w-1/4" />
              </div>
              <Skeleton className="hidden h-8 w-28 md:block" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-line p-5 md:p-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-5 h-3.5 w-full" />
          <Skeleton className="mt-3 h-3.5 w-2/3" />
          <Skeleton className="mt-5 h-9 w-full" />
          <Skeleton className="mt-3 h-9 w-full" />
          <Skeleton className="mt-5 h-11 w-full" />
        </aside>
      </div>
    </div>
  )
}
