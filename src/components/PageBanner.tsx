import { Breadcrumbs } from './Breadcrumbs'

interface BreadcrumbItem { label: string; href?: string }

interface PageBannerProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  aside?: React.ReactNode
}

export function PageBanner({ title, subtitle, breadcrumbs, aside }: PageBannerProps) {
  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB', padding: '40px 0 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: '#000716', margin: 0, letterSpacing: '-0.01em', maxWidth: 640 }}>{title}</h1>
            {subtitle && (
              <p style={{ color: '#545B64', marginTop: 10, fontSize: 15, lineHeight: 1.6, maxWidth: 640 }}>{subtitle}</p>
            )}
          </div>
          {aside && <div style={{ flexShrink: 0, fontSize: 14, color: '#687078' }}>{aside}</div>}
        </div>
      </div>
    </section>
  )
}
