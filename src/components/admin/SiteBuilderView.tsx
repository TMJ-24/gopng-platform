'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteWizardView } from './SiteWizard'

export function SiteBuilderView() {
  return (
    <div style={{
      fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif',
      minHeight: '100vh',
      background: '#F2F3F3',
    }}>
      {/* Back bar */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #D5DBDB',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Link
          href="/admin/collections/sites"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#0972D3', textDecoration: 'none', fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} />
          Back to Sites
        </Link>
        <span style={{ color: '#D5DBDB' }}>|</span>
        <span style={{ fontSize: 13, color: '#545B64' }}>Site Builder</span>
      </div>

      {/* Wizard */}
      <SiteWizardView />
    </div>
  )
}
