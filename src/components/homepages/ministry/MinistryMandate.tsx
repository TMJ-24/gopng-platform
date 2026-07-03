'use client'

import { useSite } from '@/context/SiteContext'

const RESPONSIBILITIES = [
  'Developing and implementing national policy within the portfolio',
  'Advising the Minister and National Executive Council on portfolio matters',
  'Overseeing agencies, statutory bodies and programmes within the portfolio',
  'Managing the portfolio’s budget and reporting to Parliament',
]

export function MinistryMandate() {
  const site = useSite()
  if (!site) return null

  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>

        <div>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary, #CC0000)', marginBottom: 10 }}>
            Our Mandate
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: '#1a2b4a', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Responsibilities of the {site.name}
          </h2>
          <p style={{ fontSize: 15, color: '#333333', lineHeight: 1.75, margin: 0 }}>
            The {site.name} is responsible for delivering policy, services and programmes within
            its portfolio to the people of Papua New Guinea, in accordance with its mandate under
            the laws of Papua New Guinea.
          </p>
        </div>

        <div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {RESPONSIBILITIES.map((text, i) => (
              <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                  border: '1.5px solid var(--color-primary, #CC0000)', color: 'var(--color-primary, #CC0000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: '#333333', lineHeight: 1.6, paddingTop: 4 }}>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
