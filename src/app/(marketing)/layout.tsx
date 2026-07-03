import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { GovBanner } from '@/components/marketing/GovBanner'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { BackToTop } from '@/components/marketing/BackToTop'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'GoPNG Website Platform', template: '%s | GoPNG Website Platform' },
  description: 'Digital platform for the Government of Papua New Guinea — provision, manage and publish official agency websites.',
}

// A separate root layout (its own <html>/<body>) from (payload)'s Payload-generated one —
// these public-facing "about the platform" pages need their own font and chrome without
// touching Payload's auto-regenerated admin layout.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        <GovBanner />
        <MarketingNav />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
        <MarketingFooter />
        <BackToTop />
      </body>
    </html>
  )
}
