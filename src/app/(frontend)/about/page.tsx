'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { RichText } from '@/components/RichText'
import { PageBanner } from '@/components/PageBanner'

const VALUES = [
  { title: 'Transparency',       desc: 'Open and accountable in all decisions, ensuring citizens have access to information about how government operates.' },
  { title: 'Integrity',          desc: 'Upholding the highest ethical standards in public service, acting with honesty and fairness in everything we do.' },
  { title: 'Service Excellence', desc: 'Delivering responsive, efficient, and high-quality services to every citizen of Papua New Guinea.' },
  { title: 'Inclusivity',        desc: 'Recognising the rich diversity of Papua New Guinea and ensuring our work benefits all communities.' },
  { title: 'Innovation',         desc: 'Embracing new approaches and technologies to continuously improve how government serves the people.' },
  { title: 'Collaboration',      desc: 'Working in partnership with agencies, communities, and stakeholders to achieve shared national goals.' },
]

const STATS = [
  { value: '1975',  label: 'Year of Independence' },
  { value: '9.7M+', label: 'Citizens Served' },
  { value: '22',    label: 'Provinces' },
  { value: '800+',  label: 'Government Staff' },
]

export default function AboutPage() {
  const site = useSite()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') === 'tpi' ? 'tpi' : 'en'
  const [cmsPage, setCmsPage] = useState<any>(null)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/pages?where[site][equals]=${site.id}&where[slug][equals]=about&depth=1&locale=${locale}`)
      .then(r => r.json())
      .then(data => setCmsPage(data.docs?.[0] ?? null))
      .catch(() => {})
  }, [site?.id, locale])

  if (!site) return null

  return (
    <>
      <PageBanner
        title={`About ${site.name}`}
        subtitle="Our history, mission, and commitment to the people of Papua New Guinea."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Mission + Vision */}
      <section style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[
            {
              tag: 'Our Mission', heading: 'Why We Exist',
              body: cmsPage?.excerpt || 'To develop and implement policies, strategies, and programmes that promote sustainable development, equitable growth, and improved quality of life for all citizens of Papua New Guinea.',
            },
            {
              tag: 'Our Vision', heading: 'Where We Are Headed',
              body: "A prosperous, inclusive, and well-governed Papua New Guinea where every citizen has access to opportunities that allow them to thrive and contribute to the nation's growth.",
            },
          ].map(({ tag, heading, body }) => (
            <div key={tag} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 28px', border: '1px solid #D5DBDB' }}>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#F2F3F3', marginBottom: 10 }}>{tag}</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 10px' }}>{heading}</h2>
              <p style={{ color: '#545B64', lineHeight: 1.65, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CMS Rich Text */}
      {cmsPage?.content && (
        <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
            <RichText content={cmsPage.content} />
          </div>
        </section>
      )}

      {/* Core Values */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#F2F3F3', marginBottom: 10 }}>What Drives Us</span>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em' }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: '#FFFFFF', borderRadius: 16, padding: '22px 22px', border: '1px solid #D5DBDB' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: '0 0 6px' }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#545B64', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#232F3E', borderBottom: '1px solid #1A2536' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, background: '#31465F', borderRadius: 4, overflow: 'hidden' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: '#1A2536', padding: '32px 32px' }}>
                <div style={{ fontSize: 44, fontWeight: 700, color: '#FF9900', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8D99A8' }}>{s.label}</div>
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
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>Learn More About What We Do</h2>
              <p style={{ color: '#8D99A8', fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 420 }}>
                Explore our key functions, programmes, and initiatives.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/what-we-do" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: '#FF9900', color: '#000716', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #CC7A00' }}>
                What We Do →
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
