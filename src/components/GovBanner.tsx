'use client'

import { useState } from 'react'
import { GlobeIcon, LockIcon } from './Icons'

export function GovBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#f8f8f8', borderBottom: '1px solid #e0e0e0', fontSize: 12 }}>

      {/* ── Masthead bar ─────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* PNG bird of paradise emblem placeholder */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="#CC0000" stroke="#CC0000" strokeWidth="0.5" />
            <circle cx="10" cy="10" r="9" fill="none" stroke="#FFD700" strokeWidth="1" />
            <path d="M10 4c0 0-2 3-2 6s2 6 2 6 2-3 2-6-2-6-2-6z" fill="#FFD700" />
            <path d="M4 10c0 0 3-2 6-2s6 2 6 2-3 2-6 2-6-2-6-2z" fill="#FFD700" />
          </svg>
          <span style={{ color: '#333333', fontWeight: 500 }}>
            An Official PNG Government Website
          </span>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#0066cc', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            padding: 0, flexShrink: 0, whiteSpace: 'nowrap',
            textDecoration: 'underline',
          }}
          aria-expanded={open}
        >
          How to identify
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M2 4l4 4 4-4" stroke="#0066cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Expanded info panel ───────────────────────── */}
      {open && (
        <div style={{ background: '#f0f4f8', borderTop: '1px solid #dde3ea' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '18px 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20,
          }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #aab4be', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GlobeIcon size={16} style={{ color: '#555' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111', margin: '0 0 4px', fontSize: 13, lineHeight: 1.4 }}>Official websites use .gov.pg</p>
                <p style={{ color: '#555', lineHeight: 1.6, fontSize: 12, margin: 0 }}>
                  A <strong style={{ color: '#111' }}>.gov.pg</strong> website belongs to an official PNG government ministry, department, or agency.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #2d7a2d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LockIcon size={16} style={{ color: '#2d7a2d' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111', margin: '0 0 4px', fontSize: 13, lineHeight: 1.4 }}>Secure websites use HTTPS</p>
                <p style={{ color: '#555', lineHeight: 1.6, fontSize: 12, margin: 0 }}>
                  Look for a <strong style={{ color: '#111' }}>lock icon</strong> or <strong style={{ color: '#111' }}>https://</strong> before sharing personal information.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
