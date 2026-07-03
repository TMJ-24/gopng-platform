import Link from 'next/link'
import { ArrowIcon } from './ArrowIcon'
import { C } from './theme'

const PALE_BG = '#F4E9F6'

type Props = {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
}

export function CTASection({ title, description, ctaLabel = 'Login to Portal', ctaHref = '/admin' }: Props) {
  return (
    <section style={{ padding: '64px 24px', background: PALE_BG, textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: C.text, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.65, margin: '0 0 28px' }}>
          {description}
        </p>
        <Link
          href={ctaHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700,
            background: C.red, color: '#FFFFFF', textDecoration: 'none',
          }}
        >
          {ctaLabel}
          <ArrowIcon color="#FFFFFF" />
        </Link>
      </div>
    </section>
  )
}
