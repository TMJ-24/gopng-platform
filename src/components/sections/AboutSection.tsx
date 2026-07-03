'use client'

import { useSite } from '@/context/SiteContext'
import { BuildingIcon, MapPinIcon, PhoneIcon } from '@/components/Icons'

const AGENCY_TYPE_LABELS: Record<string, string> = {
  ministry: 'ministry',
  department: 'department',
  authority: 'statutory authority',
  commission: 'commission',
  'statutory-body': 'statutory body',
  provincial: 'provincial government',
  soe: 'state-owned enterprise',
}

export function AboutSection() {
  const site = useSite()
  if (!site) return null

  const typeLabel = AGENCY_TYPE_LABELS[site.agencyType] ?? 'government agency'

  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px', display: 'flex', flexWrap: 'wrap', gap: 40 }}>

        {/* Mandate copy */}
        <div style={{ flex: '1 1 420px' }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#F2F3F3', marginBottom: 10 }}>
            Our Mandate
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            About {site.name}
          </h2>
          <p style={{ fontSize: 15, color: '#333333', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
            {site.name} is a {typeLabel} of the Government of Papua New Guinea, responsible for
            delivering policy, services and programmes within its mandate to the people of Papua
            New Guinea. This website is maintained as the official source of information, news and
            services for {site.name}.
          </p>
        </div>

        {/* Quick facts */}
        <div style={{ flex: '1 1 280px', display: 'grid', gridTemplateColumns: '1fr', gap: 12, alignContent: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#F2F3F3', border: '1px solid #D5DBDB', borderRadius: 12, padding: '14px 16px' }}>
            <BuildingIcon size={16} style={{ color: '#0972D3', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#000716' }}>Agency type</div>
              <div style={{ fontSize: 13, color: '#545B64', textTransform: 'capitalize' }}>{typeLabel}</div>
            </div>
          </div>
          {site.contactInfo?.address && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#F2F3F3', border: '1px solid #D5DBDB', borderRadius: 12, padding: '14px 16px' }}>
              <MapPinIcon size={16} style={{ color: '#0972D3', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#000716' }}>Address</div>
                <div style={{ fontSize: 13, color: '#545B64' }}>{site.contactInfo.address}</div>
              </div>
            </div>
          )}
          {site.contactInfo?.phone && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#F2F3F3', border: '1px solid #D5DBDB', borderRadius: 12, padding: '14px 16px' }}>
              <PhoneIcon size={16} style={{ color: '#0972D3', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#000716' }}>Phone</div>
                <div style={{ fontSize: 13, color: '#545B64' }}>{site.contactInfo.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
