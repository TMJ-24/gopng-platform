import { C } from './theme'

// Same pale hero background used on About Us (#F4E9F6) rather than fabricated
// platform-usage numbers on a dark band — the one number here that IS about the
// platform itself (organizations) is real, fetched from the live Sites registry.
const PALE_BG = '#F4E9F6'

type Stat = { value: string; label: string }

export function StatsSection({ organizationCount }: { organizationCount: number }) {
  const stats: Stat[] = [
    { value: String(organizationCount), label: organizationCount === 1 ? 'Organization Using the Platform' : 'Organizations Using the Platform' },
    { value: '1975', label: 'Year of Independence' },
    { value: '22',   label: 'Provinces' },
    { value: '89',   label: 'Districts' },
  ]

  return (
    <section style={{ padding: '64px 24px', background: PALE_BG }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
        {stats.map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.red, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 10 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
