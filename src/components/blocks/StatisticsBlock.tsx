'use client'

type StatisticsBlockData = {
  heading?: string
  stats?: { value: string; label: string }[]
}

export function StatisticsBlock({ block }: { block: StatisticsBlockData }) {
  const stats = block.stats ?? []
  if (!stats.length) return null

  return (
    <div style={{ marginBottom: 24, background: '#232F3E', borderRadius: 12, padding: '32px 24px' }}>
      {block.heading && (
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', margin: '0 0 20px', textAlign: 'center' }}>{block.heading}</h3>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 0 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '4px 16px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 700, color: '#FF9900', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ color: '#8D99A8', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
