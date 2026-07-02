'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { useAuth } from '@payloadcms/ui'

type DeployStatus = 'none' | 'building' | 'deployed' | 'failed'

const STATUS_STYLES: Record<DeployStatus, React.CSSProperties> = {
  none:      { background: '#f3f4f6', color: '#6b7280' },
  building:  { background: '#fffbeb', color: '#92400e' },
  deployed:  { background: '#f0fdf4', color: '#166534' },
  failed:    { background: '#fef2f2', color: '#dc2626' },
}

const STATUS_LABELS: Record<DeployStatus, string> = {
  none:     'Not deployed',
  building: 'Building…',
  deployed: 'Deployed',
  failed:   'Build failed',
}

const STATUS_ICONS: Record<DeployStatus, string> = {
  none:     '○',
  building: '⟳',
  deployed: '✓',
  failed:   '✗',
}

export function RedeployButton() {
  const { id, savedDocumentData } = useDocumentInfo()
  const { token } = useAuth()
  const [busy, setBusy] = useState(false)
  const [localStatus, setLocalStatus] = useState<DeployStatus | null>(null)
  const [error, setError] = useState('')

  // Don't render until the doc is saved and has a repo
  const repoName = (savedDocumentData as any)?.repoName
  if (!id || !repoName) return null

  const rawStatus = (savedDocumentData as any)?.deployStatus as DeployStatus | undefined
  const status: DeployStatus = localStatus ?? rawStatus ?? 'none'

  const handleRedeploy = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/redeploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        body: JSON.stringify({ siteId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Deploy failed')
      setLocalStatus('building')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      margin: '0 0 24px',
      padding: '16px 20px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      {/* Status badge */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
        ...STATUS_STYLES[status],
      }}>
        <span style={{ animation: status === 'building' ? 'spin 1s linear infinite' : 'none' }}>
          {STATUS_ICONS[status]}
        </span>
        {STATUS_LABELS[status]}
      </span>

      {/* Repo link */}
      <a
        href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ORG ?? ''}/${repoName}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
      >
        {repoName} ↗
      </a>

      <div style={{ flex: 1 }} />

      {/* Redeploy button */}
      <button
        type="button"
        onClick={handleRedeploy}
        disabled={busy || status === 'building'}
        style={{
          padding: '8px 18px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 13,
          background: busy || status === 'building' ? '#d1d5db' : '#374151',
          color: 'white',
          border: 'none',
          cursor: busy || status === 'building' ? 'not-allowed' : 'pointer',
        }}
      >
        {busy ? 'Triggering…' : '↺ Redeploy'}
      </button>

      {error && (
        <span style={{ width: '100%', fontSize: 12, color: '#dc2626', marginTop: -8 }}>
          {error}
        </span>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
