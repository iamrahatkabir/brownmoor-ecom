import { WhatsAppIcon } from '@/components/icons'
import { CONTACT } from '@/lib/contact'

/**
 * Persistent WhatsApp button, bottom right on every page.
 *
 * Cash on delivery is arranged by conversation here, so the quickest route to a
 * message is worth a permanent place on screen rather than a trip to the footer.
 *
 * WhatsApp's own green rather than the monochrome brand: this is an affordance
 * people recognise before they read it, and a black circle would not be
 * identified at a glance.
 *
 * Sits above the page but below nothing else — the storefront has no other
 * fixed furniture, so there is nothing for it to cover. The safe-area inset
 * keeps it clear of the home indicator on iPhones.
 */
export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Message us on WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:bottom-6 md:right-6 md:h-14 md:w-14"
      href={CONTACT.whatsapp.url}
      rel="noopener noreferrer"
      // Lifts above the sticky action bar on cart and checkout, which
      // publishes its height; elsewhere the variable is absent and the
      // fallback keeps it in the corner.
      style={{
        bottom:
          'calc(max(1rem, env(safe-area-inset-bottom)) + var(--sticky-action-height, 0px))',
      }}
      target="_blank"
    >
      <WhatsAppIcon className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  )
}
