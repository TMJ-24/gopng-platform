import { headers } from 'next/headers'
import { Suspense } from 'react'
import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getSiteByDomain, getThemeColors } from '@/lib/tenant'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteProvider } from '@/components/SiteProvider'
import { BackToTop } from '@/components/BackToTop'
import { Analytics } from '@/components/Analytics'
import './styles.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

type Props = {
  children: React.ReactNode
  searchParams?: Promise<{ locale?: string }>
}

/* ── Open Graph + title template for every page ──────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const domain = host.replace(/:\d+$/, '')
  const site = await getSiteByDomain(domain)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (domain.startsWith('localhost') ? 'http://localhost:3000' : `https://${domain}`)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${site?.name ?? 'GoPNG'}`,
      default: site?.name ?? 'Government of Papua New Guinea',
    },
    description: `Official website of ${site?.name ?? 'the Government of Papua New Guinea'}. Find news, publications, services and contact information.`,
    icons: site?.logo?.url
      ? {
          icon:             [{ url: site.logo.url, type: 'image/png' }],
          apple:            [{ url: site.logo.url }],
          shortcut:         [{ url: site.logo.url }],
        }
      : undefined,
    openGraph: {
      type: 'website',
      siteName: site?.name ?? 'GoPNG',
      locale: 'en_PG',
      images: site?.logo?.url
        ? [{ url: site.logo.url, width: 400, height: 400, alt: site.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
    other: {
      'format-detection': 'telephone=no',
    },
  }
}

export default async function RootLayout({ children, searchParams }: Props) {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const domain = host.replace(/:\d+$/, '')
  const params = await searchParams
  const locale = params?.locale === 'tpi' ? 'tpi' : 'en'

  const site = await getSiteByDomain(domain, locale)

  if (!site) {
    return (
      <html lang="en" className={inter.className}>
        <body className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <div className="text-6xl font-black text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-800">Site not found</h1>
            <p className="text-gray-400 mt-2 text-sm">
              No site is configured for <code className="bg-gray-100 px-1 rounded">{domain}</code>
            </p>
          </div>
        </body>
      </html>
    )
  }

  const colors = getThemeColors(site.theme)

  const themeVars = {
    '--color-primary':   colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent':    colors.accent,
  } as React.CSSProperties

  return (
    <html lang={locale === 'tpi' ? 'tpi' : 'en'} style={themeVars} className={`${inter.variable} ${inter.className}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <SiteProvider site={site}>
          <Suspense>
            <SiteNav site={site} locale={locale} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter site={site} />
          <BackToTop />
        </SiteProvider>

        {/* Analytics — loads after interactive, never blocks paint */}
        <Analytics />
      </body>
    </html>
  )
}
