import Link from 'next/link'
import { C } from './theme'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
]

export function MarketingNav() {
  return (
    <header style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/cresent.png" alt="Government of Papua New Guinea" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>GoPNG Website Platform</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ padding: '8px 14px', borderRadius: 6, fontSize: 15, fontWeight: 600, color: C.textSub, textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            style={{ marginLeft: 8, padding: '9px 18px', borderRadius: 6, fontSize: 15, fontWeight: 700, color: '#FFFFFF', background: C.red, textDecoration: 'none' }}
          >
            Login to Portal
          </Link>
        </nav>
      </div>
    </header>
  )
}
