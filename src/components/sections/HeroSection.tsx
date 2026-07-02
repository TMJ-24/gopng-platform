'use client'

import Link from 'next/link'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

export function HeroSection() {
  const site = useSite()

  if (!site) return null

  const heroSrc = mediaUrl(site.heroImage?.url)

  return (
    <section style={{ display: 'flex', minHeight: 420, overflow: 'hidden' }}>

      {/* ── Left panel — solid brand colour ─────────── */}
      <div style={{
        flex: '0 0 50%',
        background: 'var(--color-primary, #CC0000)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        paddingRight: 'clamp(28px, 4vw, 56px)',
        paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
      }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            {site.name}
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.65,
            margin: '0 0 28px',
          }}>
            Official digital platform of the Papua New Guinea Government.
            Find news, services, publications and contact information.
          </p>
          <Link
            href="/news"
            style={{
              display: 'inline-block',
              padding: '11px 26px',
              background: '#ffffff',
              color: 'var(--color-primary, #CC0000)',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 2,
              textDecoration: 'none',
              border: '2px solid #ffffff',
            }}
          >
            Read more
          </Link>
        </div>
      </div>

      {/* ── Right panel — hero photo ─────────────────── */}
      <div style={{ flex: '0 0 50%', position: 'relative', minHeight: 320 }}>
        {heroSrc ? (
          <>
            <img
              src={heroSrc}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,20,40,0.45)' }} />
          </>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, var(--color-secondary, #1a3a6b) 0%, #0d2040 100%)',
          }}>
            {/* Subtle grid pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }} />
          </div>
        )}
      </div>

      {/* ── Responsive stacking ──────────────────────── */}
      <style>{`
        @media (max-width: 720px) {
          section[data-hero] { flex-direction: column; }
          section[data-hero] > div:first-child  { flex: none; width: 100%; }
          section[data-hero] > div:last-child   { flex: none; width: 100%; min-height: 200px; }
        }
      `}</style>
    </section>
  )
}
