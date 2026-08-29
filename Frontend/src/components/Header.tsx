import Image from 'next/image'

import { Link } from '@/components/Link'
import { CONTACT } from '@/lib/contact'
import type { CategoryTree } from '@/lib/types'

import { MobileSearch } from './MobileSearch'
import { SearchBar } from './SearchBar'

import { CartCount } from './CartCount'
import { CategoryNav } from './CategoryNav'
import { MobileNav } from './MobileNav'
import { CartIcon, FacebookIcon, WhatsAppIcon } from './icons'

/**
 * Three stacked bars, matching the reference layout:
 *   1. utility strip (contact details, secondary links)
 *   2. main bar (logo, search, cart)
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
          <div className="flex items-center gap-6">
            {/* Icon and number are one link, so clicking either opens WhatsApp. */}
            <a
              className="flex items-center gap-2 hover:text-faint"
              href={CONTACT.whatsapp.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              <span>{CONTACT.whatsapp.display}</span>
              <span className="sr-only">— chat on WhatsApp</span>
            </a>

            <a
              className="flex items-center gap-2 hover:text-faint"
              href={CONTACT.facebook.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
              <span>{CONTACT.facebook.label}</span>
              <span className="sr-only">— visit us on Facebook</span>
            </a>
          </div>
          {/* `tel:` opens the dialer on a phone. On desktop it hands off to
              whatever the OS has registered, or does nothing — harmless. */}
          <a className="flex items-center gap-1.5 hover:text-faint" href={CONTACT.hotline.url}>
            <span className="tracked">Hotline:</span>
            <span>{CONTACT.hotline.display}</span>
          </a>
        </div>
      </div>

      {/* Main bar. */}
      <div className="relative border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 md:h-20 md:gap-8">
          <MobileNav categories={categories} />

          <Link className="shrink-0" href="/">
            {/* Intrinsic 395×72, rendered at 20–24px tall — roughly 3× the
                display size, so it stays sharp on high-density screens. */}
            <Image
              alt="Brownmoor.com"
              className="h-5 w-auto md:h-6"
              height={72}
              priority
              src="/logo.png"
              width={395}
            />
          </Link>

          {/* Centred: the logo and the actions size to their content, so the
              search takes the remaining space and centres within it. */}
          <SearchBar className="hidden flex-1 justify-center md:block" />

          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-4">
            <MobileSearch />

            <Link
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center text-ink hover:text-muted"
              href="/cart"
            >
              <CartIcon />
              <CartCount />
            </Link>
          </div>
        </div>
      </div>

      <CategoryNav categories={categories} />
    </header>
  )
}
