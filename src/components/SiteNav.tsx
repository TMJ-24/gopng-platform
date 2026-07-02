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

      {/* ── White nav bar ───────────────────────────── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 0 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 32 }}>
            {site.logo?.url ? (
              <img
                src={mediaUrl(site.logo.url)}
                alt={site.logo.alt ?? site.name}
                style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 4, flexShrink: 0, display: 'block' }}
              />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 4, background: 'var(--color-primary, #CC0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#ffffff', flexShrink: 0 }}>
                {site.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 700, fontSize: 14, color: '#111111', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{site.name}</div>
              {site.domain && (
                <div style={{ fontSize: 10, color: '#888888' }}>{site.domain}</div>
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
                style={{
                  fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontSize: '1rem', fontWeight: 500, color: '#333333',
                  padding: '0 14px', height: 64, display: 'flex', alignItems: 'center',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}
                className="site-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 24 }}>
            <Link
              href="/search"
              aria-label="Search"
              style={{ padding: 8, color: '#555555', display: 'flex', borderRadius: 4, textDecoration: 'none' }}
              className="site-nav-icon"
            >
              <SearchIcon size={18} />
            </Link>
            <LangSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>

      <style>{`
        .site-nav-link { position: relative; }
        .site-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 14px; right: 14px;
          height: 3px;
          background: var(--color-primary, #CC0000);
          transform: scaleX(0);
          transition: transform 0.15s ease;
        }
        .site-nav-link:hover { color: var(--color-primary, #CC0000) !important; }
        .site-nav-link:hover::after { transform: scaleX(1); }
        .site-nav-icon:hover { color: #111111 !important; background: #f5f5f5; }
      `}</style>
    </header>
  )
}
