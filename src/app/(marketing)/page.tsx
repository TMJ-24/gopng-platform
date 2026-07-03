import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Hero } from '@/components/marketing/Hero'
import { ArrowIcon } from '@/components/marketing/ArrowIcon'
import { ImagePlaceholder } from '@/components/marketing/ImagePlaceholder'
import { FeaturesSection } from '@/components/marketing/FeaturesSection'
import { StatsSection } from '@/components/marketing/StatsSection'
import { CTASection } from '@/components/marketing/CTASection'
import { C } from '@/components/marketing/theme'

const PILLARS = [
  {
    title: 'One platform, every agency',
    body: 'Ministries, Departments, Provincial Governments and statutory bodies all launch and manage their websites from the same platform, instead of each running its own separate, inconsistent infrastructure.',
  },
  {
    title: 'Secure by design',
    body: 'Public-facing agency websites are published as static pages with no database exposed to the internet — nothing for an attacker to inject into, and nothing to keep patched.',
  },
  {
    title: 'Built for Papua New Guinea',
    body: 'Static, lightweight pages load quickly even on the slower mobile connections common across PNG’s provinces — no citizen should need a fast connection to reach their government.',
  },
]

async function getOrganizationCount(): Promise<number> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'sites',
    where: { status: { equals: 'active' } },
    limit: 0,
    overrideAccess: true,
  })
  return result.totalDocs
}

export default async function HomePage() {
  const organizationCount = await getOrganizationCount()

  return (
    <main>
      <Hero
        eyebrow="Government of Papua New Guinea"
        title="GoPNG Website Platform"
        description="The digital platform Ministries, Departments and Provincial Governments use to launch, manage and publish their official websites across Papua New Guinea."
        ctas={[
          { label: 'Login to Portal', href: '/admin', primary: true },
          { label: 'About This Platform', href: '/about' },
        ]}
      />

      {/* Why it exists */}
      <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              Why This Platform Exists
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
              A shared, standard way to bring government online
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {PILLARS.map(p => (
              <div key={p.title} style={{ padding: 24, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do teaser */}
      <section style={{ padding: '72px 24px', background: C.bgAlt }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
          <ImagePlaceholder label="Platform screenshot" minHeight={280} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              What We Do
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: C.text, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
              From a login to a live government website
            </h2>
            <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, margin: '0 0 20px' }}>
              Digital Transformation Officers provision a site, customise its content
              through a visual editor, and publish — no procurement, no separate hosting
              contract, no waiting on a developer.
            </p>
            <Link href="/what-we-do" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: C.red, textDecoration: 'none' }}>
              See how it works <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <StatsSection organizationCount={organizationCount} />

      <CTASection
        title="Ready to bring your agency online?"
        description="Digital Transformation Officers can launch a new agency website in minutes — no procurement, no hosting contract, no developer required."
      />
    </main>
  )
}
