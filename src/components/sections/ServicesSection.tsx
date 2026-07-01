'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BuildingIcon, BudgetIcon, FormIcon,
  PassportIcon, GraduationCapIcon, HeartIcon, MapPinIcon, BriefcaseIcon,
} from '@/components/Icons'

const CITIZEN_SERVICES = [
  { label: 'Apply for a Passport',    href: '/services/passport',     Icon: PassportIcon,      desc: 'New applications and renewals' },
  { label: 'Register a Business',     href: '/services/business',     Icon: BuildingIcon,      desc: 'Company registration and licensing' },
  { label: 'Pay Your Taxes',          href: '/services/tax',          Icon: BudgetIcon,        desc: 'IRC tax payments and filings' },
  { label: 'Apply for Scholarships',  href: '/services/scholarships', Icon: GraduationCapIcon, desc: 'Higher education scholarships' },
  { label: 'Find Health Services',    href: '/services/health',       Icon: HeartIcon,         desc: 'Hospitals and health centres' },
  { label: 'Land Registration',       href: '/services/land',         Icon: MapPinIcon,        desc: 'Land titles and transfers' },
  { label: 'Employment',              href: '/services/employment',   Icon: BriefcaseIcon,     desc: 'Government job opportunities' },
  { label: 'Apply for Permits',       href: '/services/permits',      Icon: FormIcon,          desc: 'Licenses, permits and approvals' },
]

function ServiceCard({ label, href, Icon, desc }: typeof CITIZEN_SERVICES[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#0972D3' : '#D5DBDB'}`,
        borderRadius: 16,
        padding: '20px 18px',
        boxShadow: hovered ? '0 2px 8px rgba(9,114,211,0.14)' : '0 1px 2px rgba(0,28,36,0.08)',
        transition: 'all 0.12s',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 4, marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? '#0972D3' : '#F2F3F3',
        border: `1px solid ${hovered ? '#0972D3' : '#D5DBDB'}`,
        transition: 'all 0.12s',
      }}>
        <Icon size={18} color={hovered ? '#FFFFFF' : '#545B64'} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: hovered ? '#0972D3' : '#000716', marginBottom: 4, lineHeight: 1.3, transition: 'color 0.12s' }}>{label}</div>
      <div style={{ fontSize: 12, color: '#545B64', lineHeight: 1.5, marginBottom: 12 }}>{desc}</div>
      <span style={{ fontSize: 12, fontWeight: 700, color: hovered ? '#0972D3' : '#8D99A8', transition: 'color 0.12s' }}>Get started →</span>
    </Link>
  )
}

export function ServicesSection() {
  return (
    <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>Citizen Services</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>I Want To…</h2>
          </div>
          <Link href="/services" style={{ fontSize: 13, fontWeight: 700, color: '#0972D3', textDecoration: 'none' }}>
            All services →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {CITIZEN_SERVICES.map((s) => <ServiceCard key={s.href} {...s} />)}
        </div>
      </div>
    </section>
  )
}
