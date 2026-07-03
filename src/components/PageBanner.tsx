import { Breadcrumbs } from './Breadcrumbs'

const FONT = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

interface BreadcrumbItem { label: string; href?: string }

interface PageBannerProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  searchPlaceholder?: string
  aside?: React.ReactNode
}

export function PageBanner({ title, subtitle, breadcrumbs, searchPlaceholder, aside }: PageBannerProps) {
  return (
    <section style={{
      background: '#F4E9F6',
      padding: '40px 0 36px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {breadcrumbs && (
          <div style={{ marginBottom: 16 }}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <h1 style={{
          fontFamily: FONT,
          fontSize: 'calc(1.375rem + 1.5vw)',
          fontWeight: 800,
          color: '#1a2b4a',
          margin: '0 0 10px',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{
            fontFamily: FONT,
            fontSize: '1rem',
            fontWeight: 400,
            color: '#555555',
            margin: '0 0 24px',
            lineHeight: 1.6,
            maxWidth: 640,
          }}>
            {subtitle}
          </p>
        )}

        {searchPlaceholder && (
          <div style={{ position: 'relative', maxWidth: 600, marginTop: subtitle ? 0 : 24 }}>
            <svg
              width="18" height="18" viewBox="0 0 18 18" fill="none"
              aria-hidden="true"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }}
            >
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={searchPlaceholder}
              style={{
                fontFamily: FONT,
                width: '100%',
                padding: '12px 16px 12px 42px',
                fontSize: '1rem',
                color: '#333',
                background: '#ffffff',
                border: '1.5px solid var(--color-primary, #CC0000)',
                borderRadius: 6,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {aside && (
          <div style={{ fontFamily: FONT, fontSize: '0.875rem', color: '#777', marginTop: 12 }}>{aside}</div>
        )}
      </div>
    </section>
  )
}
