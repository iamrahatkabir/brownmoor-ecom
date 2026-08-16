import Image from 'next/image'
import Link from 'next/link'

import type { CategoryTree } from '@/lib/types'

import { CategoryNav } from './CategoryNav'
import { MobileNav } from './MobileNav'
import { CartIcon, SearchIcon, UserIcon } from './icons'

/**
 * Three stacked bars, matching the reference layout:
 *   1. utility strip (contact details, secondary links)
 *   2. main bar (logo, search, account, cart)
 *   3. category navigation
 *
 * On mobile the utility strip and the category bar both collapse — contact
 * details move to the footer and categories move into the drawer — leaving
 * only the main bar, which is what a phone has room for.
 */
export function Header({ categories }: { categories: CategoryTree[] }) {
  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Utility strip — desktop only. */}
      <div className="hidden bg-ink text-paper md:block">
        <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between px-4 text-[11px]">
          <div className="flex items-center gap-5">
            <a className="hover:text-faint" href="tel:+8801000000000">
              +880 1000-000000
            </a>
            <a className="hover:text-faint" href="mailto:hello@brownmoor.com">
              hello@brownmoor.com
            </a>
          </div>
          <nav className="flex items-center gap-5 tracked">
            <Link className="hover:text-faint" href="/about">
              About
            </Link>
            <Link className="hover:text-faint" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-faint" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </div>

      {/* Main bar. */}
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 md:h-20 md:gap-8">
          <MobileNav categories={categories} />

          <Link className="shrink-0" href="/">
            {/* Intrinsic size is 132×24; rendered smaller so it stays crisp
                on high-density screens. */}
            <Image
              alt="Brownmoor"
              className="h-5 w-auto md:h-6"
              height={24}
              priority
              src="/logo.png"
              width={132}
            />
          </Link>

          <form action="/search" className="ml-auto hidden max-w-xl flex-1 md:block">
            <div className="flex h-11 items-center border border-line focus-within:border-ink">
              <input
                aria-label="Search products"
                className="h-full w-full bg-transparent px-4 text-sm outline-none placeholder:text-faint"
                name="q"
                placeholder="Search for products"
                type="search"
              />
              <button
                aria-label="Search"
                className="flex h-full w-12 items-center justify-center text-muted hover:text-ink"
                type="submit"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-4">
            <Link
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
              href="/search"
            >
              <SearchIcon />
            </Link>

            <Link
              className="hidden items-center gap-2 text-[11px] tracked hover:text-muted md:flex"
              href="/account"
            >
              <UserIcon />
              <span>Login</span>
            </Link>

            <Link
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center text-ink hover:text-muted"
              href="/cart"
            >
              <CartIcon />
              {/* Count is wired up with the cart context in a later pass. */}
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-paper">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      <CategoryNav categories={categories} />
    </header>
  )
}
