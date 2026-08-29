import type { Metadata } from 'next'

import { CONTACT } from '@/lib/contact'

export const metadata: Metadata = {
  description:
    'Brownmoor.com-এর ডেলিভারি সময়, চার্জ, Cash on Delivery এবং রিটার্ন সংক্রান্ত তথ্য। সারা বাংলাদেশে ডেলিভারি।',
  title: 'শিপিং ও ডেলিভারি',
}

/**
 * Shipping and delivery policy, in Bangla.
 *
 * Laid out as short titled sections rather than one long page, because this is
 * read to answer a single question — what does delivery cost, when will it
 * arrive — not front to back. The charges are the most looked-up part, so they
 * get cards rather than prose.
 *
 * Measure is a little narrower than the usual reading column and the leading a
 * little looser: Bengali sits taller than Latin and its conjuncts need the
 * vertical room to stay legible on a phone.
 */

/** Section heading plus body, so the rhythm cannot drift between sections. */
function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="border-t border-line pt-8 md:pt-10">
      <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.9] text-muted md:text-base md:leading-[2]">
        {children}
      </div>
    </section>
  )
}

/** One delivery zone and its rate. */
function RateCard({ note, rate, zone }: { note: string; rate: string; zone: string }) {
  return (
    <div className="rounded-lg border border-line bg-wash p-4 md:p-5">
      <p className="text-sm font-medium text-ink md:text-base">{zone}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted md:text-sm">{note}</p>
      <p className="mt-3 text-2xl font-semibold text-ink md:text-3xl">{rate}</p>
    </div>
  )
}

