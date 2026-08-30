'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type Slide = { alt: string; href: null | string; src: string }

/** How far the pointer must travel before it counts as a drag rather than a tap. */
const SWIPE_THRESHOLD_PX = 45

/**
 * The homepage banner carousel.
 *
 * Slides are stacked and cross-faded rather than slid along a track. A track
 * has to be measured and re-measured as the viewport changes; opacity does not,
 * and the frame here is a fixed aspect ratio anyway.
 *
 * Moved by swiping, by the dots, or on its own. There are no arrow buttons —
 * on a phone they sit over the artwork, and swiping is what people reach for
 * anyway.
 */
export function HeroSlider({
  autoplaySeconds,
  slides,
}: {
  /** Seconds per slide. 0 or undefined leaves the banner still. */
  autoplaySeconds?: null | number
  slides: Slide[]
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = useCallback(
    (next: number) => {
      // Wraps both ways, so a swipe at either end still moves.
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  /**
   * Autoplay.
   *
   * Restarts whenever the index changes, so a swipe gets a full interval rather
   * than whatever was left of the previous one — otherwise a slide the shopper
   * just chose can vanish almost immediately.
   *
   * Anyone who has asked their system to reduce motion gets a still banner: a
   * carousel that advances by itself is exactly what that setting is for.
   */
  useEffect(() => {
    const seconds = autoplaySeconds ?? 0

    if (count < 2 || seconds <= 0 || paused) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), seconds * 1000)

    return () => window.clearInterval(timer)
  }, [autoplaySeconds, count, index, paused])

  /**
   * Dragging, by mouse or finger.
   *
   * Pointer events rather than touch events, so a mouse drag on a desktop and a
   * swipe on a phone travel the same path instead of being written twice.
   *
   * The images carry `draggable={false}` for this to work at all: without it the
   * browser starts its own image drag as soon as the cursor moves, and the
   * gesture never reaches this code.
   */
  const dragStartX = useRef<null | number>(null)
  const dragged = useRef(false)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (event: React.PointerEvent) => {
    dragStartX.current = event.clientX
    dragged.current = false
    setDragging(true)
    // Hold the banner still while it is being handled.
    setPaused(true)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragStartX.current === null) {
      return
    }

    if (Math.abs(event.clientX - dragStartX.current) >= SWIPE_THRESHOLD_PX) {
      dragged.current = true
    }
  }

  const endDrag = (event: React.PointerEvent) => {
    const start = dragStartX.current

    dragStartX.current = null
    setDragging(false)
    setPaused(false)

    if (start === null) {
      return
    }

    const travelled = event.clientX - start

    if (Math.abs(travelled) < SWIPE_THRESHOLD_PX) {
      return
    }

    // Dragging left reveals what is to the right, as a sheet of paper would.
    go(travelled < 0 ? index + 1 : index - 1)
  }

  /**
   * A drag that ends on a linked slide would otherwise also count as a click and
   * navigate away. Captured on the way down so the anchor never sees it.
   */
  const onClickCapture = (event: React.MouseEvent) => {
    if (dragged.current) {
      event.preventDefault()
      event.stopPropagation()
      dragged.current = false
    }
  }

  const regionRef = useRef<HTMLDivElement>(null)

  // Arrow keys move the slider only while it has focus, so they still scroll
  // the page everywhere else.
  useEffect(() => {
    const node = regionRef.current

    if (!node || count < 2) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        go(index - 1)
      }

      if (event.key === 'ArrowRight') {
        go(index + 1)
      }
    }

    node.addEventListener('keydown', onKeyDown)

    return () => node.removeEventListener('keydown', onKeyDown)
  }, [count, go, index])

  if (count === 0) {
    return null
  }

  return (
    <section
      aria-label="Featured banners"
      aria-roledescription="carousel"
      className={`relative isolate touch-pan-y select-none overflow-hidden bg-ink ${
        count > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
      onBlur={() => setPaused(false)}
      onClickCapture={onClickCapture}
      // Stops the banner changing under a cursor that is about to click it.
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerCancel={endDrag}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      ref={regionRef}
      tabIndex={-1}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {slides.map((slide, position) => {
          const isActive = position === index

          const image = (
            <Image
              alt={slide.alt}
              className="object-cover"
              // A dragged image otherwise becomes a browser drag rather than a
              // swipe.
              draggable={false}
              fill
              // Only the first slide is on screen at load; the rest would
              // compete with it for bandwidth.
              priority={position === 0}
              sizes="100vw"
              src={slide.src}
            />
          )

          return (
            <div
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              key={slide.src + position}
            >
              {slide.href ? (
                // A plain anchor: the storefront navigates with full page loads,
                // and a hidden slide must not be reachable by tabbing.
                <a
                  aria-label={slide.alt}
                  className="block h-full w-full"
                  href={slide.href}
                  tabIndex={isActive ? 0 : -1}
                >
                  {image}
                </a>
              ) : (
                image
              )}
            </div>
          )
        })}

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 md:bottom-5">
            {slides.map((slide, position) => (
              <button
                aria-current={position === index}
                aria-label={`Go to banner ${position + 1}`}
                className={`h-2 rounded-full transition-all ${
                  position === index ? 'w-6 bg-paper' : 'w-2 bg-paper/50 hover:bg-paper/80'
                }`}
                key={slide.src + position}
                onClick={() => go(position)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
