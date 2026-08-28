'use client'

import { useEffect } from 'react'

import { toTaka, trackPixel } from '@/lib/pixel'

/**
 * Reports ViewContent for a product page.
 *
 * A component rather than a call in the page because the product page is a
 * server component, and the pixel only exists in the browser. Renders nothing.
 */
export function TrackViewContent({
  id,
  name,
  value,
}: {
  id: number
  name: string
  value?: null | number
}) {
  useEffect(() => {
    trackPixel('ViewContent', {
      content_ids: [String(id)],
      content_name: name,
      content_type: 'product',
      currency: 'BDT',
      ...(typeof value === 'number' ? { value: toTaka(value) } : {}),
    })
  }, [id, name, value])

  return null
}
