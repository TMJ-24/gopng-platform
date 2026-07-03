'use client'

import Link from 'next/link'
import { useSite } from '@/context/SiteContext'

export function MinistryCTA() {
  const site = useSite()
  if (!site) return null

  return (
    <section style={{ background: '#000000' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '56px 24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <div style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            Contact the {site.name}
          </h2>
          <p style={{ color: '#B0BAC4', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            For enquiries, correspondence or public engagement with the Ministry.
            {site.contactInfo?.phone && (
              <> Call <a href={`tel:${site.contactInfo.phone}`} style={{ color: '#FFFFFF', fontWeight: 700 }}>{site.contactInfo.phone}</a>.</>
            )}
          </p>
        </div>
        <Link
          href="/contact"
          style={{
            display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 2,
            textDecoration: 'none', background: 'var(--color-primary, #CC0000)', color: '#FFFFFF',
            fontSize: 14, fontWeight: 700,
          }}
        >
          Contact Us →
        </Link>
      </div>
    </section>
  )
}
