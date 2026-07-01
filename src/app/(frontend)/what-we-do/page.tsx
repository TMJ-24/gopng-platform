'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { RichText } from '@/components/RichText'
import { PageBanner } from '@/components/PageBanner'
import {
  PolicyIcon, DocumentIcon, BuildingIcon, NewsIcon,
  PhoneIcon, ReportIcon, FormIcon, LegislationIcon,
} from '@/components/Icons'

const FUNCTIONS = [
  { Icon: PolicyIcon,      title: 'Policy Development',       desc: "Develop and review national policies that guide the government's strategic direction." },
  { Icon: LegislationIcon, title: 'Legislation & Regulation', desc: 'Prepare and administer legislation, regulations, and guidelines within our mandate.' },
  { Icon: BuildingIcon,    title: 'Programme Delivery',        desc: 'Design and deliver development programmes that improve services for all Papua New Guineans.' },
  { Icon: ReportIcon,      title: 'Research & Analysis',       desc: 'Conduct evidence-based research and analysis to inform decision-making.' },
  { Icon: FormIcon,        title: 'Licensing & Compliance',    desc: 'Administer licensing, permits, and compliance frameworks to uphold standards.' },
  { Icon: DocumentIcon,    title: 'Accountability',            desc: 'Report to Parliament and the public on performance, spending, and targets.' },
  { Icon: PhoneIcon,       title: 'Stakeholder Engagement',    desc: 'Engage with communities, private sector, development partners, and agencies.' },
  { Icon: NewsIcon,        title: 'Public Communication',      desc: 'Keep citizens informed through regular communication and public outreach.' },
]

const PROGRAMMES = [
  { title: 'National Development Plan',         status: 'Ongoing', desc: "Long-term strategic plan guiding Papua New Guinea's development priorities and resource mobilisation." },
  { title: 'Capacity Building Initiative',      status: 'Ongoing', desc: 'Building institutional capacity across government departments to improve service delivery quality.' },
  { title: 'Digital Government Transformation', status: 'Active',  desc: 'Modernising government services through digital platforms and data-driven decision making.' },
  { title: 'Provincial Support Programme',      status: 'Active',  desc: 'Supporting provincial and local-level governments to deliver essential services to communities.' },
]

export default function WhatWeDoPage() {
  const site = useSite()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') === 'tpi' ? 'tpi' : 'en'
  const [cmsPage, setCmsPage] = useState<any>(null)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/pages?where[site][equals]=${site.id}&where[slug][equals]=what-we-do&depth=1&locale=${locale}`)
      .then(r => r.json())
      .then(data => setCmsPage(data.docs?.[0] ?? null))
      .catch(() => {})
  }, [site?.id, locale])

  if (!site) return null

  return (
    <>
      <PageBanner
        title="What We Do"
        subtitle={`Our mandate, key functions, and programmes at ${site.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'What We Do' }]}
      />

      {/* Mandate */}
      <section style={{ background: '#232F3E', borderBottom: '1px solid #1A2536' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ background: '#1A2536', border: '1px solid #31465F', borderRadius: 16, padding: '40px' }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 14px', borderRadius: 20, background: '#FF9900', color: '#000716', marginBottom: 12 }}>Our Mandate</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', margin: '0 0 14px', letterSpacing: '-0.01em' }}>Established by law to serve Papua New Guinea</h2>
            <p style={{ color: '#8D99A8', lineHeight: 1.7, margin: 0, fontSize: 14 }}>
              {cmsPage?.excerpt ||
                `${site.name} is established under an Act of Parliament and charged with responsibility for the efficient, accountable, and transparent administration of its portfolio. Our mandate spans policy, legislation, programme delivery, and stakeholder engagement across Papua New Guinea.`}
            </p>
          </div>
        </div>
      </section>

      {/* Key Functions */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>Core Functions</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>Key Areas of Responsibility</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {FUNCTIONS.map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: '#FFFFFF', borderRadius: 16, padding: '22px', border: '1px solid #D5DBDB' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#0972D3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} color="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#000716', margin: '0 0 6px' }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#545B64', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CMS Rich Text */}
      {cmsPage?.content && (
        <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
            <RichText content={cmsPage.content} />
          </div>
        </section>
      )}

      {/* Programmes */}
      <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF', marginBottom: 10 }}>Initiatives</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>Current Programmes &amp; Projects</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {PROGRAMMES.map((prog) => (
              <div key={prog.title} style={{ background: '#FFFFFF', borderRadius: 16, padding: '22px', border: '1px solid #D5DBDB' }}>
                <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: '#0972D3', color: '#FFFFFF', marginBottom: 10 }}>
                  {prog.status}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: '0 0 6px' }}>{prog.title}</h3>
                <p style={{ fontSize: 13, color: '#545B64', lineHeight: 1.6, margin: 0 }}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#232F3E', borderBottom: '1px solid #1A2536' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ background: '#1A2536', border: '1px solid #31465F', borderRadius: 16, padding: '40px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>Want to Know More?</h2>
              <p style={{ color: '#8D99A8', fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 420 }}>
                Read our publications or get in touch with our team directly.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/publications" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: '#FF9900', color: '#000716', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #CC7A00' }}>
                Publications →
              </Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: 'transparent', color: '#D5DBDB', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #545B64' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
