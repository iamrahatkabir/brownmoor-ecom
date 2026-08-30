'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Link } from '@/components/Link'
import { Skeleton } from '@/components/Spinner'

/**
 * One tile in the Top Collections grid.
 *
 * A client component only so it can tell when its image has arrived. Until then
 * the frame holds a pulsing placeholder rather than a flat grey square, which
 * reads as loading rather than as a category with no picture — a distinction
 * that matters here, because some categories genuinely have no image and show a
 * static "No image" instead.
 */
export function CategoryTile({
  href,
  src,
  title,
}: {
  href: string
  src: null | string
  title: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link className="group block text-center" href={href}>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-wash transition-colors group-hover:border-ink">
        {src ? (
          <>
            <Image
              alt={title}
              className={`object-cover transition-[transform,opacity] duration-300 group-hover:scale-[1.04] ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              fill
              onLoad={() => setLoaded(true)}
              // Small tiles, many per row — asking for a full-width image here
              // would download far more than is drawn.
              sizes="(min-width: 1024px) 170px, (min-width: 640px) 22vw, 30vw"
              src={src}
            />

            {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
          </>
        ) : (
          <span className="flex h-full items-center justify-center px-2 text-center text-[11px] text-faint">
            No image
          </span>
        )}
      </div>

      <span className="mt-2 block text-[13px] leading-snug text-ink group-hover:underline md:mt-3 md:text-sm">
        {title}
      </span>
    </Link>
  )
}
