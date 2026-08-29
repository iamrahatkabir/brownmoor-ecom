'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Publishes a fixed bottom bar's height so other floating furniture can clear
 * it — currently the WhatsApp button, which would otherwise sit on top of the
 * page's primary action on a phone.
 *
 * Shared by the cart and checkout bars and the product page's own add-to-cart
 * bar, so the three cannot drift apart. The value is measured rather than
 * hardcoded: change a bar's padding and the spacing follows.
 */
const HEIGHT_VAR = '--sticky-action-height'

/**
 * Tailwind's `md`, matching the `md:hidden` on every bar that uses this.
 * Hardcoded because a media query is the only thing that reports the switch
 * reliably: a ResizeObserver does not fire when an element flips to
 * display:none, and a window resize listener misses it too.
 */
const DESKTOP_QUERY = '(min-width: 768px)'

/**
 * @param active Whether the bar is currently rendered. A bar that appears on
 * scroll is not in the DOM on mount, and a ref object never changes identity —
 * so without this the effect would run once against nothing and never again,
 * leaving the height unpublished and the WhatsApp button sitting on top of it.
 */
export function useStickyActionHeight(
  ref: RefObject<HTMLElement | null>,
  active: boolean = true,
): void {
  useEffect(() => {
    if (!active) {
      document.documentElement.style.setProperty(HEIGHT_VAR, '0px')

      return
    }

    const element = ref.current

    if (!element) {
      return
    }

    const desktop = window.matchMedia(DESKTOP_QUERY)

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        HEIGHT_VAR,
        desktop.matches ? '0px' : `${element.offsetHeight}px`,
      )
    }

    publishHeight()
    desktop.addEventListener('change', publishHeight)

    // Catches the bar growing or shrinking while still on a phone — a wrapped
    // label, or a price appearing — without waiting for a breakpoint change.
    const observer = new ResizeObserver(publishHeight)

    observer.observe(element)

    return () => {
      desktop.removeEventListener('change', publishHeight)
      observer.disconnect()
      // The bar can unmount on its own, so the offset must not outlive it.
      document.documentElement.style.setProperty(HEIGHT_VAR, '0px')
    }
  }, [active, ref])
}
