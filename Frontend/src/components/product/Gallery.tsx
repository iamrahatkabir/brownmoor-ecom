'use client'

import Image from 'next/image'
import { useState } from 'react'

import { mediaURL } from '@/lib/payload'
import type { Media } from '@/lib/types'

/**
 * Main image with a thumbnail strip. Client-side because picking a thumbnail
 * swaps the main image without a round trip.
 */
export function Gallery({ images, title }: { images: Media[]; title: string }) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]
  const src = mediaURL(current, 'feature')

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-line bg-wash">
        {src ? (
          <Image
            alt={current?.alt || title}
            className="object-cover"
            fill
            // Above the fold on the product page, so it should not lazy-load.
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            src={src}
          />
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
                className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-wash transition-colors ${
                  index === active ? 'border-ink' : 'border-line hover:border-muted'
                }`}
                key={image.id ?? index}
                onClick={() => setActive(index)}
                type="button"
              >
                {thumb && (
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={thumb}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
