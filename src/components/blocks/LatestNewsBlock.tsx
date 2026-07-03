'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'

type LatestNewsBlockData = {
  heading?: string
  count?: number
}

export function LatestNewsBlock({ block }: { block: LatestNewsBlockData }) {
  const site = useSite()
  const count = block.count ?? 3
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/news?where[site][equals]=${site.id}&where[status][equals]=published&sort=-publishedDate&limit=${count}&depth=1`)
      .then(r => r.json())
      .then(data => { setNews(data.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [site?.id, count])

  if (!loading && news.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 14px' }}>{block.heading ?? 'Latest News'}</h3>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ height: 14, background: '#F2F3F3', borderRadius: 4, width: `${90 - i * 10}%` }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {news.map((item: any) => {
            const title = typeof item.title === 'object' ? item.title?.en : item.title
            const date = item.publishedDate
              ? new Date(item.publishedDate).toLocaleDateString('en-PG', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''
            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0',
                  borderBottom: '1px solid #F2F3F3', textDecoration: 'none', color: '#0972D3', fontSize: 14, fontWeight: 600,
                }}
              >
                <span>{title}</span>
                {date && <span style={{ color: '#687078', fontWeight: 400, flexShrink: 0 }}>{date}</span>}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
