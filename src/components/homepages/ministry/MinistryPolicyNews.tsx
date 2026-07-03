'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'

export function MinistryPolicyNews() {
  const site = useSite()
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/news?where[site][equals]=${site.id}&where[status][equals]=published&sort=-publishedDate&limit=5&depth=0`)
      .then(r => r.json())
      .then(data => { setNews(data.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [site?.id])

  return (
    <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: '#1a2b4a', margin: 0, letterSpacing: '-0.01em' }}>
            Policy &amp; Ministerial News
          </h2>
          <Link href="/news" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary, #CC0000)', textDecoration: 'none' }}>All news →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 64, background: '#E4E6E8', borderRadius: 4 }} />)}
          </div>
        ) : news.length === 0 ? (
          <div style={{ padding: '32px 0', color: '#687078', fontSize: 14 }}>No policy news published yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {news.map((item: any) => {
              const title = typeof item.title === 'object' ? item.title?.en : item.title
              const summary = typeof item.summary === 'object' ? item.summary?.en : item.summary
              const date = item.publishedDate
                ? new Date(item.publishedDate).toLocaleDateString('en-PG', { day: 'numeric', month: 'long', year: 'numeric' })
                : ''
              return (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  style={{ display: 'flex', gap: 24, padding: '20px 0', borderBottom: '1px solid #D5DBDB', textDecoration: 'none' }}
                  className="ministry-news-row"
                >
                  <div style={{ flexShrink: 0, width: 100, fontSize: 12, color: '#687078', fontWeight: 600, paddingTop: 3 }}>{date}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#000716', marginBottom: 4 }}>{title}</div>
                    {summary && <div style={{ fontSize: 13, color: '#545B64', lineHeight: 1.6 }}>{summary}</div>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <style>{`.ministry-news-row:hover > div:last-child > div:first-child { color: var(--color-primary, #CC0000) !important; }`}</style>
    </section>
  )
}
