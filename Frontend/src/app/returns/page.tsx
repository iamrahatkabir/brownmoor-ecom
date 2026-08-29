import type { Metadata } from 'next'

import {
  PolicyBody,
  PolicyCard,
  PolicyList,
  PolicyNotice,
  PolicyPage,
  PolicySection,
  Strong,
} from '@/components/PolicyPage'
import { CONTACT } from '@/lib/contact'

export const metadata: Metadata = {
  description:
    'Brownmoor.com-এর Return, Replacement, Exchange, Refund এবং Warranty সংক্রান্ত নীতিমালা। পণ্য গ্রহণের সময় কী দেখতে হবে এবং কীভাবে request করবেন।',
  title: 'Returns & Warranty Policy',
}

const EFFECTIVE_DATE = '২৯ আগস্ট ২০২৬'

/** Repeated verbatim in three sections, so it is written once. */
function SupportLines({ label = 'Phone / WhatsApp' }: { label?: string }) {
  return (
    <>
      <p className="flex flex-wrap gap-x-2">
        <span className="font-medium text-ink">{label}:</span>
        <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
          {CONTACT.hotline.display}
        </a>
      </p>
      <p className="flex flex-wrap gap-x-2">
        <span className="font-medium text-ink">Email:</span>
        <a className="break-all text-ink underline underline-offset-4" href={CONTACT.email.url}>
          {CONTACT.email.address}
        </a>
      </p>
    </>
  )
}

