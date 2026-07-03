'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { RichText } from '@/components/RichText'
import { PageBanner } from '@/components/PageBanner'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

const QUICK_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'About Us',     href: '/about' },
  { label: 'What We Do',   href: '/what-we-do' },
  { label: 'News',         href: '/news' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact Us',   href: '/contact' },
]

export default function CmsPage() {
  const site = useSite()
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') === 'tpi' ? 'tpi' : 'en'

  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!site?.id || !slug) return
    fetch(`/api/pages?where[site][equals]=${site.id}&where[slug][equals]=${slug}&depth=1&locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        const doc = data.docs?.[0] ?? null
        if (!doc) setMissing(true)
        else setPage(doc)
        setLoading(false)
      })
      .catch(() => { setMissing(true); setLoading(false) })
  }, [site?.id, slug, locale])

  if (missing) notFound()
  if (!site) return null

  return (
    <>
      <PageBanner
        title={loading ? '…' : (page?.title ?? '')}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: loading ? '…' : (page?.title ?? '') }]}
      />

      <div style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>

          {/* Main */}
          <article style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: '32px', boxShadow: '0 1px 2px rgba(0,28,36,0.08)', minHeight: 192 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[100, 90, 80, 95, 70].map((w, i) => (
                  <div key={i} style={{ height: 14, background: '#F2F3F3', borderRadius: 4, width: `${w}%` }} />
                ))}
              </div>
            ) : page?.layout?.length ? (
              <BlockRenderer blocks={page.layout} />
            ) : (
              <RichText content={page?.content} />
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#687078', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>Quick Links</h3>
              <nav style={{ display: 'flex', flexDirection: 'column' }}>
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#545B64', padding: '8px 0', borderBottom: '1px solid #F2F3F3', textDecoration: 'none', transition: 'color 0.1s' }}
                    className="sidebar-link"
                  >
                    <span style={{ color: '#0972D3', fontSize: 14 }}>›</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: 24, boxShadow: '0 1px 2px rgba(0,28,36,0.08)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: '0 0 8px' }}>Need Help?</h3>
              <p style={{ fontSize: 13, color: '#545B64', marginBottom: 16, lineHeight: 1.5 }}>
                Can&apos;t find what you&apos;re looking for? Our team is happy to assist.
              </p>
              <Link
                href="/contact"
                style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, padding: '9px 18px', background: '#0972D3', color: '#FFFFFF', borderRadius: 4, textDecoration: 'none', border: '1px solid #0972D3' }}
              >
                Contact Us →
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <style>{`.sidebar-link:hover { color: #0972D3 !important; }`}</style>
    </>
  )
}
