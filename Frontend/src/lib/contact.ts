/**
 * Contact details, in one place so the header and footer cannot drift apart.
 */

/**
 * The business line. One number reachable two ways — dialled or messaged — so
 * it is declared once here and formatted for each use below, rather than typed
 * out twice and left to drift.
 *
 * Bangladeshi convention groups it as country code, four-digit operator prefix,
 * then subscriber number.
 */
const PHONE = {
  /** No spaces or dashes; `tel:` and wa.me both want the bare digits. */
  digits: '8801621193887',
  display: '+880 1621-193887',
}

export const CONTACT = {
  facebook: {
    /** Shown next to the mark. */
    label: 'Brownmoor.com',
    url: 'https://www.facebook.com/brownmoorbangladesh/',
  },
  hotline: {
    display: PHONE.display,
    /** Opens the dialer on a phone. */
    url: `tel:+${PHONE.digits}`,
  },
  instagram: {
    /** The handle, since that is how Instagram accounts are referred to. */
    label: '@brownmoorbd',
    url: 'https://www.instagram.com/brownmoorbd/',
  },
  whatsapp: {
    display: PHONE.display,
    /** wa.me takes digits only — no plus, spaces or dashes. */
    url: `https://wa.me/${PHONE.digits}`,
  },
} as const