export default function ReturnsPage() {
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
                Brownmoor.com-এ আমরা চাই আপনি আপনার কেনাকাটায় সম্পূর্ণ সন্তুষ্ট থাকুন। পণ্য হাতে
                পাওয়ার পর কোনো সমস্যা থাকলে আমাদের Returns &amp; Warranty Policy অনুযায়ী আমরা
                Return, Replacement অথবা Exchange-এর ব্যবস্থা করে থাকি।
              </p>
              <p>
                অনুগ্রহ করে অর্ডার করার আগে এবং পণ্য গ্রহণের সময় নিচের নীতিমালাটি ভালোভাবে পড়ে নিন।
              </p>
            </PolicyBody>
          </div>
        </>
      }
      title="Returns & Warranty Policy"
    >
      <PolicySection title="Return করার ক্ষেত্রে প্রযোজ্য কারণ">
        <p>নিচের যেকোনো কারণে আপনি Brownmoor.com-এ Return request করতে পারবেন:</p>
        <PolicyList
          items={[
            'পণ্য damaged অবস্থায় পৌঁছালে',
            'ভুল পণ্য পাঠানো হলে',
            'পণ্য defective বা faulty হলে',
            'পণ্য website-এর ছবি বা description-এর সঙ্গে significantly different হলে',
            'পণ্যের size বা color পছন্দ না হলে',
            'Change of mind — পণ্য পাওয়ার পর আপনার সিদ্ধান্ত পরিবর্তন হলে',
          ]}
        />
        <p>
          তবে Change of Mind বা Size/Color-এর ক্ষেত্রে পণ্য অবশ্যই আমাদের Return Conditions পূরণ
          করতে হবে।
        </p>
      </PolicySection>

      <PolicySection title="গুরুত্বপূর্ণ: পণ্য গ্রহণের সময় অবশ্যই পরীক্ষা করুন">
        <p>
          আপনার অর্ডার হাতে পাওয়ার সময় delivery person-এর উপস্থিতিতে পণ্যটি পরীক্ষা করে নেওয়ার
          জন্য আমরা বিশেষভাবে অনুরোধ করছি।
        </p>
        <p>পণ্যটি damaged বা ভাঙা অবস্থায় থাকলে delivery person-এর সামনে বিষয়টি জানান।</p>

        <PolicyNotice title="Unboxing video">
          <p>
            যদি delivery person-এর সামনে পণ্য পরীক্ষা করা সম্ভব না হয়, তাহলে অবশ্যই unboxing-এর
            সম্পূর্ণ ভিডিও ধারণ করুন।
          </p>
          <p>
            <Strong>
              Unboxing video ছাড়া পরবর্তীতে damaged product-এর Return request গ্রহণ করা হবে না।
            </Strong>
          </p>
        </PolicyNotice>

        <p>
          এটি বিশেষভাবে গুরুত্বপূর্ণ, কারণ পণ্যটি delivery-এর সময় damaged ছিল নাকি delivery গ্রহণের
          পর damaged হয়েছে—তা যাচাই করার জন্য unboxing video প্রয়োজন হতে পারে।
        </p>
      </PolicySection>

      <PolicySection title="Return-এর জন্য পণ্যের শর্ত">
        <p>Return গ্রহণের জন্য পণ্যটি অবশ্যই:</p>
        <PolicyList
          items={[
            'Unused হতে হবে',
            'Unwashed হতে হবে',
            'Original packaging-সহ থাকতে হবে',
            'Original tags/labels থাকলে সেগুলো অক্ষত থাকতে হবে',
            'কোনো অতিরিক্ত scratch, damage বা ব্যবহারজনিত চিহ্ন থাকা যাবে না',
          ]}
        />
        <p>
          ব্যবহৃত, ধোয়া বা ক্ষতিগ্রস্ত অবস্থায় ফেরত দেওয়া পণ্য সাধারণ Return-এর আওতায় গ্রহণ করা
          হবে না।
        </p>
      </PolicySection>

      <PolicySection title="Return Delivery Charge">
        <p>
          যেকোনো Return-এর ক্ষেত্রে{' '}
          <Strong>Return delivery charge customer-কে বহন করতে হবে</Strong>।
        </p>
        <p>
          Return request অনুমোদিত হওয়ার পর পণ্যটি Brownmoor.com-এ ফেরত পাঠানোর জন্য প্রযোজ্য
          delivery charge customer-এর দায়িত্বে থাকবে।
        </p>
      </PolicySection>

      <PolicySection title="Replacement & Exchange">
        <p>Return request অনুমোদিত হলে প্রযোজ্য ক্ষেত্রে আমরা:</p>
        <PolicyList
          items={[
            'একই পণ্যের Replacement',
            'অন্য পণ্যের সঙ্গে Exchange',
            'অথবা প্রযোজ্য ক্ষেত্রে Refund',
          ]}
        />
        <p>এর ব্যবস্থা করতে পারি।</p>
        <p>Replacement বা Exchange পণ্যের availability-এর ওপর নির্ভর করবে।</p>
      </PolicySection>

      <PolicySection title="Refund Policy">
        <p>
          Return করা পণ্য আমাদের কাছে পৌঁছানোর পর সেটি আমাদের Return Conditions পূরণ করছে কি না তা
          যাচাই করা হবে।
        </p>
        <p>
          Return অনুমোদিত হলে সাধারণত{' '}
          <Strong>১–৫ কর্মদিবসের মধ্যে</Strong> refund process করা হবে।
        </p>
        <p>Refund-এর পদ্ধতি এবং প্রক্রিয়া আমাদের Customer Support টিম আপনাকে জানিয়ে দেবে।</p>
      </PolicySection>

      <PolicySection title="Warranty Policy">
        <p>Brownmoor.com-এর সব পণ্যে warranty প্রযোজ্য নয়।</p>
        <p>
          যে সকল পণ্যে warranty রয়েছে, সেই warranty-এর সময়কাল ও শর্ত সংশ্লিষ্ট product
          description-এ স্পষ্টভাবে উল্লেখ করা থাকবে।
        </p>
        <p>
          সাধারণভাবে কিছু electronics product-এর ক্ষেত্রে{' '}
          <Strong>৭ দিনের Replacement Warranty</Strong> থাকতে পারে।
        </p>
        <p>
          Warranty-এর সঠিক সময়কাল ও coverage জানার জন্য অর্ডার করার আগে সংশ্লিষ্ট product
          description দেখে নিন।
        </p>
      </PolicySection>

      <PolicySection title="Warranty সাধারণত কীসের জন্য প্রযোজ্য?">
        <p>
          Warranty প্রযোজ্য হলে তা সাধারণত manufacturing বা functional defect-এর মতো সমস্যার
          ক্ষেত্রে প্রযোজ্য হবে।
        </p>
        <p>
          Physical damage, misuse, improper use বা customer-এর কারণে সৃষ্ট damage warranty-এর আওতায়
          নাও পড়তে পারে।
        </p>
        <p>
          প্রতিটি product-এর warranty terms আলাদা হতে পারে এবং product description-এ উল্লেখিত
          terms-ই প্রযোজ্য হবে।
        </p>
      </PolicySection>

      <PolicySection title="Warranty Claim করার নিয়ম">
        <p>
          Warranty প্রযোজ্য কোনো পণ্যে সমস্যা দেখা দিলে আমাদের Customer Support-এর সঙ্গে যোগাযোগ
          করুন:
        </p>
        <PolicyCard>
          <div className="space-y-1">
            <SupportLines label="WhatsApp / Phone" />
          </div>
        </PolicyCard>
        <p>
          Warranty claim-এর ক্ষেত্রে আমাদের টিম সমস্যাটি যাচাই করার জন্য প্রয়োজনীয় তথ্য চাইতে
          পারে।
        </p>
      </PolicySection>

      <PolicySection title="Return ও Warranty Claim-এর জন্য যা প্রয়োজন হতে পারে">
        <p>আপনার Return বা Warranty request যাচাই করার জন্য আমাদের প্রয়োজন হতে পারে:</p>
        <PolicyList
          items={[
            'Order invoice',
            'Product-এর ছবি',
            'Product-এর ভিডিও',
            'Unboxing video',
            'সমস্যার বিস্তারিত বিবরণ',
          ]}
        />
        <p>
          বিশেষ করে damaged product-এর ক্ষেত্রে delivery person-এর সামনে পণ্য পরীক্ষা করা অথবা
          complete unboxing video থাকা অত্যন্ত গুরুত্বপূর্ণ।
        </p>
      </PolicySection>

      <PolicySection title="Order Cancellation">
        <p>আপনি আপনার order dispatch হওয়ার আগে cancellation request করতে পারবেন।</p>
        <p>
          Order dispatch হয়ে যাওয়ার পর order cancel করতে চাইলে cancellation সম্ভব হতে পারে, তবে
          সেক্ষেত্রে প্রযোজ্য delivery charge customer-কে বহন করতে হবে।
        </p>
        <p>Order cancellation-এর জন্য যত দ্রুত সম্ভব আমাদের Customer Support-এর সঙ্গে যোগাযোগ করুন।</p>
        <PolicyCard>
          <p>
            <a className="text-ink underline underline-offset-4" href={CONTACT.hotline.url}>
              {CONTACT.hotline.display}
            </a>
          </p>
        </PolicyCard>
      </PolicySection>

      <PolicySection title="Return Request কীভাবে করবেন">
        <p>
          Return, Replacement, Exchange অথবা Warranty claim-এর জন্য আমাদের সঙ্গে যোগাযোগ করুন:
        </p>
        <PolicyCard>
          <div className="space-y-1">
            <SupportLines />
            <p className="flex flex-wrap gap-x-2">
              <span className="font-medium text-ink">Customer Support Hours:</span>
              <span>সকাল ৯টা – রাত ১১টা</span>
            </p>
          </div>
        </PolicyCard>
        <p>
          আপনার Order Invoice এবং প্রয়োজনীয় product photos/videos প্রস্তুত রাখলে আমাদের টিম আপনার
          request দ্রুত যাচাই করতে পারবে।
        </p>
      </PolicySection>

      <PolicySection title="একটি গুরুত্বপূর্ণ অনুরোধ">
        <p>
          Brownmoor.com থেকে আপনার অর্ডার গ্রহণ করার সময় কয়েক মুহূর্ত সময় নিয়ে পণ্যটি delivery
          person-এর সামনে পরীক্ষা করুন।
        </p>
        <p>
          কোনো সমস্যা দেখতে পেলে তখনই জানান। আর যদি delivery person-এর সামনে পণ্য পরীক্ষা করা সম্ভব
          না হয়, তাহলে প্যাকেট খোলার শুরু থেকে শেষ পর্যন্ত একটি সম্পূর্ণ unboxing video ধারণ করুন।
        </p>
        <p>এটি আপনার Return বা Replacement request-এর ক্ষেত্রে গুরুত্বপূর্ণ প্রমাণ হিসেবে কাজ করবে।</p>
      </PolicySection>

      <PolicySection title="আমাদের সঙ্গে যোগাযোগ করুন">
        <div className="rounded-lg bg-wash p-5 md:p-6">
          <p className="text-base font-semibold text-ink">Brownmoor.com</p>
          <p className="mt-1 text-[15px]">Arshinagar, Bosila, Mohammadpur, Dhaka</p>

          <div className="mt-4 space-y-2 text-[15px]">
            <SupportLines />
            <p className="flex flex-wrap gap-x-2">
              <span className="font-medium text-ink">Customer Support:</span>
              <span>সকাল ৯টা – রাত ১১টা</span>
            </p>
          </div>
        </div>
      </PolicySection>
    </PolicyPage>
  )
}
