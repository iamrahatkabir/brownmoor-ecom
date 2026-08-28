
import { Link } from '@/components/Link'
import type { CategoryTree } from '@/lib/types'

import { ChevronDownIcon } from './icons'

/**
 * Desktop category bar, driven entirely by the Categories collection — adding
 * a category in the admin panel puts it here with no code change.
 *
 * Dropdowns open on hover *and* on keyboard focus (`focus-within`), so the
 * submenu isn't mouse-only. Hidden below `md`; those links live in MobileNav.
 */
export function CategoryNav({ categories }: { categories: CategoryTree[] }) {
  if (categories.length === 0) {
    return null
  }

  return (
    <nav className="hidden border-b border-line md:block">
      <ul className="mx-auto flex max-w-[1280px] items-center justify-center gap-1 px-4">
        {categories.map((category) => (
          <li className="group relative" key={category.id}>
            <Link
              className="flex h-11 items-center gap-1.5 px-4 text-[11px] tracked text-ink hover:text-muted"
              href={`/category/${category.slug}`}
            >
              {category.title}
              {category.children.length > 0 && <ChevronDownIcon />}
            </Link>

            {category.children.length > 0 && (
              <div className="invisible absolute left-0 top-full z-50 min-w-52 border border-line bg-paper opacity-0 shadow-sm transition-[opacity,visibility] group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="py-1">
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        className="block px-4 py-2.5 text-sm text-muted hover:bg-wash hover:text-ink"
                        href={`/category/${child.slug}`}
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
