import type { Metadata } from 'next'

import {
  PolicyBody,
  PolicyCard,
  PolicyList,
  PolicyPage,
  PolicySection,
  Strong,
} from '@/components/PolicyPage'
import { CONTACT } from '@/lib/contact'

export const metadata: Metadata = {
  description:
    'Brownmoor.com কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখে — cookies, analytics, marketing এবং আপনার অধিকার সম্পর্কে বিস্তারিত।',
  title: 'Privacy Policy',
}

/** Shown at the top and referenced in the "changes" section, so it lives once. */
const EFFECTIVE_DATE = '২৯ আগস্ট ২০২৬'

export default function PrivacyPage() {
  return (
    <PolicyPage
      lead={
        <>
          <p className="mt-3 text-sm text-faint md:mt-4 md:text-base">
            কার্যকর তারিখ: {EFFECTIVE_DATE}
          </p>

          <div className="mt-6">
            <PolicyBody>
              <p>
                Brownmoor.com আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও নিরাপত্তাকে গুরুত্ব দেয়। আপনি যখন
                আমাদের website ব্যবহার করেন, অর্ডার করেন বা আমাদের সঙ্গে যোগাযোগ করেন, তখন আপনার
                দেওয়া তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখা হয়—এই Privacy Policy-তে তা
                বিস্তারিতভাবে ব্যাখ্যা করা হয়েছে।
              </p>
              <p>
                Brownmoor.com-এর website ব্যবহার বা আমাদের কাছ থেকে পণ্য কেনার মাধ্যমে আপনি এই
                Privacy Policy-তে বর্ণিত practices-এ সম্মতি প্রদান করছেন।
              </p>
            </PolicyBody>
          </div>
        </>
      }
      title="Privacy Policy"
    >
      <PolicySection title="আমরা কোন তথ্য সংগ্রহ করি">
        <p>
          আপনি Brownmoor.com-এ অর্ডার করার সময় বা আমাদের সঙ্গে যোগাযোগ করার সময় আমরা প্রয়োজন
          অনুযায়ী নিম্নলিখিত তথ্য সংগ্রহ করতে পারি:
        </p>
        <PolicyList
          items={[
            'আপনার নাম',
            'ফোন নম্বর',
            'Email address',
            'Delivery address',
            'আপনার অর্ডার সম্পর্কিত তথ্য',
          ]}
        />
        <p>
          আমরা শুধুমাত্র আমাদের পরিষেবা প্রদান, অর্ডার সম্পন্ন এবং আপনার সঙ্গে যোগাযোগের জন্য
          প্রয়োজনীয় তথ্য সংগ্রহ করার চেষ্টা করি।
        </p>
      </PolicySection>

      <PolicySection title="আপনার তথ্য কীভাবে ব্যবহার করি">
        <p>আপনার তথ্য আমরা নিম্নলিখিত উদ্দেশ্যে ব্যবহার করতে পারি:</p>
        <PolicyList
          items={[
            'আপনার অর্ডার গ্রহণ ও প্রসেস করতে',
            'আপনার অর্ডার আপনার নির্ধারিত ঠিকানায় পৌঁছে দিতে',
            'অর্ডার সংক্রান্ত গুরুত্বপূর্ণ তথ্য জানাতে',
            'ডেলিভারি সংক্রান্ত বিষয়ে আপনার সঙ্গে যোগাযোগ করতে',
            'Customer Support প্রদান করতে',
            'Website ও shopping experience উন্নত করতে',
            'আমাদের পণ্য ও পরিষেবার কার্যকারিতা বিশ্লেষণ করতে',
            'নতুন পণ্য ও promotional updates সম্পর্কে জানাতে',
            'আপনার আগ্রহের সঙ্গে সম্পর্কিত বিজ্ঞাপন দেখাতে',
          ]}
        />
        <p>
          আপনার তথ্য এমন কোনো উদ্দেশ্যে ব্যবহার করা হবে না যা এই Privacy Policy-এর সঙ্গে
          অসঙ্গতিপূর্ণ।
        </p>
      </PolicySection>

      <PolicySection title="Cookies ও Analytics">
        <p>
          Brownmoor.com-এর website-এর performance এবং customer experience বুঝতে আমরা কিছু
          third-party analytics ও advertising technologies ব্যবহার করি।
        </p>
        <p>এর মধ্যে রয়েছে:</p>

        <div className="space-y-3">
          <PolicyCard title="Google Analytics">
            <p>
              Website visitors কীভাবে আমাদের website ব্যবহার করছেন, কোন pages বেশি দেখা হচ্ছে এবং
              website-এর overall performance কেমন—এসব বুঝতে Google Analytics ব্যবহার করা হয়।
            </p>
          </PolicyCard>

          <PolicyCard title="Meta Pixel">
            <p>
              Facebook ও Instagram-এর advertising performance পরিমাপ এবং relevant advertising
              দেখানোর জন্য Meta Pixel ব্যবহার করা হয়।
            </p>
          </PolicyCard>
        </div>

        <p>এই technologies cookies বা অনুরূপ tracking technologies ব্যবহার করতে পারে।</p>
      </PolicySection>

      <PolicySection title="Marketing Communications">
        <p>আপনার অনুমতি বা প্রযোজ্য নিয়ম অনুযায়ী আমরা আপনাকে Brownmoor.com-এর:</p>
        <PolicyList
          items={[
            'Promotional WhatsApp messages',
            'নতুন পণ্যের announcements',
            'বিশেষ offers বা updates',
          ]}
        />
        <p>সম্পর্কে জানাতে যোগাযোগ করতে পারি।</p>
        <p>
          আপনি যেকোনো সময় এই ধরনের marketing communication বন্ধ করার অনুরোধ করতে পারেন। এজন্য
          আমাদের Customer Support-এর সঙ্গে ফোনে বা WhatsApp-এর মাধ্যমে যোগাযোগ করুন।
        </p>
        <PolicyCard>
          <p>
            <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
              {CONTACT.hotline.display}
            </a>
          </p>
        </PolicyCard>
      </PolicySection>

      <PolicySection title="Facebook ও Instagram Retargeting">
        <p>
          আপনার website interaction-এর ভিত্তিতে Brownmoor.com Facebook ও Instagram-এর মাধ্যমে
          আপনাকে relevant advertisements দেখাতে পারে।
        </p>
        <p>এটি আমাদের website-এ ব্যবহৃত Meta Pixel-এর মাধ্যমে করা হতে পারে।</p>
        <p>
          এই ধরনের advertising বন্ধ বা নিয়ন্ত্রণ করার জন্য আপনি আপনার Meta account-এর advertising
          preferences ব্যবহার করতে পারেন।
        </p>
      </PolicySection>

      <PolicySection title="আমরা কার সঙ্গে আপনার তথ্য শেয়ার করি">
        <p>
          Brownmoor.com আপনার personal information{' '}
          <Strong>বিক্রি, ভাড়া বা অপ্রয়োজনীয়ভাবে</Strong> অন্য কোনো ব্যক্তি বা প্রতিষ্ঠানের কাছে
          শেয়ার করে না।
        </p>
        <p>
          তবে আপনার অর্ডার সফলভাবে পৌঁছে দেওয়ার জন্য প্রয়োজনীয় তথ্য courier বা delivery service
          providers-এর সঙ্গে শেয়ার করা হতে পারে।
        </p>
        <p>উদাহরণস্বরূপ, আপনার:</p>
        <PolicyList
          items={['নাম', 'ফোন নম্বর', 'Delivery address', 'অর্ডার সংক্রান্ত প্রয়োজনীয় তথ্য']}
        />
        <p>ডেলিভারি সম্পন্ন করার উদ্দেশ্যে সংশ্লিষ্ট courier service-এর কাছে দেওয়া হতে পারে।</p>
      </PolicySection>

      <PolicySection title="আপনার তথ্যের নিরাপত্তা">
        <p>
          আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে Brownmoor.com যথাযথ security measures গ্রহণ করে।
        </p>
        <p>এর মধ্যে রয়েছে:</p>
        <PolicyList
          items={[
            'Secure HTTPS/SSL connection',
            'Secure order processing practices',
            'Customer information-এর access সীমিত রাখা',
            'Unauthorized access বা misuse প্রতিরোধের জন্য reasonable security measures',
          ]}
        />
        <p>
          তবে internet-এর মাধ্যমে কোনো তথ্য আদান-প্রদান বা electronic storage system-কে সম্পূর্ণ
          ১০০% নিরাপদ বলে নিশ্চয়তা দেওয়া সম্ভব নয়।
        </p>
      </PolicySection>

      <PolicySection title="আপনার তথ্য কতদিন সংরক্ষণ করি">
        <p>
          আপনার তথ্য যতদিন আমাদের legitimate business purposes, customer service, order management,
          accounting বা প্রযোজ্য আইনগত প্রয়োজন পূরণের জন্য প্রয়োজন হয়, ততদিন আমরা সংরক্ষণ করতে
          পারি।
        </p>
        <p>
          যখন কোনো তথ্য আর প্রয়োজনীয় নয়, তখন তা মুছে ফেলা, anonymize করা বা নিরাপদভাবে সংরক্ষণ
          থেকে সরিয়ে দেওয়ার জন্য আমরা reasonable steps গ্রহণ করতে পারি।
        </p>
      </PolicySection>

      <PolicySection title="আপনার অধিকার">
        <p>আপনার ব্যক্তিগত তথ্যের ক্ষেত্রে আপনার কিছু অধিকার রয়েছে। আপনি চাইলে:</p>
        <PolicyList
          items={[
            'আপনার কাছে থাকা personal information সম্পর্কে জানতে চাইতে পারেন',
            'আপনার তথ্যের কোনো ভুল সংশোধনের অনুরোধ করতে পারেন',
            'আপনার personal information মুছে ফেলার অনুরোধ করতে পারেন',
            'আপনার marketing communication বন্ধ করার অনুরোধ করতে পারেন',
            'আপনার তথ্য কীভাবে ব্যবহার করা হচ্ছে সে সম্পর্কে প্রশ্ন করতে পারেন',
          ]}
        />
        <p>এসব বিষয়ে অনুরোধ করতে Brownmoor.com-এর সঙ্গে যোগাযোগ করুন।</p>
      </PolicySection>

      <PolicySection title="শিশুদের গোপনীয়তা">
        <p>Brownmoor.com শিশুদের জন্য তৈরি কোনো website বা service নয়।</p>
        <p>
          আমরা জেনেশুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করার উদ্দেশ্যে আমাদের website
          পরিচালনা করি না।
        </p>
        <p>
          যদি কোনো অভিভাবক বা guardian মনে করেন যে কোনো শিশুর ব্যক্তিগত তথ্য আমাদের কাছে প্রদান করা
          হয়েছে, তাহলে আমাদের সঙ্গে যোগাযোগ করুন। বিষয়টি পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা নেওয়া
          হবে।
        </p>
      </PolicySection>

      <PolicySection title="Third-Party Websites">
        <p>
          Brownmoor.com-এর website বা communication-এর মাধ্যমে কখনো কখনো third-party website বা
          service-এর link থাকতে পারে।
        </p>
        <p>
          এই third-party websites-এর privacy practices Brownmoor.com-এর নিয়ন্ত্রণের বাইরে। তাই কোনো
          external website ব্যবহার করার আগে তাদের নিজস্ব Privacy Policy পড়ে নেওয়ার পরামর্শ দেওয়া
          হচ্ছে।
        </p>
      </PolicySection>

      <PolicySection title="Privacy Policy-তে পরিবর্তন">
        <p>
          সময়ের সঙ্গে আমাদের services, technology বা business practices পরিবর্তন হলে Brownmoor.com
          এই Privacy Policy আপডেট করতে পারে।
        </p>
        <p>
          Privacy Policy-তে গুরুত্বপূর্ণ পরিবর্তন হলে আমরা website-এ updated version প্রকাশ করতে
          পারি এবং প্রয়োজনে WhatsApp বা ফোন কলের মাধ্যমে customers-কে জানাতে পারি।
        </p>
        <p>
          এই page-এর উপরে থাকা কার্যকর তারিখ দেখে আপনি সর্বশেষ Privacy Policy-এর version সম্পর্কে
          জানতে পারবেন।
        </p>
      </PolicySection>

      <PolicySection title="আমাদের সঙ্গে যোগাযোগ করুন">
        <p>
          আপনার personal information, privacy বা এই Privacy Policy সম্পর্কে কোনো প্রশ্ন, অনুরোধ বা
          অভিযোগ থাকলে Brownmoor.com-এর সঙ্গে যোগাযোগ করতে পারেন।
        </p>

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
      </PolicySection>

      <p className="border-t border-line pt-8 text-center text-[15px] leading-[1.9] text-muted md:text-base">
        আপনার privacy এবং আপনার সঙ্গে আমাদের সম্পর্কের বিশ্বাসকে Brownmoor.com গুরুত্ব দেয়।
      </p>
    </PolicyPage>
  )
}
