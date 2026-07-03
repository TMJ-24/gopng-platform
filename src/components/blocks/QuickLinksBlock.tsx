'use client'

import Link from 'next/link'

type QuickLinksBlockData = {
  heading?: string
  links?: { label: string; href: string; openInNewTab?: boolean }[]
}

export function QuickLinksBlock({ block }: { block: QuickLinksBlockData }) {
  const links = block.links ?? []
  if (!links.length) return null

  return (
    <div style={{ marginBottom: 24 }}>
      {block.heading && (
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 14px' }}>{block.heading}</h3>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            target={link.openInNewTab ? '_blank' : undefined}
            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              borderRadius: 4, textDecoration: 'none', border: '1px solid #D5DBDB',
              color: '#0972D3', fontSize: 13, fontWeight: 600, background: '#FFFFFF',
            }}
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}