export default function ShippingPage() {
  return (
    // lang on the wrapper, not the page: the header and footer around it are
    // still English, and a screen reader should switch voices at the boundary.
    <div className="mx-auto max-w-[46rem] px-4 py-10 md:py-16" lang="bn">
      <header>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
          শিপিং ও ডেলিভারি
        </h1>
        <p className="mt-3 text-base leading-[1.9] text-muted md:mt-4 md:text-lg md:leading-[1.9]">
          আপনার পছন্দের পণ্য, যত্নের সঙ্গে আপনার দরজায়।
        </p>

        <div className="mt-6 space-y-4 text-[15px] leading-[1.9] text-muted md:text-base md:leading-[2]">
          <p>
            Brownmoor.com-এ আমরা বিশ্বাস করি, একটি সুন্দর shopping experience শুধু পণ্য বেছে নেওয়ার
            মধ্যেই সীমাবদ্ধ নয়—আপনার অর্ডারটি নিরাপদে ও সময়মতো পৌঁছে দেওয়াও তার একটি গুরুত্বপূর্ণ
            অংশ।
          </p>
          <p>
            বর্তমানে আমরা <strong className="font-semibold text-ink">বাংলাদেশের সকল প্রান্তে</strong>{' '}
            আমাদের পণ্য ডেলিভারি করে থাকি।
          </p>
        </div>
      </header>

      <div className="mt-10 space-y-8 md:mt-12 md:space-y-10">
        <Section title="অর্ডার প্রসেসিং">
          <p>
            আপনার অর্ডার নিশ্চিত হওয়ার পর আমাদের টিম সাধারণত{' '}
            <strong className="font-semibold text-ink">১–২ কর্মদিবসের মধ্যে</strong> অর্ডারটি প্রসেস
            করে ডেলিভারির জন্য প্রস্তুত করে।
          </p>
          <p>
            কোনো পণ্য সাময়িকভাবে স্টকে না থাকা বা অপ্রত্যাশিত কোনো কারণে অর্ডার প্রসেস করতে অতিরিক্ত
            সময় লাগলে আমরা আপনাকে যথাসম্ভব দ্রুত জানিয়ে দেব।
          </p>
        </Section>

        <Section title="ডেলিভারি সময়">
          <p>
            অর্ডার প্রসেস হওয়ার পর সাধারণত{' '}
            <strong className="font-semibold text-ink">৩–৫ কর্মদিবসের মধ্যে</strong> আপনার পণ্য
            পৌঁছে যাবে।
          </p>
          <p>
            আমরা বাংলাদেশের সকল এলাকায় ডেলিভারি দিয়ে থাকি। তবে অনাকাঙ্ক্ষিত পরিবহন সমস্যা,
            প্রাকৃতিক দুর্যোগ বা অন্যান্য পরিস্থিতির কারণে কিছু ক্ষেত্রে নির্ধারিত সময়ের চেয়ে
            সামান্য বেশি সময় লাগতে পারে।
          </p>
          <p>আমরা প্রতিটি অর্ডার যত দ্রুত সম্ভব আপনার কাছে পৌঁছে দেওয়ার চেষ্টা করি।</p>
        </Section>

        <Section title="ডেলিভারি চার্জ">
          <p>
            আপনার ডেলিভারি চার্জ নির্ধারিত হবে{' '}
            <strong className="font-semibold text-ink">
              ডেলিভারি লোকেশন এবং অর্ডারের মোট ওজনের
            </strong>{' '}
            ভিত্তিতে।
          </p>

          {/* Two cards stacked on a phone, side by side once there is room. */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <RateCard note="২ কেজি পর্যন্ত" rate="৳৮০" zone="ঢাকার মধ্যে" />
            <RateCard note="২ কেজি পর্যন্ত" rate="৳১৫০" zone="ঢাকার বাইরে" />
          </div>

          <p className="rounded-lg bg-wash px-4 py-3 text-[15px] md:text-base">
            ২ কেজির বেশি ওজনের অর্ডারের ক্ষেত্রে{' '}
            <strong className="font-semibold text-ink">প্রতি অতিরিক্ত কেজির জন্য ৳২০</strong> যোগ
            হবে।
          </p>
        </Section>

        <Section title="Cash on Delivery">
          <p>
            আপনার সুবিধার কথা মাথায় রেখে Brownmoor.com-এ{' '}
            <strong className="font-semibold text-ink">সারা বাংলাদেশে Cash on Delivery</strong>{' '}
            সুবিধা রয়েছে।
          </p>
          <p>
            অর্ডার করার সময় Cash on Delivery নির্বাচন করুন এবং পণ্য আপনার হাতে পৌঁছানোর পর পেমেন্ট
            সম্পন্ন করুন।
          </p>
          <p className="font-medium text-ink">সহজ, নিরাপদ এবং ঝামেলামুক্ত।</p>
        </Section>

        <Section title="ডেলিভারি ঠিকানা পরিবর্তন">
          <p>
            অর্ডার দেওয়ার পর আপনার ডেলিভারি ঠিকানা পরিবর্তনের প্রয়োজন হলে আমাদের Customer Support
            টিমের সঙ্গে <strong className="font-semibold text-ink">ফোনে যোগাযোগ করতে হবে</strong>।
          </p>
          <p>বর্তমানে ওয়েবসাইট থেকে সরাসরি ডেলিভারি ঠিকানা পরিবর্তনের সুবিধা নেই।</p>
          <p>
            ঠিকানা পরিবর্তনের অনুরোধ করার সময় আপনার{' '}
            <strong className="font-semibold text-ink">অর্ডার নম্বর এবং নতুন ঠিকানা</strong> প্রস্তুত
            রাখুন।
          </p>

          <div className="rounded-lg border border-line p-4 md:p-5">
            <p className="text-sm font-semibold text-ink">Customer Support</p>
            <p className="mt-2">
              <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
                {CONTACT.hotline.display}
              </a>
            </p>
            <p className="mt-1 text-[15px]">সকাল ৯টা – রাত ১১টা</p>
          </div>
        </Section>

        <Section title="অর্ডারে বিলম্ব হলে">
          <p>আমরা প্রতিটি অর্ডার নির্ধারিত সময়ের মধ্যে পৌঁছে দেওয়ার জন্য সর্বোচ্চ চেষ্টা করি।</p>
          <p>
            তবে কোনো পণ্য <strong className="font-semibold text-ink">স্টকে না থাকা</strong>, অর্ডার
            প্রসেসিংয়ে বিলম্ব বা অন্য কোনো অনাকাঙ্ক্ষিত কারণে আপনার অর্ডার বিলম্বিত হলে আমরা আপনাকে
            বিষয়টি জানিয়ে দেব।
          </p>
          <p>
            আপনার অর্ডারের বর্তমান অবস্থা সম্পর্কে জানতে আমাদের Customer Support টিমের সঙ্গে যোগাযোগ
            করতে পারেন।
          </p>
        </Section>

        <Section title="পণ্য ক্ষতিগ্রস্ত অবস্থায় পৌঁছালে">
          <p>
            আপনার অর্ডার করা পণ্য যদি ডেলিভারির সময়{' '}
            <strong className="font-semibold text-ink">ক্ষতিগ্রস্ত অবস্থায়</strong> পৌঁছায়, তাহলে
            আমরা <strong className="font-semibold text-ink">Happy Return</strong> গ্রহণ করি।
          </p>
          <p>
            এক্ষেত্রে পণ্যটি আমাদের কাছে ফেরত পাঠানোর{' '}
            <strong className="font-semibold text-ink">
              ডেলিভারি চার্জ কাস্টমারকে বহন করতে হবে
            </strong>
            ।
          </p>
          <p>
            ক্ষতিগ্রস্ত পণ্য হাতে পাওয়ার পর যত দ্রুত সম্ভব আমাদের Customer Support টিমের সঙ্গে
            যোগাযোগ করুন। আমরা বিষয়টি পর্যালোচনা করে পরবর্তী প্রয়োজনীয় ব্যবস্থা নিতে সাহায্য করব।
          </p>

          <div className="rounded-lg border border-line p-4 md:p-5">
            <p className="text-sm font-semibold text-ink">যোগাযোগ করুন</p>
            <p className="mt-2">
              <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
                {CONTACT.hotline.display}
              </a>
            </p>
            <p className="mt-1 break-all">
              <a className="text-ink underline underline-offset-4" href={CONTACT.email.url}>
                {CONTACT.email.address}
              </a>
            </p>
          </div>
        </Section>

        <Section title="আমাদের সঙ্গে যোগাযোগ করুন">
          <p>আপনার অর্ডার, ডেলিভারি বা শিপিং সম্পর্কিত কোনো প্রশ্ন থাকলে আমরা সাহায্য করতে প্রস্তুত।</p>

          <div className="rounded-lg bg-wash p-5 md:p-6">
            <p className="text-base font-semibold text-ink">Brownmoor.com</p>
            <p className="mt-1 text-[15px]">Arshinagar, Bosila, Mohammadpur, Dhaka</p>

            <dl className="mt-4 space-y-2 text-[15px]">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-ink">Phone:</dt>
                <dd>
                  <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
                    {CONTACT.hotline.display}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-ink">Email:</dt>
                <dd className="break-all">
                  <a className="text-ink underline underline-offset-4" href={CONTACT.email.url}>
                    {CONTACT.email.address}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-sm font-medium text-ink">Customer Support Hours</p>
            <p className="mt-1 text-[15px]">সকাল ৯টা – রাত ১১টা</p>
          </div>
        </Section>
      </div>

      <p className="mt-10 border-t border-line pt-8 text-center text-[15px] leading-[1.9] text-muted md:mt-12 md:text-base">
        Brownmoor.com — সুন্দর রান্নাঘরের জন্য যত্নসহকারে বাছাই করা পণ্য, আপনার দরজায়।
      </p>
    </div>
  )
}
