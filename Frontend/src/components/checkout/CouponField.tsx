'use client'

import { useState } from 'react'

import { Spinner } from '@/components/Spinner'
import { formatBDT } from '@/lib/price'

/**
 * The discount code box on checkout.
 *
 * Only ever reports what the server says. The code and the subtotal go out, a
 * saving comes back — the browser never decides the amount, because the order
 * is priced again from the code when it is confirmed. A figure invented here
 * would simply be overwritten, so quoting one would mislead the shopper.
 */
export function CouponField({
  applied,
  onApply,
  onRemove,
  subtotal,
}: {
  applied: null | { code: string; discount: number }
  onApply: (value: { code: string; discount: number }) => void
  onRemove: () => void
  subtotal: number
}) {
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const check = async () => {
    const trimmed = code.trim()

    if (!trimmed || checking) {
      return
    }

    setChecking(true)
    setError(null)

    try {
      const res = await fetch('/api/coupons/validate', {
        body: JSON.stringify({ code: trimmed, subtotal }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const result = await res.json()

      if (result?.valid) {
        onApply({ code: result.code, discount: result.discount })
        setCode('')
      } else {
        setError(result?.reason ?? "That coupon code isn't valid.")
      }
    } catch {
      setError("Couldn't check that code. Please try again.")
    } finally {
      setChecking(false)
    }
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3.5 py-3 text-sm">
        <span className="min-w-0">
          <span className="font-medium text-ink">{applied.code}</span>{' '}
          <span className="text-muted">applied</span>
        </span>
        <button
          className="shrink-0 text-xs text-muted underline underline-offset-4 hover:text-ink"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          aria-label="Coupon code"
          // Codes are stored uppercase, so showing them that way as the shopper
          // types avoids a code that looks different from the one they were given.
          className="h-11 min-w-0 flex-1 rounded-lg border border-transparent bg-paper px-3.5 text-sm uppercase outline-none transition-colors placeholder:normal-case placeholder:text-faint focus:border-ink"
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Inside a form this would submit the order instead.
              event.preventDefault()
              void check()
            }
          }}
          placeholder="Coupon code"
          value={code}
        />
        <button
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-ink px-5 text-[11px] tracked text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
          disabled={checking || !code.trim()}
          onClick={check}
          type="button"
        >
          {checking && <Spinner className="h-3.5 w-3.5" />}
          Apply
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-sale" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Formats a saving for the order summary. */
export const formatDiscount = (amount: number): string => `− ${formatBDT(amount)}`
