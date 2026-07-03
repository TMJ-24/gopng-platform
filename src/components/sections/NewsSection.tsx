'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ImageIcon from '@mui/icons-material/ImageOutlined'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

function NewsCard({ item }: { item: any }) {
  const title = typeof item.title === 'object' ? item.title?.en : item.title
  const date = item.publishedDate
    ? new Date(item.publishedDate).toLocaleDateString('en-PG', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const imgSrc = mediaUrl(item.featuredImage?.url)

  return (
    <Box
      component={Link}
      href={`/news/${item.slug}`}
      sx={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', '&:hover .news-card-img': { transform: 'scale(1.04)' }, '&:hover .news-card-title': { color: 'var(--color-primary, #CC0000)' } }}
    >
      {/* Image */}
      <Box sx={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#e8e8e8', flexShrink: 0 }}>
        {imgSrc ? (
          <Box component="img" src={imgSrc} alt={title ?? ''} className="news-card-img" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.25s ease' }} />
        ) : (
          <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0e0e0 0%, #cccccc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon sx={{ fontSize: 40, color: '#999' }} />
          </Box>
        )}
      </Box>

      {/* Text */}
      <Box sx={{ py: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {date && <Typography sx={{ fontSize: '0.875rem', color: '#888888', mb: 1 }}>{date}</Typography>}
        <Typography
          component="h3"
          className="news-card-title"
          sx={{
            fontSize: 'calc(1.275rem + 0.3vw)', fontWeight: 700, color: '#111111', lineHeight: 1.35, mb: 1.5, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.1s',
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'var(--color-primary, #CC0000)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          Read more <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Typography>
      </Box>
    </Box>
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
    <Box component="section" sx={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7.5 }}>

        {/* Section header */}
        <Box sx={{ mb: 4 }}>
          <Typography component="h2" sx={{ fontSize: 'calc(1.325rem + 0.9vw)', fontWeight: 800, color: '#111111', mb: 1.5, letterSpacing: '-0.01em' }}>
            Latest News &amp; Announcements
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 400, color: '#555555', lineHeight: 1.6, maxWidth: 640 }}>
            Official news, press releases and announcements from {site?.name ?? 'the Government of Papua New Guinea'}.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3.5 }}>
            {[1, 2, 3].map(i => (
              <Box key={i}>
                <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '2px' }} />
                <Box sx={{ py: 2 }}>
                  <Skeleton width="30%" height={12} sx={{ mb: 1.25 }} />
                  <Skeleton height={16} sx={{ mb: 0.75 }} />
                  <Skeleton width="70%" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : news.length === 0 ? (
          <Typography sx={{ py: 5, color: '#888888', fontSize: 14 }}>No news published yet.</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3.5 }}>
            {news.map((item: any) => <NewsCard key={item.id} item={item} />)}
          </Box>
        )}

        {/* View all link */}
        {news.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Typography component={Link} href="/news" sx={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary, #CC0000)', textDecoration: 'none' }}>
              View all news →
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
