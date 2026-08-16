/**
 * Delivery zones and rates.
 *
 * Hardcoded for now, on purpose. The editable ShippingSettings global and the
 * weight-based surcharge were paused, so these are the two flat rates quoted
 * for the storefront. When that module lands these move into the admin and the
 * cart should read them from the API instead — the shape here is deliberately
 * close to what that will return.
 *
 * Stored in the minor unit like every other amount: 8000 poisha is ৳80.
 */
export type ShippingZone = {
  id: 'inside-dhaka' | 'outside-dhaka'
  label: string
  rate: number
}

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: 'inside-dhaka', label: 'Inside Dhaka', rate: 8000 },
  { id: 'outside-dhaka', label: 'Outside Dhaka', rate: 15000 },
]

export const DEFAULT_ZONE = SHIPPING_ZONES[0]
