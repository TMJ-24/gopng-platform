'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

function NewsCard({ item }: { item: any }) {
  const title = typeof item.title === 'object' ? item.title?.en : item.title
  const date = item.publishedDate
    ? new Date(item.publishedDate).toLocaleDateString('en-PG', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const imgSrc = mediaUrl(item.featuredImage?.url)

  return (
    <Link href={`/news/${item.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }} className="news-card">
      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#e8e8e8', flexShrink: 0 }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.25s ease' }}
            className="news-card-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0e0e0 0%, #cccccc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect x="4" y="8" width="32" height="24" rx="2" fill="#bbbbbb" />
              <circle cx="14" cy="16" r="4" fill="#999" />
              <path d="M4 28l8-8 6 6 5-5 9 7" stroke="#999" strokeWidth="2" fill="none" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: '16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {date && (
          <span style={{ fontSize: '0.875rem', color: '#888888', marginBottom: 8, display: 'block' }}>{date}</span>
        )}
        <h3 style={{ fontSize: 'calc(1.275rem + 0.3vw)', fontWeight: 700, color: '#111111', lineHeight: 1.35, margin: '0 0 12px', flex: 1 }} className="news-card-title line-clamp-3">
          {title}
        </h3>
        <span style={{ fontSize: 13, color: 'var(--color-primary, #CC0000)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Read more
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <style>{`
        .news-card:hover .news-card-img { transform: scale(1.04); }
        .news-card:hover .news-card-title { color: var(--color-primary, #CC0000); }
      `}</style>
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
    <section style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px' }}>

        {/* Section header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: '"Roboto", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontSize: 'calc(1.325rem + 0.9vw)', fontWeight: 800, color: '#111111', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Latest News &amp; Announcements
          </h2>
          <p style={{ fontFamily: '"Roboto", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontSize: '1rem', fontWeight: 400, color: '#555555', margin: 0, lineHeight: 1.6, maxWidth: 640 }}>
            Official news, press releases and announcements from {site?.name ?? 'the Government of Papua New Guinea'}.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#eeeeee', borderRadius: 2 }} />
                <div style={{ padding: '16px 0' }}>
                  <div style={{ height: 12, width: 80, background: '#e0e0e0', borderRadius: 2, marginBottom: 10 }} />
                  <div style={{ height: 16, background: '#e8e8e8', borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ height: 16, width: '70%', background: '#e8e8e8', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div style={{ padding: '40px 0', color: '#888888', fontSize: 14 }}>No news published yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
            {news.map((item: any) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}

        {/* View all link */}
        {news.length > 0 && (
          <div style={{ marginTop: 32, textAlign: 'right' }}>
            <Link href="/news" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary, #CC0000)', textDecoration: 'none' }}>
              View all news →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
