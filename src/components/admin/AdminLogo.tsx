'use client'

import React, { useEffect, useState } from 'react'

function PngFlagFallback() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#000', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#CE1126', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⭐</div>
    </div>
  )
}

export function AdminLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('GoPNG')

  useEffect(() => {
    fetch('/api/sites?limit=1&depth=1&sort=-createdAt')
      .then(r => r.json())
      .then(data => {
        const site = data?.docs?.[0]
        if (site?.logo?.url) {
          const base = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'
          const url = site.logo.url.startsWith(base)
            ? site.logo.url.slice(base.length)
            : site.logo.url
          setLogoUrl(url)
        }
        if (site?.name) setSiteName(site.name)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0', textAlign: 'center' }}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12, display: 'block' }}
        />
      ) : (
        <PngFlagFallback />
      )}
      <div>
        <div style={{ fontWeight: 900, fontSize: 18, color: '#000716', letterSpacing: '-0.02em' }}>{siteName}</div>
        <div style={{ fontSize: 11, color: '#687078', fontWeight: 500 }}>Website Platform</div>
      </div>
    </div>
  )
}
