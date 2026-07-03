'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LangSwitcher } from './LangSwitcher'
import { GovBanner } from './GovBanner'
import { SearchIcon, ChevronDownIcon, CloseIcon } from './Icons'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!openDropdown) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenDropdown(null) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openDropdown])

  const activeItem = navLinks.find((l) => l.href === openDropdown && (l as any).children?.length)

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <GovBanner />

      {/* ── White nav bar ───────────────────────────── */}
      <div ref={navRef} style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 'auto' }}>
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
                <div className="site-nav-domain" style={{ fontSize: 10, color: '#888888' }}>{site.domain}</div>
              )}
            </div>
          </Link>

          {/* Nav links — desktop only, centred between logo and utilities */}
          <nav className="site-nav-desktop" aria-label="Main navigation">
            {navLinks.map((link) => {
              const children = (link as any).children as { label: string; href: string; description?: string; openInNewTab?: boolean }[] | undefined
              const hasChildren = !!children?.length
              const isOpen = openDropdown === link.href

              if (hasChildren) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : link.href)}
                    aria-expanded={isOpen}
                    style={{
                      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                      fontSize: '1rem', fontWeight: 500,
                      color: isOpen ? 'var(--color-primary, #CC0000)' : '#333333',
                      padding: '0 14px', height: 64, display: 'flex', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                    className={`site-nav-link${isOpen ? ' site-nav-link-open' : ''}`}
                  >
                    {link.label}
                    <ChevronDownIcon size={14} style={{ transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>
                )
              }

              return (
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
              )
            })}
          </nav>

          {/* Right utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 16 }}>
            <Link
              href="/search"
              aria-label="Search"
              style={{ padding: 8, color: '#555555', display: 'flex', borderRadius: 4, textDecoration: 'none' }}
              className="site-nav-icon"
            >
              <SearchIcon size={18} />
            </Link>
            <LangSwitcher currentLocale={locale} />

            {/* Hamburger button — mobile only */}
            <button
              className="site-nav-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#333333', borderRadius: 4, display: 'none' }}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mega-menu dropdown — desktop, shown when a nav item with children is active */}
        {activeItem && (
          <div className="site-nav-dropdown" role="region" aria-label={`${activeItem.label} menu`}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {activeItem.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(null)}
                  aria-label="Close menu"
                  style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#555555', display: 'flex', borderRadius: 4 }}
                >
                  <CloseIcon size={18} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px 40px' }}>
                {((activeItem as any).children as { label: string; href: string; description?: string; openInNewTab?: boolean }[]).map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    target={child.openInNewTab ? '_blank' : undefined}
                    onClick={() => setOpenDropdown(null)}
                    style={{ textDecoration: 'none', display: 'block' }}
                    className="site-nav-dropdown-item"
                  >
                    <span style={{ fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {child.label}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {child.description && (
                      <span style={{ display: 'block', fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontSize: '0.875rem', color: '#666666', marginTop: 6, lineHeight: 1.5 }}>
                        {child.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile nav drawer — shown when hamburger is open */}
        {menuOpen && (
          <nav className="site-nav-mobile-drawer" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const children = (link as any).children as { label: string; href: string; description?: string; openInNewTab?: boolean }[] | undefined
              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    target={(link as any).openInNewTab ? '_blank' : undefined}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                      fontSize: '1rem', fontWeight: 500, color: '#333333',
                      padding: '14px 24px',
                      textDecoration: 'none',
                      borderBottom: children?.length ? 'none' : '1px solid #f0f0f0',
                    }}
                    className="site-nav-mobile-link"
                  >
                    {link.label}
                  </Link>
                  {!!children?.length && (
                    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          target={child.openInNewTab ? '_blank' : undefined}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'block',
                            fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                            fontSize: '0.9rem', fontWeight: 400, color: '#555555',
                            padding: '10px 24px 10px 40px',
                            textDecoration: 'none',
                          }}
                          className="site-nav-mobile-link"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        )}
      </div>

      <style>{`
        .site-nav-desktop {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
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
        .site-nav-link:hover::after,
        .site-nav-link-open::after { transform: scaleX(1); }
        .site-nav-icon:hover { color: #111111 !important; background: #f5f5f5; }
        .site-nav-dropdown {
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
          animation: site-nav-dropdown-in 0.15s ease;
        }
        @keyframes site-nav-dropdown-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .site-nav-dropdown-item span:first-child { transition: color 0.1s; }
        .site-nav-dropdown-item:hover span:first-child { color: var(--color-primary, #CC0000) !important; }
        .site-nav-mobile-link:hover { color: var(--color-primary, #CC0000) !important; background: #fafafa; }
        @media (max-width: 768px) {
          .site-nav-desktop { display: none !important; }
          .site-nav-hamburger { display: flex !important; }
        }
        @media (max-width: 480px) {
          .site-nav-domain { display: none; }
        }
      `}</style>
    </header>
  )
}
