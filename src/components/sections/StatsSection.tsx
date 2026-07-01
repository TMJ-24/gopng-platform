'use client'

const STATS = [
  { value: '9.7M+', label: 'Citizens Served' },
  { value: '22',    label: 'Provinces' },
  { value: '100+',  label: 'Government Agencies' },
  { value: '1975',  label: 'Year of Independence' },
]

export function StatsSection() {
  return (
    <section style={{ background: '#232F3E', borderTop: '2px solid #FF9900', borderBottom: '1px solid #1A2536' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0 }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                padding: '8px 24px',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <div style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700, color: '#FF9900', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ color: '#8D99A8', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
