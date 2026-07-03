import React from 'react'

export function AdminLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0', textAlign: 'center' }}>
      <img
        src="/cresent.png"
        alt="Government of Papua New Guinea"
        style={{ width: 64, height: 64, objectFit: 'contain', display: 'block' }}
      />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CE1126', marginBottom: 4 }}>
          Government of Papua New Guinea
        </div>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.02em' }}>GoPNG Website Platform</div>
      </div>
      <a href="/" style={{ fontSize: 13, fontWeight: 600, color: '#687078', textDecoration: 'none' }}>
        ← Back to website
      </a>
    </div>
  )
}
