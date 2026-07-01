'use client'

import { useState } from 'react'
import Link from 'next/link'

const AGENCY_CATEGORIES = [
  { label: 'Ministries',            href: '/departments?type=ministry',   count: '35+', desc: 'National government ministries' },
  { label: 'Departments',           href: '/departments?type=department', count: '60+', desc: 'Government departments and offices' },
  { label: 'Provincial Govts',      href: '/departments?type=provincial', count: '22',  desc: 'All 22 provinces + AROB' },
  { label: 'Statutory Authorities', href: '/departments?type=authority',  count: '40+', desc: 'Independent statutory bodies' },
]

function AgencyCard({ label, href, count, desc }: typeof AGENCY_CATEGORIES[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: hovered ? '#F2F8FD' : '#FFFFFF',
        border: `1px solid ${hovered ? '#0972D3' : '#D5DBDB'}`,
        borderRadius: 16,
        padding: '24px 20px',
        boxShadow: hovered ? '0 2px 8px rgba(9,114,211,0.12)' : '0 1px 2px rgba(0,28,36,0.06)',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700, color: hovered ? '#0972D3' : '#232F3E', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8, transition: 'color 0.12s' }}>
        {count}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#000716', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#545B64', lineHeight: 1.5, marginBottom: 14 }}>{desc}</div>
      <span style={{ fontSize: 12, fontWeight: 700, color: hovered ? '#0972D3' : '#8D99A8', transition: 'color 0.12s' }}>Browse →</span>
    </Link>
  )
}

export function DirectorySection() {
  return (
    <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>Government Directory</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>Find an Agency</h2>
          </div>
          <Link href="/departments" style={{ fontSize: 13, fontWeight: 700, color: '#0972D3', textDecoration: 'none' }}>Browse all →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {AGENCY_CATEGORIES.map(cat => <AgencyCard key={cat.href} {...cat} />)}
        </div>
      </div>
    </section>
  )
}
