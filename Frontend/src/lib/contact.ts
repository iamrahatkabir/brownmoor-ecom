/**
 * Contact details, in one place so the header and footer cannot drift apart.
 */

export const CONTACT = {
  facebook: {
    /** Shown next to the mark. */
    label: 'Brownmoor.com',
    url: 'https://www.facebook.com/brownmoorbangladesh/',
  },
  instagram: {
    /** The handle, since that is how Instagram accounts are referred to. */
    label: '@brownmoorbd',
    url: 'https://www.instagram.com/brownmoorbd/',
  },
  hotline: {
    /** Formatted to match the WhatsApp number so the two read as a pair. */
    display: '+880 1318-519586',
    /** `tel:` wants no spaces or dashes; the plus and country code are fine. */
    url: 'tel:+8801318519586',
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
