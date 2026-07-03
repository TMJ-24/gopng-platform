import type { Metadata } from 'next'
import { Hero } from '@/components/marketing/Hero'
import { ImagePlaceholder } from '@/components/marketing/ImagePlaceholder'
import { C } from '@/components/marketing/theme'

export const metadata: Metadata = { title: 'What We Do' }

const STEPS = [
  { step: '01', title: 'Provision',  body: 'A Digital Transformation Officer launches a new agency website through the platform — name, domain and agency type is all it takes to get started.' },
  { step: '02', title: 'Customise',  body: 'Content — pages, news, publications, departments and contact details — is edited through a visual editor, no code required.' },
  { step: '03', title: 'Publish',    body: 'Every change commits straight to the site’s own repository and triggers an automatic rebuild — there’s no separate deploy step to remember.' },
  { step: '04', title: 'Go live',    body: 'The updated site redeploys as static pages to a content delivery network, live on the agency’s official .gov.pg domain within minutes.' },
]

const FEATURES = [
  { title: 'Website Provisioning',   body: 'Launch a fully-structured agency website in minutes, without procurement or a hosting contract.' },
  { title: 'Visual Content Editing', body: 'Manage pages, news, publications and department listings through an editor built for non-technical staff.' },
  { title: 'Secure Static Hosting',  body: 'Every public site is published as static pages — no database exposed to the internet, nothing to patch.' },
  { title: 'Centralised Oversight',  body: 'One roster of agency sites, accounts and citizen enquiries, managed from a single platform.' },
]

export default function WhatWeDoPage() {
  return (
    <main>
      <Hero
        eyebrow="What We Do"
        title="From a login to a live government website"
        description="How the GoPNG Website Platform takes an agency from nothing online to a fast, secure, official website."
        compact
      />

      {/* How it works */}
      <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              How It Works
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
              Four steps, no developer required
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {STEPS.map(s => (
              <div key={s.step} style={{ padding: 22, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.goldDark, letterSpacing: '0.05em', marginBottom: 10 }}>{s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid + image */}
      <section style={{ padding: '72px 24px', background: C.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center', marginBottom: 56 }}>
          <ImagePlaceholder label="Content editor screenshot" minHeight={280} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.red, margin: '0 0 10px' }}>
              Built For DTOs
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
              Manage your site without writing code
            </h2>
            <p style={{ fontSize: 16, color: C.textSub, lineHeight: 1.7, margin: 0 }}>
              Every agency site ships with the same standard page builder — hero
              sections, galleries, statistics, document downloads, contact forms and
              more — so updating content is as simple as filling in a form.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: '#FFFFFF', padding: 22, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6, margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
