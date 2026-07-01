import Link from 'next/link'
import Image from 'next/image'

type NewsItem = {
  slug: string
  title: string
  summary?: string
  publishedDate?: string
  featuredImage?: { url: string; alt?: string }
}

export function NewsCard({ item }: { item: NewsItem }) {
  const date = item.publishedDate
    ? new Date(item.publishedDate).toLocaleDateString('en-PG', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <Link
      href={`/news/${item.slug}`}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#FFFFFF',
        border: '1px solid #D5DBDB',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,28,36,0.08)',
        transition: 'box-shadow 0.12s, border-color 0.12s',
      }}
      className="news-card-link"
    >
      {item.featuredImage?.url && (
        <div style={{ position: 'relative', height: 192, background: '#F2F3F3', overflow: 'hidden' }}>
          <Image
            src={item.featuredImage.url}
            alt={item.featuredImage.alt || item.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ padding: '18px 20px' }}>
        {date && (
          <time style={{ fontSize: 12, color: '#687078', fontWeight: 600 }}>{date}</time>
        )}
        <h3 style={{ marginTop: 6, marginBottom: 0, fontSize: 14, fontWeight: 700, color: '#000716', lineHeight: 1.4 }} className="line-clamp-2">
          {item.title}
        </h3>
        {item.summary && (
          <p style={{ marginTop: 6, fontSize: 13, color: '#545B64', lineHeight: 1.55 }} className="line-clamp-3">
            {item.summary}
          </p>
        )}
        <span style={{ display: 'inline-block', marginTop: 14, fontSize: 12, fontWeight: 700, color: '#0972D3' }}>
          Read more →
        </span>
      </div>
      <style>{`.news-card-link:hover { box-shadow: 0 2px 8px rgba(9,114,211,0.14); }`}</style>
    </Link>
  )
}
