import Image from 'next/image'
import Link from 'next/link'

import { mediaURL } from '@/lib/payload'
import type { HomePageGlobal } from '@/lib/types'

/**
 * Single full-width banner, editable from the admin panel via the `home-page`
 * global — image, heading, subheading and CTA all come from there.
 *
 * Every part is optional. With no image it falls back to a flat ink panel
 * rather than a broken frame, so the page still looks deliberate before anyone
 * has uploaded artwork.
 */
export function Hero({ content }: { content: HomePageGlobal | null }) {
  const src = mediaURL(content?.image, 'feature')
  const heading = content?.heading
  const subheading = content?.subheading
  const hasCTA = Boolean(content?.ctaLabel && content?.ctaLink)
  const hasText = Boolean(heading || subheading || hasCTA)

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {src && (
          <Image
            alt={heading || 'Brownmoor'}
            className="object-cover"
            fill
            // Above the fold, so it should not wait for lazy loading.
            priority
            sizes="100vw"
            src={src}
          />
        )}

        {/* Only darken the image when there is text that needs to stay legible. */}
        {src && hasText && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-transparent"
          />
        )}

        {hasText && (
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1280px] px-4">
              <div className="max-w-xl text-paper">
                {heading && (
                  <h1 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                    {heading}
                  </h1>
                )}

                {subheading && (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/80 sm:text-base">
                    {subheading}
                  </p>
                )}

                {hasCTA && (
                  <Link
                    className="mt-6 inline-flex h-11 items-center justify-center bg-paper px-8 text-[11px] tracked text-ink transition-colors hover:bg-line"
                    href={content!.ctaLink!}
                  >
                    {content!.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
