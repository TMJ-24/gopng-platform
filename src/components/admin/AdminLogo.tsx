import React from 'react'

export function AdminLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0', textAlign: 'center' }}>
      <img
        src="/cresent.png"
        alt="Government of Papua New Guinea"
        style={{ width: 56, height: 56, objectFit: 'contain', display: 'block' }}
      />
      <div>
        <div style={{ fontWeight: 900, fontSize: 18, color: '#000716', letterSpacing: '-0.02em' }}>GoPNG</div>
        <div style={{ fontSize: 11, color: '#687078', fontWeight: 500 }}>Website Platform</div>
      </div>
    </div>
  )
}
