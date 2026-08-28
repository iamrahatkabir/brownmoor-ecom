'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Keeps the page's primary action within thumb reach on a phone.
 *
 * A cart or checkout runs longer than a small screen, so the button that moves
 * the order forward would otherwise sit below the fold behind a scroll. On
 * desktop there is room to show it in place, so this is mobile only and the
 * in-page button takes over from `md` up.
 *
 * The bar reports its own height as a custom property. The floating WhatsApp
 * button reads that and lifts clear, rather than the two overlapping in the
 * corner — and because the value is published rather than hardcoded, changing
 * the bar's padding cannot silently break that spacing.
 */
const HEIGHT_VAR = '--sticky-action-height'

export function StickyAction({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    /**
     * Tailwind's `md`, the breakpoint the bar's own `md:hidden` uses. Hardcoded
     * because a media query is the only thing that reports the switch reliably:
     * a ResizeObserver does not fire when an element flips to display:none, and
     * a window resize listener missed it too, which left the WhatsApp button
     * floating above a bar that had gone.
     */
    const desktop = window.matchMedia('(min-width: 768px)')

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        HEIGHT_VAR,
        desktop.matches ? '0px' : `${element.offsetHeight}px`,
      )
    }

    publishHeight()

    desktop.addEventListener('change', publishHeight)

    // Catches the bar growing or shrinking while still on a phone — a wrapped
    // label, say — without waiting for a breakpoint change.
    const observer = new ResizeObserver(publishHeight)

    observer.observe(element)

    return () => {
      desktop.removeEventListener('change', publishHeight)
      observer.disconnect()
      document.documentElement.style.setProperty(HEIGHT_VAR, '0px')
    }
  }, [])

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-4 pt-3 md:hidden"
      ref={ref}
      // Clears the home indicator on newer iPhones.
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  )
}
