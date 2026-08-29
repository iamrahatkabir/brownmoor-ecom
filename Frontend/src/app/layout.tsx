import type { Metadata } from 'next'
import { Geist, Noto_Sans_Bengali } from 'next/font/google'

import { CartProvider } from '@/components/CartProvider'
import { FacebookPixel } from '@/components/FacebookPixel'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getCategoryTree } from '@/lib/payload'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

/**
 * Geist carries no Bengali glyphs, so Bangla fell through to whatever face the
 * device happened to have — Kohinoor on an iPhone, something else on Android,
 * and occasionally a tofu box. Loading it explicitly makes Bangla render the
 * same everywhere, which matters when most of the shop's customers read it.
 *
 * Font fallback is per glyph, so Latin still resolves to Geist and only Bengali
 * characters reach this face.
 */
const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
})

export const metadata: Metadata = {
  description:
    'Kitchenware built to be used every day. Cookware, cutlery and bakeware, delivered across Bangladesh with cash on delivery.',
  title: {
    default: 'Brownmoor.com — Kitchenware',
    template: '%s | Brownmoor.com',
  },
}

/**
 * The category tree is fetched once here rather than in each page, so the
 * header and footer stay consistent and a page render costs one query for
 * navigation instead of two.
 */
export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const categories = await getCategoryTree()

  return (
    <html className={`${geistSans.variable} ${notoBengali.variable} h-full antialiased`} lang="en">
      {/* Browser extensions (ColorZilla, password managers, translators) add
          their own attributes to <body> before React hydrates, which reads as
          a mismatch. This silences that for this element's own attributes; it
          does not extend to children, so real mismatches still surface. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <CartProvider>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </CartProvider>
        <FloatingWhatsApp />
        <FacebookPixel />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
