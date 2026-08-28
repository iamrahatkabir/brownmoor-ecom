'use client'

import { useEffect, useState } from 'react'

import { Link } from '@/components/Link'
import type { CategoryTree } from '@/lib/types'

import { CloseIcon, MenuIcon } from './icons'

/**
 * Slide-in category drawer for small screens.
 *
 * The only client component in the header — everything else stays a server
 * component, so opening a menu costs one small bundle rather than hydrating
 * the whole nav.
 */
export function MobileNav({ categories }: { categories: CategoryTree[] }) {
  const [open, setOpen] = useState(false)

  // A drawer over a scrolling page lets the body scroll behind it on iOS.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Open menu"
        className="-ml-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            type="button"
          />

          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-paper">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="text-[11px] tracked text-muted">Browse</span>
              <button
                aria-label="Close menu"
                className="-mr-2 flex h-10 w-10 items-center justify-center"
                onClick={() => setOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Closing on click rather than on a pathname effect: navigating to
                the page you're already on wouldn't change the path, and the
                drawer would stay open over it. */}
            <nav className="flex-1 overflow-y-auto py-2" onClick={() => setOpen(false)}>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="block px-4 py-3 text-sm font-medium text-ink"
                      href={`/category/${category.slug}`}
                    >
                      {category.title}
                    </Link>

                    {category.children.length > 0 && (
                      <ul className="pb-2">
                        {category.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              className="block py-2 pl-8 pr-4 text-sm text-muted"
                              href={`/category/${child.slug}`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
