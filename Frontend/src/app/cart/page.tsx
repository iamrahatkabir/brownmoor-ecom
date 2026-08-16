import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'

export const metadata: Metadata = {
  title: 'Shopping cart',
}

const STEPS = ['Shopping cart', 'Checkout', 'Order complete']

export default function CartPage() {
  return (
    <>
      {/* Progress banner. The current step is the first one; the rest are
          shown so the shopper knows how much is left, not as links — the
          later steps are not reachable until this one is done. */}
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-3 px-4 py-6 md:gap-5 md:py-8">
          {STEPS.map((step, index) => (
            <span className="flex items-center gap-3 md:gap-5" key={step}>
              {index > 0 && (
                <span aria-hidden="true" className="text-paper/40">
                  →
                </span>
              )}
              <span
                aria-current={index === 0 ? 'step' : undefined}
                className={`text-sm tracked md:text-base ${
                  index === 0 ? 'font-semibold text-paper' : 'text-paper/45'
                }`}
              >
                {step}
              </span>
            </span>
          ))}
        </div>
      </div>

      <CartView />
    </>
  )
}
