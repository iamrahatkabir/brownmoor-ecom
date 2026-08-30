import Image from 'next/image'

import { HeroSlider, type Slide } from '@/components/HeroSlider'
import { Link } from '@/components/Link'
import { mediaURL } from '@/lib/payload'
import type { HomePageGlobal } from '@/lib/types'

/**
 * The top of the homepage.
 *
 * Slides win when any are set: those are finished artwork, each with its own
 * destination, and the wording lives in the image. The older single banner —
 * one image with a heading, subheading and button laid over it — stays as the
 * fallback, so the page still has something above the fold while the slider is
 * being filled in.
 *
 * Every part of the fallback is optional. With no image at all it becomes a
 * flat ink panel rather than a broken frame, so the page still looks
 * deliberate before anyone has uploaded artwork.
 */
export function Hero({ content }: { content: HomePageGlobal | null }) {
  const slides: Slide[] = (content?.heroSlides ?? []).flatMap((slide) => {
    const src = mediaURL(slide.image, 'feature')

    // A slide with no resolvable image would be a blank frame the shopper can
    // still page onto, so it is dropped rather than rendered empty.
    return src
      ? [
          {
            alt: slide.alt || content?.heading || 'Brownmoor.com',
            href: slide.link?.trim() || null,
            src,
          },
        ]
      : []
  })

  if (slides.length > 0) {
    return <HeroSlider autoplaySeconds={content?.heroAutoplaySeconds} slides={slides} />
  }

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
            alt={heading || 'Brownmoor.com'}
            className="object-cover"
            fill
            // Above the fold, so it should not wait for lazy loading.
            priority
            sizes="100vw"
            src={src}
          />
        )}

        {/* Only darken the image when there is text that needs to stay legible.
            The direction has to change with the layout: on a phone the text
            spans the full width, so a left-to-right gradient leaves its right
            half over bare image. Small screens get a bottom-up scrim; from md
            the text sits in the left third and the horizontal gradient works. */}
        {src && hasText && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/60 to-ink/30 md:bg-gradient-to-r md:from-ink/75 md:via-ink/40 md:to-transparent"
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
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-paper px-8 text-[11px] tracked text-ink transition-colors hover:bg-line"
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
