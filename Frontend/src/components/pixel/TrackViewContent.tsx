'use client'

import { useEffect } from 'react'

import { trackViewItem } from '@/lib/analytics'

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
    trackViewItem([{ id: String(id), name, price: value }], value)
  }, [id, name, value])

  return null
}
