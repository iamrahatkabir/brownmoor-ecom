'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/Spinner'
import { SearchIcon } from '@/components/icons'
import { formatBDT } from '@/lib/price'

/** Long enough to be worth a query — one letter would match half the catalogue. */
const MIN_QUERY = 2

/** Suggestions are a shortcut, not the results page. */
const MAX_SUGGESTIONS = 6

type Suggestion = {
  href: string
  id: number
  image: null | string
  price: null | number
  title: string
}

export function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)

  // Debounced so typing "saucepan" fires one request, not eight. The abort
  // controller drops a slow earlier response that would otherwise land after a
  // newer one and show stale suggestions.
  useEffect(() => {
    const term = query.trim()

    // Too short to search. Nothing is cleared here on purpose — `visible`
    // below derives the empty state during render, so no state is set from
    // inside the effect.
    if (term.length < MIN_QUERY) {
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      // Set here rather than in the effect body: synchronous state changes
      // inside an effect cascade an extra render, and the spinner is only
      // wanted once the debounce actually fires.
      setLoading(true)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data.results ?? [])
      } catch {
        // An aborted request is the expected case here, not a failure.
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  // Clicking anywhere else should dismiss the suggestions.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)

    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()

    if (query.trim().length >= MIN_QUERY) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const longEnough = query.trim().length >= MIN_QUERY
  // Stale hits from a previous longer query are ignored rather than cleared.
  const visible = longEnough ? results : []
  const busy = longEnough && loading
  const showPanel = open && longEnough

  return (
    <div className={`relative ${className}`} ref={wrapper}>
      <form onSubmit={submit}>
        <div className="flex h-11 items-center rounded-lg border border-line bg-paper focus-within:border-ink">
          <input
            aria-label="Search products"
            className="h-full w-full bg-transparent px-4 text-sm outline-none placeholder:text-faint"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search for products"
            type="search"
            value={query}
          />
          <button
            aria-label="Search"
            className="flex h-full w-12 items-center justify-center text-muted hover:text-ink"
            type="submit"
          >
            {busy ? <Spinner className="h-4 w-4" /> : <SearchIcon />}
          </button>
        </div>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-line bg-paper shadow-lg">
          {visible.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-muted">
              {busy ? 'Searching…' : `Nothing found for “${query.trim()}”.`}
            </p>
          ) : (
            <>
              <ul>
                {visible.slice(0, MAX_SUGGESTIONS).map((item) => (
                  <li key={item.id}>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-wash"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-wash">
                        {item.image && (
                          <Image
                            alt=""
                            className="h-full w-full object-cover"
                            height={88}
                            src={item.image}
                            width={88}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                      {item.price !== null && (
                        <span className="shrink-0 text-sm font-medium">
                          {formatBDT(item.price)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                className="w-full border-t border-line px-4 py-3 text-[11px] tracked text-muted hover:bg-wash hover:text-ink"
                onClick={submit}
                type="button"
              >
                See all results
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
