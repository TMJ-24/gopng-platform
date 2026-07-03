'use client'

import { mediaUrl } from '@/lib/media'

type GalleryBlockData = {
  heading?: string
  images?: { image?: { url?: string; alt?: string }; caption?: string }[]
}

export function GalleryBlock({ block }: { block: GalleryBlockData }) {
  const images = block.images ?? []
  if (!images.length) return null

  return (
    <div style={{ marginBottom: 24 }}>
      {block.heading && (
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#000716', margin: '0 0 14px' }}>{block.heading}</h3>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {images.map((item, i) => {
          const src = mediaUrl(item.image?.url)
          return (
            <figure key={i} style={{ margin: 0 }}>
              <div style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 8, overflow: 'hidden', background: '#F2F3F3' }}>
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={item.image?.alt ?? item.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </div>
              {item.caption && (
                <figcaption style={{ fontSize: 12, color: '#545B64', marginTop: 6 }}>{item.caption}</figcaption>
              )}
            </figure>
          )
        })}
      </div>
    </div>
  )
}
