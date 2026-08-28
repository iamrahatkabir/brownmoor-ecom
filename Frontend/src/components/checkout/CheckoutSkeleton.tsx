import { Skeleton } from '@/components/Spinner'

/**
 * Placeholder for checkout while the cart is being fetched.
 *
 * The billing form is static, but the order summary depends on the cart, and
 * rendering half a page reads as broken — so both columns wait together.
 */
export function CheckoutSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-14">
        <section>
          <Skeleton className="h-6 w-44 md:h-8" />

          <div className="mt-6 space-y-4">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1.5 h-11 w-full" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[0, 1].map((i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-1.5 h-11 w-full" />
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-1.5 h-24 w-full" />
            </div>

            <div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-1.5 h-20 w-full" />
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg bg-wash p-5 md:p-7">
          <Skeleton className="mx-auto h-6 w-32" />

          <div className="mt-5 rounded-lg bg-paper p-4 md:p-5">
            {Array.from({ length: rows }, (_, i) => (
              <div className="flex items-start gap-3 border-b border-line py-4" key={i}>
                <Skeleton className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3.5 w-4/5" />
                  <Skeleton className="mt-2 h-8 w-28" />
                </div>
                <Skeleton className="h-3.5 w-14" />
              </div>
            ))}

            <Skeleton className="mt-4 h-3.5 w-full" />
            <Skeleton className="mt-3 h-3.5 w-3/4" />
            <Skeleton className="mt-4 h-6 w-1/2" />
          </div>

          <Skeleton className="mt-5 h-12 w-full" />
        </aside>
      </div>
    </div>
  )
}
