'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'
import { DocumentIcon } from '@/components/Icons'

const KEY_CATEGORIES = ['policy', 'legislation', 'budget']

export function MinistryDocuments() {
  const site = useSite()
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!site?.id) return
    fetch(`/api/documents?where[site][equals]=${site.id}&where[category][in]=${KEY_CATEGORIES.join(',')}&sort=-createdAt&limit=6&depth=1`)
      .then(r => r.json())
      .then(data => { setDocs(data.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [site?.id])

  if (!loading && docs.length === 0) return null

  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: '#1a2b4a', margin: 0, letterSpacing: '-0.01em' }}>
            Key Documents
          </h2>
          <Link href="/publications" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary, #CC0000)', textDecoration: 'none' }}>All publications →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 52, background: '#F2F3F3', borderRadius: 4 }} />)}
          </div>
        ) : (
          <div style={{ border: '1px solid #D5DBDB', borderRadius: 8, overflow: 'hidden' }}>
            {docs.map((doc: any, i: number) => (
              <a
                key={doc.id}
                href={mediaUrl(doc.file?.url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  textDecoration: 'none', borderBottom: i < docs.length - 1 ? '1px solid #D5DBDB' : 'none',
                  background: '#FFFFFF',
                }}
                className="ministry-doc-row"
              >
                <DocumentIcon size={16} style={{ color: 'var(--color-primary, #CC0000)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#000716' }}>{doc.title}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#687078', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#F2F3F3', padding: '3px 9px', borderRadius: 12 }}>
                  {doc.category}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
      <style>{`.ministry-doc-row:hover { background: #F2F3F3 !important; }`}</style>
    </section>
  )
}
