import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteByDomain } from '@/lib/tenant'
import { getDepartments } from '@/lib/api'
import { PageBanner } from '@/components/PageBanner'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const site = await getSiteByDomain(domain)
  return {
    title: `Departments | ${site?.name ?? 'Government Portal'}`,
    description: `All departments and agencies under ${site?.name ?? 'this ministry'}.`,
  }
}

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>
}) {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const params = await searchParams
  const locale = params?.locale === 'tpi' ? 'tpi' : 'en'
  const site = await getSiteByDomain(domain, locale)
  if (!site) return null

  const { docs: departments } = await getDepartments(site.id)

  return (
    <>
      <PageBanner
        title="Departments & Agencies"
        subtitle={`Divisions and agencies under ${site.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Departments' }]}
        aside={departments.length > 0 ? `${departments.length} listed` : undefined}
      />

      <div style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          {departments.length === 0 ? (
            <p style={{ color: '#687078', textAlign: 'center', padding: '64px 0', fontSize: 15 }}>No departments listed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {departments.map((dept: any) => (
                <div
                  key={dept.id}
                  style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #D5DBDB', padding: '22px', boxShadow: '0 1px 2px rgba(0,28,36,0.08)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: 0, lineHeight: 1.35 }}>{dept.name}</h2>
                    {dept.acronym && (
                      <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#0972D3', color: '#FFFFFF' }}>
                        {dept.acronym}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#545B64' }}>
                    {dept.email && (
                      <a href={`mailto:${dept.email}`} style={{ color: '#0972D3', textDecoration: 'none' }}>{dept.email}</a>
                    )}
                    {dept.phone && <span>{dept.phone}</span>}
                    {dept.website && (
                      <a href={dept.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0972D3', textDecoration: 'none' }}>Visit website →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
