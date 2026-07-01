'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BuildingIcon, BudgetIcon, DocumentIcon, HeartIcon, GraduationCapIcon, DatabaseIcon } from '@/components/Icons'

const OPEN_DATA = [
  { label: 'Census Data',         Icon: BuildingIcon },
  { label: 'National Budget',     Icon: BudgetIcon },
  { label: 'Economic Indicators', Icon: DatabaseIcon },
  { label: 'Health Statistics',   Icon: HeartIcon },
  { label: 'Education Data',      Icon: GraduationCapIcon },
  { label: 'Procurement Notices', Icon: DocumentIcon },
]

function DataCard({ label, Icon }: { label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#0972D3' : '#D5DBDB'}`,
        borderRadius: 4,
        boxShadow: hovered ? '0 2px 8px rgba(9,114,211,0.12)' : '0 1px 2px rgba(0,28,36,0.06)',
        transition: 'all 0.12s',
      }}
    >
      <div style={{
        flexShrink: 0, width: 34, height: 34, borderRadius: 4,
        background: hovered ? '#0972D3' : '#232F3E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s',
      }}>
        <Icon size={15} color="#FFFFFF" />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: hovered ? '#0972D3' : '#000716', transition: 'color 0.12s' }}>
        {label}
      </span>
    </div>
  )
}

export function OpenDataSection() {
  return (
    <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>
              Open Government
            </span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
              Open Data &amp; Transparency
            </h2>
            <p style={{ fontSize: 14, color: '#545B64', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 440 }}>
              Access official government datasets — census data, national budget, economic
              indicators, health and education statistics. Supporting transparency, research,
              and informed decision-making for all Papua New Guineans.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/publications?category=budget"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #0972D3' }}
              >
                Browse Datasets →
              </Link>
              <Link
                href="/publications"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: '#FFFFFF', color: '#000716', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #D5DBDB' }}
              >
                All Publications
              </Link>
            </div>
          </div>

          {/* Right — data cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {OPEN_DATA.map(({ label, Icon }) => (
              <DataCard key={label} label={label} Icon={Icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
