import { C } from './theme'
import { ImagePlaceholder } from './ImagePlaceholder'

type Feature = { title: string; body: string; image?: string }

const FEATURES: Feature[] = [
  { title: 'Website Provisioning',   body: 'Launch a fully-structured agency website in minutes, without procurement or a hosting contract.', image: 'Provisioning screenshot' },
  { title: 'Visual Content Editing', body: 'Manage pages, news, publications and department listings through an editor built for non-technical staff.', image: 'Content editor screenshot' },
  { title: 'Secure Static Hosting',  body: 'Every public site is published as static pages — no database exposed to the internet, nothing to patch.' },
  { title: 'Centralised Oversight',  body: 'One roster of agency sites, accounts and citizen enquiries, managed from a single platform.' },
]

export function FeaturesSection() {
  return (
    <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
            Features
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
            Everything an agency needs to go online
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
              {f.image && <ImagePlaceholder label={f.image} aspectRatio="16 / 10" />}
              <div style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6, margin: 0 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
