'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Spinner } from '@/components/Spinner'
import { mediaURL } from '@/lib/payload'
import type { Media } from '@/lib/types'

/**
 * Main image with a thumbnail strip.
 *
 * Every image is rendered into the frame at once and switching only changes
 * which one is opaque. Swapping a single `src` instead made each thumbnail a
 * fresh trip through the image optimiser — fetch from storage, resize, encode —
 * and the frame sat empty for seconds the first time a shopper opened a photo.
 * Stacking costs the extra images up front and makes every switch after that
 * instant, which is the right trade for a gallery of a handful of photos.
 *
 * The spinner covers the one case stacking cannot: an image tapped before it
 * has finished downloading. Once loaded, an image is never fetched again.
 */
export function Gallery({ images, title }: { images: Media[]; title: string }) {
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  const sources = images.map((image) => mediaURL(image, 'feature'))
  const hasImages = sources.some(Boolean)

  const markLoaded = (index: number) =>
    setLoaded((previous) => (previous[index] ? previous : { ...previous, [index]: true }))

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-wash">
        {hasImages ? (
          <>
            {images.map((image, index) => {
              const src = sources[index]

              if (!src) {
                return null
              }

              const isActive = index === active

              return (
                <Image
                  alt={image.alt || title}
                  // Hidden rather than unmounted, so the browser keeps the
                  // decoded image and the next switch costs nothing.
                  aria-hidden={!isActive}
                  className={`object-cover transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  fill
                  key={image.id ?? index}
                  onLoad={() => markLoaded(index)}
                  // Only the first is above the fold on arrival; the rest load
                  // normally rather than competing with it.
                  priority={index === 0}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  src={src}
                />
              )
            })}

            {!loaded[active] && (
              <div className="absolute inset-0 flex items-center justify-center bg-wash">
                <Spinner className="h-6 w-6 text-muted" />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-faint">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const thumb = mediaURL(image, 'thumbnail')

            return (
              <button
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === active}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-wash transition-colors ${
                  index === active ? 'border-ink' : 'border-line hover:border-muted'
                }`}
                key={image.id ?? index}
                onClick={() => setActive(index)}
                type="button"
              >
                {thumb && <Image alt="" className="object-cover" fill sizes="64px" src={thumb} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
