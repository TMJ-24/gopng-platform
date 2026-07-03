import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GoPNG Website Platform',
  description: 'Digital platform for the Government of Papua New Guinea — provision, manage and publish official agency websites.',
}

const C = {
  navy: '#232F3E',
  navyDark: '#1A2536',
  blue: '#0972D3',
  orange: '#FF9900',
  text: '#000716',
  textSub: '#545B64',
  border: '#D5DBDB',
}

// The public landing page for the platform control plane itself — introduces GoPNG
// before sending DTOs/admins to the real login at /admin. Public agency websites are a
// separate concern entirely (see the site-template repo); this page is the platform's
// own front door, not agency content.
export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif' }}>
      <div style={{ background: C.navy, borderBottom: `3px solid ${C.orange}`, flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
          <img
            src="/cresent.png"
            alt="Government of Papua New Guinea"
            style={{ width: 96, height: 96, objectFit: 'contain', margin: '0 auto 28px' }}
          />
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange, margin: '0 0 12px' }}>
            Government of Papua New Guinea
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            GoPNG Website Platform
          </h1>
          <p style={{ fontSize: 16, color: '#B0BAC4', lineHeight: 1.65, margin: '0 auto 40px', maxWidth: 560 }}>
            The digital platform Ministries, Departments and Provincial Governments use to
            launch, manage and publish their official websites across Papua New Guinea.
          </p>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700,
              background: C.blue, color: '#FFFFFF', textDecoration: 'none',
            }}
          >
            Login to Portal →
          </Link>
        </div>
      </div>

      <footer style={{ background: C.navyDark, padding: '16px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#8D99A8' }}>
          © {new Date().getFullYear()} Government of Papua New Guinea. GoPNG Digital Platform.
        </span>
      </footer>
    </main>
  )
}
