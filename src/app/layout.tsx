import type { Metadata } from 'next'
import './globals.css'
import { seo, siteConfig } from '@/lib/config'
import Script from 'next/script'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: 'Katharos Systems' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: seo.title,
    description: seo.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Katharos Systems - Truth as a Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: ['/og-image.jpg'],
    creator: '@katharosai',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics - Privacy-friendly */}
        <Script
          defer
          data-domain="katharossystems.ai"
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
