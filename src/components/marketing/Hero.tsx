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
// consistently across PageBanner/HeroSection/HeroBlock). Home uses the same flat,
// faded treatment but in a soft orange tone, for a warmer landing surface — both
// are light backgrounds, so both use the same dark text scheme.
const PALE_BG = '#F4E9F6'
const FADED_RED_BG = '#F6DEDB'

export function Hero({ eyebrow, title, description, ctas, compact }: Props) {
  const bg = compact ? PALE_BG : FADED_RED_BG
  const accent = C.redDark

  const textBlock = (
    <div style={{ textAlign: 'left' }}>
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, margin: '0 0 16px' }}>
        {eyebrow}
      </p>
      <h1 style={{ fontSize: compact ? 'clamp(28px, 4.5vw, 40px)' : 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.text, margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
        {title}
      </h1>
      <p style={{ fontSize: 18, color: C.textSub, lineHeight: 1.7, margin: '0', maxWidth: compact ? 640 : 520 }}>
        {description}
      </p>
      {ctas && ctas.length > 0 && (
        <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {ctas.map(cta => (
            <Link
              key={cta.href}
              href={cta.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 30px', borderRadius: 6, fontSize: 16, fontWeight: 700,
                textDecoration: 'none',
                background: cta.primary ? C.red : 'transparent',
                color: cta.primary ? '#FFFFFF' : C.text,
                border: cta.primary ? 'none' : '1px solid rgba(0,0,0,0.25)',
              }}
            >
              {cta.label}
              {cta.primary && <ArrowIcon color="#FFFFFF" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  if (compact) {
    return (
      <section style={{ position: 'relative', overflow: 'hidden', background: bg }}>
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
        <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', padding: '64px 24px 56px' }}>
          {textBlock}
        </div>
      </section>
    )
  }

  // Home hero is split into two halves: copy + CTAs on the left, a real photo
  // of Parliament House, Port Moresby on the right (Brian Ireland, CC BY-SA 2.0,
  // via Wikimedia Commons), in place of the crest watermark used elsewhere.
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: bg }}>
      <div
        style={{
          position: 'relative', maxWidth: 1120, margin: '0 auto', padding: '100px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 48, alignItems: 'center',
        }}
      >
        {textBlock}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="/hero-parliament.jpg"
            alt="Parliament House, Port Moresby"
            style={{ width: '100%', maxWidth: 480, objectFit: 'cover', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}
          />
        </div>
      </div>
    </section>
  )
}
