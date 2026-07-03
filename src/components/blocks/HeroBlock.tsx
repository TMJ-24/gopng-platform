'use client'

import Link from 'next/link'
import { mediaUrl } from '@/lib/media'

type HeroBlockData = {
  heading: string
  subheading?: string
  image?: { url?: string; alt?: string }
  ctaLabel?: string
  ctaHref?: string
}

const HERO_BG = '#F4E9F6'

export function HeroBlock({ block }: { block: HeroBlockData }) {
  const imgSrc = mediaUrl(block.image?.url)
  const textColor = imgSrc ? '#FFFFFF' : '#1a2b4a'
  const subTextColor = imgSrc ? 'rgba(255,255,255,0.85)' : '#555555'

  return (
    <section
      style={{
        background: imgSrc ? `linear-gradient(rgba(0,7,22,0.55), rgba(0,7,22,0.55)), url(${imgSrc}) center/cover` : HERO_BG,
        borderRadius: 12,
        padding: '56px 40px',
        marginBottom: 24,
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: textColor, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        {block.heading}
      </h2>
      {block.subheading && (
        <p style={{ fontSize: 15, color: subTextColor, maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.6 }}>
          {block.subheading}
        </p>
      )}
      {block.ctaLabel && block.ctaHref && (
        <Link
          href={block.ctaHref}
          style={{
            display: 'inline-flex', alignItems: 'center', padding: '10px 22px', borderRadius: 4,
            textDecoration: 'none', background: 'var(--color-primary, #CC0000)', color: '#FFFFFF', fontSize: 14, fontWeight: 700,
          }}
        >
          {block.ctaLabel} →
        </Link>
      )}
    </section>
  )
}
