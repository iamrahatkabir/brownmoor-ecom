'use client'

import { Spinner } from '@/components/Spinner'
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons'

/**
 * Bin / minus — count — plus.
 *
 * At a quantity of one the left control is a bin, because the next tap removes
 * the line rather than reducing it; showing a minus there would promise a
 * decrement that cannot happen.
 */
export function QuantityStepper({
  className = 'h-12',
  disabled = false,
  max,
  onDecrement,
  onIncrement,
  pending = false,
  quantity,
}: {
  className?: string
  disabled?: boolean
  max?: number
  pending?: boolean
  onDecrement: () => void
  onIncrement: () => void
  quantity: number
}) {
  const atMax = typeof max === 'number' && quantity >= max

  return (
    <div className={`flex items-center justify-between rounded-lg border border-ink ${className}`}>
      <button
        aria-label={quantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
        className="flex h-full w-10 items-center justify-center text-ink disabled:opacity-40 md:w-12"
        disabled={disabled}
        onClick={onDecrement}
        type="button"
      >
        {quantity <= 1 ? <TrashIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
      </button>

      {/* Occupies the count's place so the two buttons do not shift while a
          change is saving. */}
      <span aria-live="polite" className="text-sm font-medium tabular-nums">
        {pending ? <Spinner className="h-3.5 w-3.5" /> : quantity}
      </span>

      <button
        aria-label="Increase quantity"
        className="flex h-full w-10 items-center justify-center text-ink disabled:opacity-40 md:w-12"
        disabled={disabled || atMax}
        onClick={onIncrement}
        type="button"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
