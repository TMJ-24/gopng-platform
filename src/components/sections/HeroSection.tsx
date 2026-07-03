'use client'

import Link from 'next/link'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

export function HeroSection() {
  const site = useSite()

  if (!site) return null

  const heroSrc = mediaUrl(site.heroImage?.url)

  return (
    <section className="hero-section" style={{ display: 'flex', minHeight: 420, overflow: 'hidden' }}>

      {/* ── Left panel — pale hero background ────────── */}
      <div className="hero-panel-left" style={{
        flex: '0 0 50%',
        background: '#F4E9F6',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        paddingRight: 'clamp(28px, 4vw, 56px)',
        paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
      }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{
            fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 'calc(1.475rem + 2.7vw)',
            fontWeight: 800,
            color: '#1a2b4a',
            lineHeight: 1.1,
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
            fontOpticalSizing: 'auto' as any,
          }}>
            {site.name}
          </h1>
          <p style={{
            fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: 400,
            color: '#555555',
            lineHeight: 1.6,
            margin: '0 0 32px',
          }}>
            Official digital platform of the Papua New Guinea Government.
            Find news, services, publications and contact information.
          </p>
          <Link
            href="/news"
            style={{
              display: 'inline-block',
              padding: '11px 26px',
              background: 'var(--color-primary, #CC0000)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 2,
              textDecoration: 'none',
              border: '2px solid var(--color-primary, #CC0000)',
            }}
          >
            Read more
          </Link>
        </div>
      </div>

      {/* ── Right panel — hero photo ─────────────────── */}
      <div className="hero-panel-right" style={{ flex: '0 0 50%', position: 'relative', minHeight: 320 }}>
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
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }} />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-section {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .hero-panel-left {
            flex: none !important;
            width: 100% !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
            min-height: auto !important;
          }
          .hero-panel-right {
            flex: none !important;
            width: 100% !important;
            min-height: 220px !important;
            position: relative !important;
          }
        }
      `}</style>
    </section>
  )
}
