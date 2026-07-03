'use client'

import Link from 'next/link'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

export function MinistryHero() {
  const site = useSite()
  if (!site) return null

  const logoSrc = mediaUrl(site.logo?.url)

  return (
    <section style={{ background: '#1a2b4a', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        {logoSrc && (
          <img src={logoSrc} alt="" style={{ width: 64, height: 64, objectFit: 'contain', margin: '0 auto 24px', display: 'block' }} />
        )}
        <span style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent, #FF9900)', marginBottom: 14 }}>
          Government of Papua New Guinea
        </span>
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
          {site.name}
        </h1>
        <div style={{ width: 64, height: 3, background: 'var(--color-primary, #CC0000)', margin: '0 auto 20px' }} />
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
          Delivering national policy, programmes and services within our portfolio for the people
          of Papua New Guinea.
        </p>
        <Link
          href="/about"
          style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--color-primary, #CC0000)', color: '#FFFFFF', fontWeight: 700, fontSize: 14, borderRadius: 2, textDecoration: 'none' }}
        >
          Our Mandate
        </Link>
      </div>
    </section>
  )
}
