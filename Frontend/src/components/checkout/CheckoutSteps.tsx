/**
 * Shared progress banner for cart, checkout and the order confirmation.
 *
 * Steps are not links: a shopper cannot jump to checkout without a cart, nor
 * back to a completed order, so making them clickable would promise
 * navigation that does not exist.
 */
const STEPS = [
  { id: 'cart', label: 'Shopping cart' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'complete', label: 'Order complete' },
] as const

export function CheckoutSteps({ current }: { current: (typeof STEPS)[number]['id'] }) {
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-3 px-4 py-6 md:gap-5 md:py-8">
        {STEPS.map((step, index) => (
          <span className="flex items-center gap-3 md:gap-5" key={step.id}>
            {index > 0 && (
              <span aria-hidden="true" className="text-paper/40">
                →
              </span>
            )}
            <span
              aria-current={step.id === current ? 'step' : undefined}
              className={`text-sm tracked md:text-base ${
                step.id === current ? 'font-semibold text-paper' : 'text-paper/45'
              }`}
            >
              {step.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
