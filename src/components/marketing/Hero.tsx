import Link from 'next/link'
import { ArrowIcon } from './ArrowIcon'
import { C } from './theme'

type CTA = { label: string; href: string; primary?: boolean }

type Props = {
  eyebrow: string
  title: string
  description: string
  ctas?: CTA[]
  compact?: boolean
}

// Interior pages (About Us, What We Do) use the pale hero background already
// established and approved earlier this session (#F4E9F6, previously applied
// consistently across PageBanner/HeroSection/HeroBlock) — Home keeps the bolder
// red/gold banner treatment as the primary landing surface.
const PALE_BG = '#F4E9F6'

export function Hero({ eyebrow, title, description, ctas, compact }: Props) {
  const pale = compact

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: pale ? PALE_BG : `linear-gradient(135deg, ${C.red} 0%, ${C.redDark} 60%, ${C.black} 130%)`,
      }}
    >
      {/* No real photography exists yet — the national crest stands in as a large,
          faded background image rather than a flat colour band. */}
      {!pale && (
        <img
          src="/cresent.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 640, height: 640, objectFit: 'contain',
            transform: 'translate(-50%, -50%)',
            opacity: 0.1, pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: compact ? '56px 24px 48px' : '76px 24px 64px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: pale ? C.redDark : C.gold, margin: '0 0 14px' }}>
          {eyebrow}
        </p>
        <h1 style={{ fontSize: compact ? 'clamp(26px, 4vw, 36px)' : 'clamp(28px, 4.5vw, 42px)', fontWeight: 800, color: pale ? C.text : '#FFFFFF', margin: '0 0 18px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
          {title}
        </h1>
        <p style={{ fontSize: 16, color: pale ? C.textSub : 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0 auto', maxWidth: 620 }}>
          {description}
        </p>
        {ctas && ctas.length > 0 && (
          <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ctas.map(cta => (
              <Link
                key={cta.href}
                href={cta.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 6, fontSize: 15, fontWeight: 700,
                  textDecoration: 'none',
                  background: cta.primary ? (pale ? C.red : C.gold) : 'transparent',
                  color: cta.primary ? (pale ? '#FFFFFF' : '#1A1200') : (pale ? C.text : '#FFFFFF'),
                  border: cta.primary ? 'none' : `1px solid ${pale ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)'}`,
                }}
              >
                {cta.label}
                {cta.primary && <ArrowIcon color={pale ? '#FFFFFF' : '#1A1200'} />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
