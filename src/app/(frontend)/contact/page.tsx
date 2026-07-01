import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteByDomain } from '@/lib/tenant'
import { PageBanner } from '@/components/PageBanner'
import { ContactForm } from './ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const site = await getSiteByDomain(domain)
  return {
    title: `Contact | ${site?.name ?? 'Government Portal'}`,
    description: `Get in touch with ${site?.name ?? 'us'}.`,
  }
}

export default async function ContactPage({
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

  const contact = site.contactInfo

  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle={`Get in touch with ${site.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <div style={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

          {/* Office info */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #D5DBDB', padding: '28px', alignSelf: 'start', boxShadow: '0 1px 2px rgba(0,28,36,0.08)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: '0 0 20px' }}>Office Information</h2>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>Organisation</dt>
                <dd style={{ color: '#000716', fontSize: 14 }}>{site.name}</dd>
              </div>
              {contact?.email && (
                <div>
                  <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>Email</dt>
                  <dd><a href={`mailto:${contact.email}`} style={{ color: '#0972D3', fontSize: 14, textDecoration: 'none' }}>{contact.email}</a></dd>
                </div>
              )}
              {contact?.phone && (
                <div>
                  <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>Phone</dt>
                  <dd style={{ color: '#000716', fontSize: 14 }}>{contact.phone}</dd>
                </div>
              )}
              {contact?.address && (
                <div>
                  <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>Address</dt>
                  <dd style={{ color: '#000716', fontSize: 14, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{contact.address}</dd>
                </div>
              )}
              {contact?.poBox && (
                <div>
                  <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>PO Box</dt>
                  <dd style={{ color: '#000716', fontSize: 14 }}>{contact.poBox}</dd>
                </div>
              )}
              {site.domain && (
                <div>
                  <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687078', marginBottom: 3 }}>Website</dt>
                  <dd><a href={`https://${site.domain}`} style={{ color: '#0972D3', fontSize: 14, textDecoration: 'none' }}>{site.domain}</a></dd>
                </div>
              )}
            </dl>
          </div>

          {/* Form */}
          <ContactForm siteId={site.id} />
        </div>
      </div>
    </>
  )
}
