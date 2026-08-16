'use client'

import { useState } from 'react'

import type { Product } from '@/lib/types'

import { RichText } from './RichText'

/**
 * Description and Specifications.
 *
 * Tabs on desktop; on mobile both panels are stacked and always open, since a
 * tab strip on a narrow screen hides content behind a tap for no real gain.
 */
export function ProductTabs({ product }: { product: Product }) {
  const specs = product.specifications ?? []
  const hasDescription = Boolean(product.description) || Boolean(product.shortDescription)
  const hasSpecs = specs.length > 0 || Boolean(product.careInstructions)

  const [active, setActive] = useState<'description' | 'specifications'>(
    hasDescription ? 'description' : 'specifications',
  )

  if (!hasDescription && !hasSpecs) {
    return null
  }

  const description = (
    <div>
      {product.description ? (
        <RichText content={product.description} />
      ) : (
        <p className="text-sm leading-relaxed text-muted">{product.shortDescription}</p>
      )}
    </div>
  )

  const specifications = (
    <div>
      {specs.length > 0 && (
        <dl className="divide-y divide-line border-y border-line">
          {specs.map((spec, index) => (
            <div className="grid grid-cols-3 gap-4 py-3" key={spec.id ?? index}>
              <dt className="text-sm text-muted">{spec.label}</dt>
              <dd className="col-span-2 text-sm text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {product.careInstructions && (
        <div className="mt-6">
          <h3 className="text-[11px] tracked text-muted">Care</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{product.careInstructions}</p>
        </div>
      )}
    </div>
  )

  const tabs = [
    { available: hasDescription, id: 'description' as const, label: 'Description' },
    { available: hasSpecs, id: 'specifications' as const, label: 'Specifications' },
  ].filter((tab) => tab.available)

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        {/* Desktop: tab strip. */}
        <div className="hidden md:block">
          <div className="flex gap-8 border-b border-line">
            {tabs.map((tab) => (
              <button
                className={`-mb-px border-b-2 pb-3 text-[11px] tracked transition-colors ${
                  active === tab.id
                    ? 'border-ink text-ink'
                    : 'border-transparent text-faint hover:text-muted'
                }`}
                key={tab.id}
                onClick={() => setActive(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-3xl">
            {active === 'description' ? description : specifications}
          </div>
        </div>

        {/* Mobile: stacked, nothing hidden. */}
        <div className="space-y-10 md:hidden">
          {hasDescription && (
            <div>
              <h2 className="text-[11px] tracked text-muted">Description</h2>
              <div className="mt-4">{description}</div>
            </div>
          )}

          {hasSpecs && (
            <div>
              <h2 className="text-[11px] tracked text-muted">Specifications</h2>
              <div className="mt-4">{specifications}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
