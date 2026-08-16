'use client'

import { useEffect, useState } from 'react'

import { SearchBar } from '@/components/SearchBar'
import { CloseIcon, SearchIcon } from '@/components/icons'

/**
 * Search on small screens.
 *
 * The header has no room for a permanent field on a phone, so the icon opens a
 * panel beneath it holding the same SearchBar the desktop uses — suggestions,
 * debouncing and navigation all behave identically rather than being a second
 * implementation.
 */
export function MobileSearch() {
  const [open, setOpen] = useState(false)

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
        aria-label={open ? 'Close search' : 'Search'}
        className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <CloseIcon /> : <SearchIcon />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 md:hidden">
          {/* Dimmed page behind, so the panel reads as a layer over the page
              rather than part of the header. */}
          <button
            aria-label="Close search"
            className="fixed inset-0 -z-10 bg-ink/30"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            type="button"
          />

          <div className="border-b border-line bg-paper p-3 shadow-sm">
            <SearchBar autoFocus onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
