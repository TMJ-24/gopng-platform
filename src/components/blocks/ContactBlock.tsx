'use client'

import { useSite } from '@/context/SiteContext'
import { ContactForm } from '@/app/(frontend)/contact/ContactForm'

type ContactBlockData = {
  heading?: string
  intro?: string
  mode?: 'form' | 'info' | 'both'
}

export function ContactBlock({ block }: { block: ContactBlockData }) {
  const site = useSite()
  const mode = block.mode ?? 'both'
  const showForm = mode !== 'info' && !!site?.id
  const showInfo = mode !== 'form'

  return (
    <div style={{ marginBottom: 24 }}>
      {block.heading && (
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 8px' }}>{block.heading}</h3>
      )}
      {block.intro && (
        <p style={{ fontSize: 14, color: '#545B64', lineHeight: 1.6, margin: '0 0 16px' }}>{block.intro}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: showForm && showInfo ? '1fr 1fr' : '1fr', gap: 20 }}>
        {showForm && site?.id && <ContactForm siteId={site.id} />}

        {showInfo && site?.contactInfo && (
          <div style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: 24, fontSize: 13, color: '#545B64', lineHeight: 1.9 }}>
            {site.contactInfo.email && <div><strong style={{ color: '#000716' }}>Email:</strong> {site.contactInfo.email}</div>}
            {site.contactInfo.phone && <div><strong style={{ color: '#000716' }}>Phone:</strong> {site.contactInfo.phone}</div>}
            {site.contactInfo.address && <div><strong style={{ color: '#000716' }}>Address:</strong> {site.contactInfo.address}</div>}
            {site.contactInfo.poBox && <div><strong style={{ color: '#000716' }}>PO Box:</strong> {site.contactInfo.poBox}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
