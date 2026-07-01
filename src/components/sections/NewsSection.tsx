'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'

function NewsCard({ item }: { item: any }) {
  const [hovered, setHovered] = useState(false)
  const title = typeof item.title === 'object' ? item.title?.en : item.title
  const summary = typeof item.summary === 'object' ? item.summary?.en : item.summary
  const date = item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('en-PG', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  return (
    <Link
      href={`/news/${item.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#0972D3' : '#D5DBDB'}`,
        borderRadius: 4,
        padding: '20px',
        height: '100%',
        boxShadow: hovered ? '0 2px 8px rgba(9,114,211,0.12)' : '0 1px 2px rgba(0,28,36,0.06)',
        transition: 'all 0.12s',
        display: 'flex', flexDirection: 'column',
      }}>
        {date && (
          <div style={{ fontSize: 11, fontWeight: 700, color: '#687078', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{date}</div>
        )}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: hovered ? '#0972D3' : '#000716', lineHeight: 1.4, marginBottom: 10, flex: 1, transition: 'color 0.12s' }}
          className="line-clamp-3">
          {title}
        </h3>
        {summary && (
          <p style={{ fontSize: 13, color: '#545B64', lineHeight: 1.6, marginBottom: 14 }} className="line-clamp-2">{summary}</p>
        )}
        <span style={{ fontSize: 12, fontWeight: 700, color: hovered ? '#033160' : '#0972D3', transition: 'color 0.12s' }}>Read more →</span>
      </div>
    </Link>
  )
}

export function NewsSection() {
  const site = useSite()
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/news?where[site][equals]=${site.id}&where[status][equals]=published&sort=-publishedDate&limit=3&depth=1`)
      .then(r => r.json())
      .then(data => { setNews(data.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [site?.id])

  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>Newsroom</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>Latest News &amp; Announcements</h2>
          </div>
          <Link href="/news" style={{ fontSize: 13, fontWeight: 700, color: '#0972D3', textDecoration: 'none' }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 200, background: '#F2F3F3', borderRadius: 4, border: '1px solid #D5DBDB' }} />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#687078', fontSize: 14 }}>No news published yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {news.map((item: any) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  )
}
