import Link from 'next/link'
import type { Site } from '@/lib/tenant'

export function SiteFooter({ site }: { site: Site }) {
  const contact = site.contactInfo
  const social = site.socialLinks

  return (
    <footer style={{ background: '#232F3E', color: '#8D99A8', borderTop: '1px solid #1A2536' }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>

        {/* Brand */}
        <div>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 16, marginBottom: 8 }}>{site.name}</div>
          <p style={{ fontSize: 13, color: '#8D99A8', lineHeight: 1.6, marginBottom: 16 }}>
            Official government website of Papua New Guinea.
          </p>
          {social && (
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  style={{ color: '#8D99A8', display: 'flex', transition: 'color 0.1s' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                  style={{ color: '#8D99A8', display: 'flex', transition: 'color 0.1s' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  style={{ color: '#8D99A8', display: 'flex', transition: 'color 0.1s' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Links</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'About Us', href: '/about' },
              { label: 'News', href: '/news' },
              { label: 'Departments', href: '/departments' },
              { label: 'Publications', href: '/publications' },
              { label: 'Contact', href: '/contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: '#8D99A8', textDecoration: 'none', fontSize: 13, transition: 'color 0.1s' }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            {contact?.email && (
              <li><a href={`mailto:${contact.email}`} style={{ color: '#8D99A8', textDecoration: 'none' }}>{contact.email}</a></li>
            )}
            {contact?.phone && <li style={{ color: '#8D99A8' }}>{contact.phone}</li>}
            {contact?.address && <li style={{ color: '#687078', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{contact.address}</li>}
            {contact?.poBox && <li style={{ color: '#8D99A8' }}>PO Box {contact.poBox}</li>}
            {site.domain && !contact?.email && (
              <li><a href={`https://${site.domain}`} style={{ color: '#8D99A8', textDecoration: 'none' }}>{site.domain}</a></li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #31465F', padding: '16px 24px', textAlign: 'center', fontSize: 12, color: '#687078', maxWidth: 1280, margin: '0 auto' }}>
        © {new Date().getFullYear()} {site.name} · Government of Papua New Guinea ·{' '}
        <Link href="/sitemap.xml" style={{ color: '#687078', textDecoration: 'none' }}>Sitemap</Link>
      </div>
    </footer>
  )
}
