'use client'

import Link from 'next/link'
import { LangSwitcher } from './LangSwitcher'
import { GovBanner } from './GovBanner'
import { SearchIcon } from './Icons'
import { mediaUrl } from '@/lib/media'
import type { Site } from '@/lib/tenant'

const DEFAULT_NAV = [
  { label: 'Home',         href: '/' },
  { label: 'About Us',     href: '/about' },
  { label: 'What We Do',   href: '/what-we-do' },
  { label: 'News',         href: '/news' },
  { label: 'Departments',  href: '/departments' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact',      href: '/contact' },
]

export function SiteNav({ site, locale }: { site: Site; locale: string }) {
  const navLinks = site.navigation?.length ? site.navigation : DEFAULT_NAV

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <GovBanner />

      {/* ── Single bar — logo + nav + utilities, all on dark navy ── */}
      <div style={{ background: '#232F3E', borderBottom: '2px solid #FF9900' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 0 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 24 }}>
            {site.logo?.url ? (
              /* Native img — avoids Next.js Image domain restrictions for Payload media */
              <img
                src={mediaUrl(site.logo.url)}
                alt={site.logo.alt ?? site.name}
                style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, flexShrink: 0, display: 'block' }}
              />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 4, background: '#FF9900', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#000716', flexShrink: 0 }}>
                {site.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{site.name}</div>
              {site.domain && (
                <div style={{ fontSize: 10, color: '#8D99A8' }}>{site.domain}</div>
              )}
            </div>
          </Link>

          {/* Nav links — centred in remaining space */}
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={(link as any).openInNewTab ? '_blank' : undefined}
                style={{ fontSize: 13, fontWeight: 500, color: '#D5DBDB', padding: '0 12px', height: 60, display: 'flex', alignItems: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}
                className="nav-link"
              >
                <span className="nav-label" style={{ paddingBottom: 2, borderBottom: '2px solid transparent', transition: 'color 0.1s, border-color 0.1s' }}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 24 }}>
            <Link
              href="/search"
              aria-label="Search"
              style={{ padding: 8, color: '#B0BAC4', display: 'flex', borderRadius: 4, textDecoration: 'none' }}
            >
              <SearchIcon size={17} />
            </Link>
            <LangSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>

      <style>{`
        .nav-link:hover { color: #FFFFFF !important; }
        .nav-link:hover .nav-label { border-bottom-color: #FF9900 !important; color: #FFFFFF !important; }
      `}</style>
    </header>
  )
}
