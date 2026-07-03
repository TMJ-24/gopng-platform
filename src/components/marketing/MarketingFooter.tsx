import Link from 'next/link'
import { C } from './theme'

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'What We Do', href: '/what-we-do' },
      { label: 'Login to Portal', href: '/admin' },
    ],
  },
  {
    title: 'Government of PNG',
    links: [
      { label: 'National Government', href: 'https://www.gov.pg' },
      { label: 'Open Data PNG', href: 'https://data.gov.pg' },
      { label: 'Department of ICT', href: 'https://ict.gov.pg' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: 'mailto:support@digital.gov.pg' },
      { label: 'Report an Issue', href: 'mailto:support@digital.gov.pg?subject=Issue%20Report' },
    ],
  },
]

const SOCIAL = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'X', href: 'https://x.com' },
]

export function MarketingFooter() {
  return (
    <footer style={{ background: C.black, color: 'rgba(255,255,255,0.75)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="/cresent.png" alt="Government of Papua New Guinea" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>GoPNG Website Platform</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 220 }}>
              The digital platform Government of Papua New Guinea agencies use to launch
              and manage their official websites.
            </p>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Government of Papua New Guinea. GoPNG Digital Platform.
          </span>
          <div style={{ display: 'flex', gap: 14 }}>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
