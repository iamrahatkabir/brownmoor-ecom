import type { Metadata } from 'next'

import { PolicyBody, PolicyCard, PolicyPage, PolicySection, Strong } from '@/components/PolicyPage'
import { WhatsAppIcon } from '@/components/icons'
import { CONTACT } from '@/lib/contact'

export const metadata: Metadata = {
  description:
    'Brownmoor.com-এর সঙ্গে যোগাযোগ করুন — অর্ডার, ডেলিভারি, Return বা Warranty সংক্রান্ত যেকোনো প্রশ্নে ফোন, WhatsApp বা email-এ আমরা পাশে আছি।',
  title: 'যোগাযোগ করুন',
}

/**
 * The page's primary action.
 *
 * WhatsApp's green rather than the monochrome brand, matching the floating
 * button already on every page: the two do the same thing, and a shopper who
 * has learnt to recognise one should recognise the other.
 */
function WhatsAppButton() {
  return (
    <a
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#25D366] px-6 text-[11px] tracked text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
      href={CONTACT.whatsapp.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="h-5 w-5" />
      Message us on WhatsApp
    </a>
  )
}

export default function ContactPage() {
  return (
    <PolicyPage
      lead={
        <>
          <p className="mt-3 text-base leading-[1.9] text-muted md:mt-4 md:text-lg">
            আমরা আপনার কথা শুনতে প্রস্তুত।
          </p>

          <div className="mt-6">
            <PolicyBody>
              <p>
                Brownmoor.com-এ আপনার shopping experience আরও সুন্দর ও সহজ করে তুলতে আমরা সবসময়
                পাশে আছি।
              </p>
              <p>
                আপনার অর্ডার, পণ্য, ডেলিভারি, Return, Warranty অথবা অন্য যেকোনো বিষয়ে কোনো প্রশ্ন
                থাকলে আমাদের সঙ্গে যোগাযোগ করতে দ্বিধা করবেন না।
              </p>
            </PolicyBody>
          </div>

          {/* Straight after the intro, so the quickest route out is the first
              thing in reach rather than buried below the fold. */}
          <div className="mt-6">
            <WhatsAppButton />
          </div>
        </>
      }
      title="যোগাযোগ করুন"
    >
      <PolicySection title="Customer Support">
        <PolicyCard title="Call / WhatsApp">
          <p className="text-lg font-semibold text-ink md:text-xl">
            <a className="underline underline-offset-4" href={CONTACT.hotline.url}>
              {CONTACT.hotline.display}
            </a>
          </p>
        </PolicyCard>

        <p>
          অর্ডার সংক্রান্ত দ্রুত সহায়তার জন্য আমাদের WhatsApp অথবা ফোনে যোগাযোগ করতে পারেন।
        </p>

        <PolicyCard title="Customer Support Hours">
          <p>সকাল ৯টা – রাত ১১টা</p>
        </PolicyCard>
      </PolicySection>

      <PolicySection title="Email Us">
        <PolicyCard>
          <p className="break-all text-base font-semibold text-ink md:text-lg">
            <a className="underline underline-offset-4" href={CONTACT.email.url}>
              {CONTACT.email.address}
            </a>
          </p>
        </PolicyCard>

        <p>
          আপনার প্রশ্ন, feedback, Return বা Warranty-related বিষয় email-এর মাধ্যমে আমাদের জানাতে
          পারেন।
        </p>
        <p>
          আমাদের টিম আপনার message পর্যালোচনা করে যথাসম্ভব দ্রুত উত্তর দেওয়ার চেষ্টা করবে।
        </p>
      </PolicySection>

      <PolicySection title="আমাদের ঠিকানা">
        <div className="rounded-lg bg-wash p-5 md:p-6">
          <p className="text-base font-semibold text-ink">Brownmoor.com</p>
          <p className="mt-1 text-[15px] leading-[1.9]">
            Arshinagar, Bosila
            <br />
            Mohammadpur, Dhaka, Bangladesh
          </p>
        </div>
      </PolicySection>

      <PolicySection title="অর্ডার সম্পর্কে জানতে চান?">
        <p>
          আপনার অর্ডার সম্পর্কিত কোনো বিষয়ে যোগাযোগ করার সময় সম্ভব হলে আপনার{' '}
          <Strong>Order Number</Strong> সঙ্গে রাখুন।
        </p>
        <p>এতে আমাদের টিম আপনার order দ্রুত খুঁজে বের করে আপনাকে সাহায্য করতে পারবে।</p>
      </PolicySection>

      <section className="border-t border-line pt-8 md:pt-10">
        <p className="text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl">
          আপনার প্রতিটি প্রশ্ন আমাদের কাছে গুরুত্বপূর্ণ।
        </p>
        <div className="mt-4">
          <PolicyBody>
            <p>
              Brownmoor.com-এর সঙ্গে কেনাকাটার অভিজ্ঞতা যেন সহজ, নির্ভরযোগ্য এবং আনন্দদায়ক
              হয়—সেটাই আমাদের লক্ষ্য।
            </p>
          </PolicyBody>
        </div>

        <div className="mt-6">
          <WhatsAppButton />
        </div>
      </section>
    </PolicyPage>
  )
}
