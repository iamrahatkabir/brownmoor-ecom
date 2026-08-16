import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import { CartProvider } from '@/components/CartProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getCategoryTree } from '@/lib/payload'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  description:
    'Kitchenware built to be used every day. Cookware, cutlery and bakeware, delivered across Bangladesh with cash on delivery.',
  title: {
    default: 'Brownmoor — Kitchenware',
    template: '%s | Brownmoor',
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
    <html className={`${geistSans.variable} h-full antialiased`} lang="en">
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </CartProvider>
      </body>
    </html>
  )
}
