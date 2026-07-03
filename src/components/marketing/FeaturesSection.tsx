import { C } from './theme'

type Feature = { title: string; body: string }

const FEATURES: Feature[] = [
  { title: 'Website Provisioning',   body: 'Launch a fully-structured agency website in minutes, without procurement or a hosting contract.' },
  { title: 'Visual Content Editing', body: 'Manage pages, news, publications and department listings through an editor built for non-technical staff.' },
  { title: 'Secure Static Hosting',  body: 'Every public site is published as static pages — no database exposed to the internet, nothing to patch.' },
  { title: 'Centralised Oversight',  body: 'One roster of agency sites, accounts and citizen enquiries, managed from a single platform.' },
]

export function FeaturesSection() {
  return (
    <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
            Features
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
            Everything an agency needs to go online
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ padding: 22, border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
