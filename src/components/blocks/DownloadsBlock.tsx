'use client'

import { mediaUrl } from '@/lib/media'

type DownloadsBlockData = {
  heading?: string
  items?: { label: string; file?: { url?: string; filesize?: number } }[]
}

export function DownloadsBlock({ block }: { block: DownloadsBlockData }) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <div style={{ marginBottom: 24 }}>
      {block.heading && (
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 14px' }}>{block.heading}</h3>
      )}
      <div style={{ border: '1px solid #D5DBDB', borderRadius: 8, overflow: 'hidden' }}>
        {items.map((item, i) => {
          const href = mediaUrl(item.file?.url)
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                textDecoration: 'none', color: '#0972D3', fontSize: 14, fontWeight: 600,
                borderBottom: i < items.length - 1 ? '1px solid #D5DBDB' : 'none',
                background: '#FFFFFF',
              }}
            >
              <span aria-hidden="true">⬇</span>
              {item.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
