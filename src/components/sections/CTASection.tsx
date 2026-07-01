'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'

export function CTASection() {
  const site = useSite()
  const [contactHovered, setContactHovered] = useState(false)
  const [agencyHovered, setAgencyHovered] = useState(false)

  return (
    <section style={{ background: '#232F3E', borderTop: '1px solid #1A2536' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{
          background: '#1A2536',
          border: '1px solid #31465F',
          borderRadius: 16,
          padding: '40px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
              Get in Touch with Government
            </h2>
            <p style={{ color: '#8D99A8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Can&apos;t find what you need? Reach the relevant government office directly.
              {site?.contactInfo?.phone && (
                <> Call us at <a href={`tel:${site.contactInfo.phone}`} style={{ color: '#FF9900', fontWeight: 600 }}>{site.contactInfo.phone}</a>.</>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              onMouseEnter={() => setContactHovered(true)}
              onMouseLeave={() => setContactHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 22px', borderRadius: 4, textDecoration: 'none',
                background: contactHovered ? '#CC7A00' : '#FF9900',
                color: '#000716', fontSize: 14, fontWeight: 700,
                border: '1px solid #CC7A00',
                transition: 'background 0.12s',
              }}
            >
              Contact Government →
            </Link>
            <Link
              href="/departments"
              onMouseEnter={() => setAgencyHovered(true)}
              onMouseLeave={() => setAgencyHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 22px', borderRadius: 4, textDecoration: 'none',
                background: 'transparent',
                color: agencyHovered ? '#FFFFFF' : '#D5DBDB',
                fontSize: 14, fontWeight: 700,
                border: `1px solid ${agencyHovered ? '#8D99A8' : '#545B64'}`,
                transition: 'all 0.12s',
              }}
            >
              Find an Agency
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
