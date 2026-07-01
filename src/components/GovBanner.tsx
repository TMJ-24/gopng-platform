'use client'

import { useState } from 'react'
import { GlobeIcon, LockIcon } from './Icons'

export function GovBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#1A2536', borderBottom: '1px solid #31465F', fontSize: 12 }}>

      {/* ── Masthead bar ─────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#B0BAC4', fontWeight: 500 }}>
          An Official Website of the Government of Papua New Guinea
        </span>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#FF9900', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            padding: 0, flexShrink: 0, whiteSpace: 'nowrap',
          }}
          aria-expanded={open}
        >
          How to identify
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M2 4l4 4 4-4" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Expanded info panel ───────────────────────── */}
      {open && (
        <div style={{ background: '#0F1923', borderTop: '1px solid #31465F' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '18px 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20,
          }}>

            {/* Globe row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #687078', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GlobeIcon size={16} style={{ color: '#B0BAC4' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px', fontSize: 13, lineHeight: 1.4 }}>Official websites use .gov.pg</p>
                <p style={{ color: '#8D99A8', lineHeight: 1.6, fontSize: 12, margin: 0 }}>
                  A <strong style={{ color: '#D5DBDB' }}>.gov.pg</strong> website belongs to an official PNG government ministry, department, or agency.
                </p>
              </div>
            </div>

            {/* Lock row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #1D8348', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LockIcon size={16} style={{ color: '#1D8348' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px', fontSize: 13, lineHeight: 1.4 }}>Secure websites use HTTPS</p>
                <p style={{ color: '#8D99A8', lineHeight: 1.6, fontSize: 12, margin: 0 }}>
                  Look for a <strong style={{ color: '#D5DBDB' }}>lock icon</strong> or <strong style={{ color: '#D5DBDB' }}>https://</strong> before sharing personal information.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
