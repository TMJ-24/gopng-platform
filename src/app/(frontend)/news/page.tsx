'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { NewsCard } from '@/components/NewsCard'
import { PageBanner } from '@/components/PageBanner'

export default function NewsPage() {
  const site = useSite()
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = searchParams.get('locale') === 'tpi' ? 'tpi' : 'en'
  const currentPage = Number(searchParams.get('page') ?? 1)

  const [news, setNews] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!site?.id) return
    setLoading(true)
    fetch(`/api/news?where[site][equals]=${site.id}&where[status][equals]=published&sort=-publishedDate&limit=9&page=${currentPage}&depth=1&locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        setNews(data.docs ?? [])
        setTotalPages(data.totalPages ?? 1)
        setTotalDocs(data.totalDocs ?? 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [site?.id, currentPage, locale])

  if (!site) return null

  return (
    <>
      <PageBanner
        title="News & Media"
        subtitle="Official news, press releases and announcements."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News & Media' }]}
        searchPlaceholder="Start typing to search"
      />

      <div style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, height: 240 }} />
              ))}
            </div>
          ) : news.length === 0 ? (
            <p style={{ color: '#687078', textAlign: 'center', padding: '64px 0', fontSize: 15 }}>No news articles published yet.</p>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {news.map((item: any) => <NewsCard key={item.id} item={item} />)}
              </div>

              {totalPages > 1 && (
                <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => router.push(`?page=${p}`)}
                      style={{
                        padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.1s',
                        background: p === currentPage ? '#0972D3' : '#FFFFFF',
                        color: p === currentPage ? '#FFFFFF' : '#000716',
                        border: p === currentPage ? '1px solid #0972D3' : '1px solid #D5DBDB',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
