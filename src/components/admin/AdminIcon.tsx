'use client'

import React, { useEffect, useState } from 'react'

export function AdminIcon() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

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
      })
      .catch(() => {})
  }, [])

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="GoPNG"
        style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, display: 'block' }}
      />
    )
  }

  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#000', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#CE1126', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⭐</div>
    </div>
  )
}
