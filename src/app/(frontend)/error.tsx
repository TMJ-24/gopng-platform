'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 24px', textAlign: 'center' }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D5DBDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#000716', margin: '16px 0 0' }}>Something went wrong</h1>
      <p style={{ color: '#545B64', marginTop: 8, maxWidth: 400, lineHeight: 1.6 }}>
        An unexpected error occurred. Please try again.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button
          onClick={reset}
          style={{ background: '#0972D3', color: '#FFFFFF', padding: '10px 24px', borderRadius: 4, fontSize: 14, fontWeight: 700, border: '1px solid #0972D3', cursor: 'pointer' }}
        >
          Try Again
        </button>
        <Link
          href="/"
          style={{ background: '#F2F3F3', color: '#000716', padding: '10px 24px', borderRadius: 4, fontSize: 14, fontWeight: 700, border: '1px solid #D5DBDB', textDecoration: 'none' }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
