import { Skeleton } from '@/components/Spinner'

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-4 md:py-6">
      <Skeleton className="h-3 w-52" />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Skeleton className="aspect-square w-full" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton className="h-16 w-16" key={i} />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-7 w-3/4 md:h-8" />
          <Skeleton className="mt-3 h-5 w-24" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-8 h-9 w-40" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-3 h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
