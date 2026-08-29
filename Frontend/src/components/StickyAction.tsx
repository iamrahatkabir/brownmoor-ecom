'use client'

import { useRef, type ReactNode } from 'react'

import { useStickyActionHeight } from '@/components/useStickyActionHeight'

/**
 * Keeps the page's primary action within thumb reach on a phone.
 *
 * A cart or checkout runs longer than a small screen, so the button that moves
 * the order forward would otherwise sit below the fold behind a scroll. On
 * desktop there is room to show it in place, so this is mobile only and the
 * in-page button takes over from `md` up.
 */
export function StickyAction({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useStickyActionHeight(ref)

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
