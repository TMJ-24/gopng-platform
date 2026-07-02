import Link from 'next/link'

type Crumb = { label: string; href?: string }

const FONT = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 6px', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: '#aaa' }}>
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  fontFamily: FONT,
                  fontSize: '0.875rem',
                  color: '#4a6fa5',
                  textDecoration: 'none',
                  fontWeight: 400,
                }}
                className="breadcrumb-link"
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ fontFamily: FONT, fontSize: '0.875rem', color: '#555', fontWeight: 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <style>{`.breadcrumb-link:hover { text-decoration: underline; }`}</style>
    </nav>
  )
}
