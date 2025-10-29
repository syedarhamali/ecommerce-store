import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ecommerce Store - Modern Shopping Experience',
  description: 'Discover amazing products with our modern ecommerce platform featuring secure payments and fast delivery.',
  keywords: 'ecommerce, shopping, online store, products, fashion, electronics',
  authors: [{ name: 'Ecommerce Store Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Ecommerce Store - Modern Shopping Experience',
    description: 'Discover amazing products with our modern ecommerce platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Store - Modern Shopping Experience',
    description: 'Discover amazing products with our modern ecommerce platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
