import Image from 'next/image'
import Link from 'next/link'

import type { CategoryTree } from '@/lib/types'

/**
 * Footer. Shop column is generated from the live category tree, so it can't
 * drift out of sync with the nav above it.
 */
export function Footer({ categories }: { categories: CategoryTree[] }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-1">
            {/* The wordmark is near-black, so it needs inverting on ink. */}
            <Image
              alt="Brownmoor"
              className="h-6 w-auto brightness-0 invert"
              height={24}
              src="/logo.png"
              width={132}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Kitchenware built to be used every day — and to last long enough to be worth it.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracked text-paper/50">Shop</h2>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    className="text-sm text-paper/80 hover:text-paper"
                    href={`/category/${category.slug}`}
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracked text-paper/50">Help</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: '/shipping', label: 'Shipping & delivery' },
                { href: '/returns', label: 'Returns' },
                { href: '/contact', label: 'Contact us' },
                { href: '/privacy', label: 'Privacy policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-paper/80 hover:text-paper" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracked text-paper/50">Get in touch</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
              <li>
                <a className="hover:text-paper" href="tel:+8801000000000">
                  +880 1000-000000
                </a>
              </li>
              <li>
                <a className="hover:text-paper" href="mailto:hello@brownmoor.com">
                  hello@brownmoor.com
                </a>
              </li>
              <li className="pt-2 text-paper/60">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} Brownmoor. All rights reserved.</p>
          <p>Cash on delivery available across Bangladesh.</p>
        </div>
      </div>
    </footer>
  )
}
