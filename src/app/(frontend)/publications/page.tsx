import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteByDomain } from '@/lib/tenant'
import { getDocuments } from '@/lib/api'
import { PageBanner } from '@/components/PageBanner'
import {
  PolicyIcon, ReportIcon, FormIcon, LegislationIcon, BudgetIcon, TenderIcon, DocumentIcon,
} from '@/components/Icons'

const CATEGORY_LABELS: Record<string, string> = {
  policy: 'Policy', report: 'Report', form: 'Form',
  legislation: 'Legislation', budget: 'Budget', tender: 'Tender', other: 'Other',
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  policy: PolicyIcon, report: ReportIcon, form: FormIcon,
  legislation: LegislationIcon, budget: BudgetIcon, tender: TenderIcon, other: DocumentIcon,
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const site = await getSiteByDomain(domain)
  return {
    title: `Publications | ${site?.name ?? 'Government Portal'}`,
    description: `Official documents, forms, reports and publications from ${site?.name ?? 'this ministry'}.`,
  }
}

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; locale?: string }>
}) {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const params = await searchParams
  const locale = params.locale === 'tpi' ? 'tpi' : 'en'
  const site = await getSiteByDomain(domain, locale)
  if (!site) return null

  const { docs: documents } = await getDocuments(site.id, params.category)
  const categories = Object.keys(CATEGORY_LABELS)

  return (
    <>
      <PageBanner
        title="Publications & Documents"
        subtitle="Official documents, forms, reports, policies and legislation."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Publications & Documents' }]}
        aside={documents.length > 0 ? `${documents.length} document${documents.length !== 1 ? 's' : ''}` : undefined}
      />

      <div style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {(['all', ...categories] as string[]).map((cat) => {
              const isActive = cat === 'all' ? !params.category : params.category === cat
              const Icon = cat !== 'all' ? (CATEGORY_ICONS[cat] ?? DocumentIcon) : null
              return (
                <a
                  key={cat}
                  href={cat === 'all' ? '/publications' : `?category=${cat}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.1s',
                    background: isActive ? '#0972D3' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#000716',
                    border: `1px solid ${isActive ? '#0972D3' : '#D5DBDB'}`,
                  }}
                >
                  {Icon && <Icon size={13} color={isActive ? '#FFFFFF' : '#545B64'} />}
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                </a>
              )
            })}
          </div>

          {documents.length === 0 ? (
            <p style={{ color: '#687078', textAlign: 'center', padding: '64px 0', fontSize: 15 }}>No documents found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {documents.map((doc: any) => {
                const Icon = CATEGORY_ICONS[doc.category] ?? DocumentIcon
                return (
                  <a
                    key={doc.id}
                    href={doc.file?.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #D5DBDB', textDecoration: 'none', transition: 'box-shadow 0.12s' }}
                    className="doc-row"
                  >
                    <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: '#0972D3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="#FFFFFF" />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#000716', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</div>
                      <div style={{ fontSize: 12, color: '#687078', marginTop: 2 }}>
                        {CATEGORY_LABELS[doc.category]} ·{' '}
                        {new Date(doc.createdAt).toLocaleDateString('en-PG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#687078' }}>
                      Download
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`.doc-row:hover { box-shadow: 0 2px 8px rgba(9,114,211,0.12); border-color: #0972D3 !important; }`}</style>
    </>
  )
}
