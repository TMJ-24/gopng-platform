'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { SearchIcon } from '@/components/Icons'
import { mediaUrl } from '@/lib/media'

const QUICK_SEARCHES = ['Passport', 'Business Registration', 'Scholarships', 'Tax', 'Land Registration', 'Fishing License']

export function HeroSection() {
  const site = useSite()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  if (!site) return null

  const heroSrc = mediaUrl(site.heroImage?.url)
  const logoSrc = mediaUrl(site.logo?.url)

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: 520 }}>

      {/* Background — uploaded hero image OR navy gradient fallback */}
      {heroSrc ? (
        <>
          {/* Native img: no Next.js domain restrictions, works with any Payload URL */}
          <img
            src={heroSrc}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
            }}
          />
          {/* Dark overlay so white text stays readable */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(35,47,62,0.90) 0%, rgba(26,37,54,0.82) 100%)' }} />
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #232F3E 0%, #1A2536 60%, #0A1628 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '64px 24px 72px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Official badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,153,0,0.15)', border: '1px solid rgba(255,153,0,0.4)', color: '#FF9900', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 24, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF9900', flexShrink: 0 }} />
          Government Portal
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em', maxWidth: 700 }}>
          {site.name}
        </h1>
        <p style={{ color: '#8D99A8', fontSize: 18, marginBottom: 36, maxWidth: 560, lineHeight: 1.6 }}>
          One Government. One Portal. One Citizen Experience.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: 600, marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services, departments, publications…"
            style={{ flex: 1, padding: '13px 18px', fontSize: 14, color: '#000716', background: '#FFFFFF', border: 'none', borderRadius: '4px 0 0 4px', outline: 'none' }}
          />
          <button
            type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 20px', background: '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <SearchIcon size={16} />
            <span>Search</span>
          </button>
        </form>

        {/* Quick searches */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 36, justifyContent: 'center' }}>
          {QUICK_SEARCHES.map(term => (
            <button
              key={term}
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              style={{ fontSize: 12, color: '#B0BAC4', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}
            >
              {term}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <Link
            href="/services"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', background: '#FF9900', color: '#000716', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid #CC7A00' }}
          >
            Explore Services
          </Link>
          <Link
            href="/departments"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', background: 'transparent', color: '#FFFFFF', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.35)' }}
          >
            Find an Agency →
          </Link>
        </div>
      </div>
    </section>
  )
}
