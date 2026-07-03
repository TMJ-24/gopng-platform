import type { Metadata } from 'next'
import { Hero } from '@/components/marketing/Hero'
import { ImagePlaceholder } from '@/components/marketing/ImagePlaceholder'
import { C } from '@/components/marketing/theme'

export const metadata: Metadata = { title: 'About Us' }

const PRINCIPLES = [
  { title: 'Consistency',    body: 'Every agency website follows the same standard of design, accessibility and information architecture, so citizens always know how to find what they need.' },
  { title: 'Security',       body: 'Public content is published as static pages with no database behind it — removing an entire class of attack that has hit government sites elsewhere.' },
  { title: 'Speed',          body: 'Static pages served from a content delivery network load fast, even on limited mobile data, across every province.' },
  { title: 'Self-service',   body: 'Agencies no longer wait on procurement or a developer to update their site — a Digital Transformation Officer can publish changes directly.' },
]

export default function AboutPage() {
  return (
    <main>
      <Hero
        eyebrow="About Us"
        title="Why this platform exists"
        description="A shared foundation for every Papua New Guinea government website — built once, used by all."
        compact
      />

      {/* Origin / purpose */}
      <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ maxWidth: 760 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              Our Purpose
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              One platform, built for every agency
            </h2>
            <div style={{ fontSize: 16, color: C.textSub, lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 18px' }}>
                Before this platform, government websites across Papua New Guinea were built
                and hosted independently by each agency — different vendors, different
                standards, and often no website at all. That meant inconsistent design,
                uneven security, and real cost and delay every time an agency needed a new
                site or a simple content update.
              </p>
              <p style={{ margin: '0 0 18px' }}>
                The GoPNG Website Platform was created to solve this once, centrally, for
                every Ministry, Department, Provincial Government and statutory body. It
                gives Digital Transformation Officers a single place to launch a new agency
                website, manage its content, and publish updates — without needing to
                procure hosting, hire a developer, or manage a server.
              </p>
              <p style={{ margin: 0 }}>
                Under the hood, each agency&apos;s public website is published as a static
                site with no database exposed to the internet. That keeps every site fast,
                inexpensive to host at national scale, and free of an entire category of
                security risk that a live database-backed website carries — while this
                platform remains the one place DTOs log in to manage it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: '72px 24px', background: C.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              What Guides Us
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
              Our Principles
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {PRINCIPLES.map(p => (
              <div key={p.title} style={{ background: '#FFFFFF', padding: 22, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              Who We Serve
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
              Every corner of government
            </h2>
            <p style={{ fontSize: 16, color: C.textSub, lineHeight: 1.7, margin: 0 }}>
              National Ministries and Departments, Provincial Governments, statutory
              authorities, commissions and state-owned enterprises all use the same
              platform — each with its own website, its own domain, and its own
              Digital Transformation Officer managing it.
            </p>
          </div>
          <ImagePlaceholder label="Team / office photo" minHeight={260} />
        </div>
      </section>
    </main>
  )
}
