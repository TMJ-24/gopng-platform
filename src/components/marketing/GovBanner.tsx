'use client'

import { useState } from 'react'
import { PngFlag } from './PngFlag'

const CONTAINER: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 24px' }

function ExpandIcon({ open }: { open: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#2D7A2D" strokeWidth="1.5">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function ShieldAlertIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="1.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M12 8v5M12 16v.01" strokeLinecap="round" />
    </svg>
  )
}

const PANEL_ITEMS = [
  {
    icon: <GlobeIcon />,
    borderColor: '#aab4be',
    title: 'Official websites use .gov.pg',
    body: <>A <strong style={{ color: '#111' }}>.gov.pg</strong> website belongs to an official PNG government ministry, department, or agency.</>,
  },
  {
    icon: <LockIcon />,
    borderColor: '#2d7a2d',
    title: 'Secure websites use HTTPS',
    body: <>Look for a <strong style={{ color: '#111' }}>lock icon</strong> or <strong style={{ color: '#111' }}>https://</strong> before sharing personal information.</>,
  },
  {
    icon: <ShieldAlertIcon />,
    borderColor: '#B45309',
    title: 'Know the signs of a scam',
    // Placeholder number — confirm the real PNG helpline before relying on this.
    body: <>Government officials will never ask you to transfer money over the phone. Call <strong style={{ color: '#111' }}>+675 XXX XXXX</strong> if you&apos;re unsure.</>,
  },
]

// A faithful clone of gov.sg's identification masthead — matched against a real gov.sg
// screenshot earlier this session and already approved. The "How to identify" panel now
// folds the scam-awareness message in as a third item (previously a separate dismissible
// notice), and the masthead icon is the PNG national flag rather than a generic emblem.
export function GovBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#f8f8f8', borderBottom: '1px solid #e0e0e0', fontSize: 13 }}>
      <div style={{ ...CONTAINER, padding: '6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 4, columnGap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PngFlag size={14} />
          <span style={{ color: '#333333', fontWeight: 500, fontSize: 13 }}>An Official PNG Government Website</span>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0066cc', fontSize: 13, fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          How to identify
          <ExpandIcon open={open} />
        </button>
      </div>

      {open && (
        <div style={{ background: '#f0f4f8', borderTop: '1px solid #dde3ea' }}>
          <div style={{ ...CONTAINER, padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {PANEL_ITEMS.map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${item.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#111', marginBottom: 4, fontSize: 14, lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ color: '#555', lineHeight: 1.6, fontSize: 13 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
