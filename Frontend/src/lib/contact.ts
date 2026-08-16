/**
 * Contact details, in one place so the header and footer cannot drift apart.
 */

export const CONTACT = {
  facebook: {
    /** Shown next to the mark. */
    label: 'Brownmoor.com',
    url: 'https://www.facebook.com/brownmoorbangladesh/',
  },
  whatsapp: {
    /**
     * Bangladeshi convention: country code, then the four-digit operator
     * prefix, then the subscriber number.
     */
    display: '+880 1621-193887',
    /** wa.me wants digits only — no plus, spaces or dashes. */
    url: 'https://wa.me/8801621193887',
  },
} as const
