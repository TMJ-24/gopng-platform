'use client'

import React, { useState } from 'react'
import { useAuth } from '@payloadcms/ui'

type WizardStep = 'details' | 'admin' | 'review' | 'success'

type WizardData = {
  siteName: string
  domain: string
  agencyType: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
}

const AGENCY_TYPES = [
  { label: 'Ministry',               value: 'ministry' },
  { label: 'Department',             value: 'department' },
  { label: 'Statutory Authority',    value: 'authority' },
  { label: 'Commission',             value: 'commission' },
  { label: 'Statutory Body',         value: 'statutory-body' },
  { label: 'Provincial Government',  value: 'provincial' },
  { label: 'State-Owned Enterprise', value: 'soe' },
]

const ADMIN_STEPS: WizardStep[] = ['details', 'admin', 'review']
const ADMIN_STEP_LABELS = ['Site Details', 'Admin User', 'Review']
const EDITOR_STEPS: WizardStep[] = ['details', 'review']
const EDITOR_STEP_LABELS = ['Site Details', 'Review']

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db',
  fontSize: 14, color: '#111827', background: 'white', boxSizing: 'border-box',
}

export function SiteWizardView() {
  const { token, user } = useAuth()
  const isEditor = (user as any)?.role === 'editor'
  const STEPS = isEditor ? EDITOR_STEPS : ADMIN_STEPS
  const STEP_LABELS = isEditor ? EDITOR_STEP_LABELS : ADMIN_STEP_LABELS
  const [step, setStep] = useState<WizardStep>('details')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [launched, setLaunched] = useState<any>(null)

  const BLANK: WizardData = {
    siteName: '', domain: '', agencyType: 'department',
    adminFirstName: '', adminLastName: '', adminEmail: '',
  }

  const [data, setData] = useState<WizardData>(BLANK)

  const set = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData(prev => ({ ...prev, [key]: value }))

  const stepIndex = STEPS.indexOf(step)
  const canNext = () => {
    if (step === 'details') return !!data.siteName.trim() && !!data.domain.trim()
    if (step === 'admin') return !!data.adminEmail.trim()
    return true
  }
  const next = () => { const i = STEPS.indexOf(step); if (i < STEPS.length - 1) setStep(STEPS[i + 1]) }
  const back = () => { const i = STEPS.indexOf(step); if (i > 0) setStep(STEPS[i - 1]) }

  const handleLaunch = async () => {
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/provision-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
        body: JSON.stringify({
          siteName: data.siteName, domain: data.domain, agencyType: data.agencyType,
          adminEmail: data.adminEmail, adminFirstName: data.adminFirstName, adminLastName: data.adminLastName,
        }),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error ?? 'Launch failed')
      setLaunched(result)
      setStep('success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── SUCCESS ──────────────────────────────────────────────────────────
  if (step === 'success' && launched) {
    return (
      <div style={{ maxWidth: 640, margin: '48px auto', padding: '0 24px' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#166534', marginBottom: 8 }}>{launched.site.name} is Live!</h2>
          <p style={{ color: '#15803d', marginBottom: 24 }}>
            Provisioned successfully. Welcome email sent to {launched.adminUser.email}.
          </p>
          <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left', fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}><strong>Domain:</strong> {launched.site.domain}</div>
            <div style={{ marginBottom: 8 }}><strong>Admin Email:</strong> {launched.adminUser.email}</div>
            <div>
              <strong>Static site repo:</strong>{' '}
              <span style={{ color: '#6b7280' }}>Provisioning — check the Sites collection for repo status.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/admin/collections/sites" style={{ padding: '10px 24px', background: '#374151', color: 'white', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
              View All Sites
            </a>
            <button
              onClick={() => { setStep('details'); setLaunched(null); setData(BLANK) }}
              style={{ padding: '10px 24px', background: 'white', color: '#374151', borderRadius: 8, fontWeight: 600, border: '1px solid #d1d5db', cursor: 'pointer', fontSize: 14 }}
            >
              Launch Another Site
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: 0 }}>🚀 Launch New Government Website</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>Provision a new site in under 2 minutes.</p>
      </div>

      {/* Step progress bar */}
      <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb', marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{
            flex: 1, padding: '10px 6px', textAlign: 'center', fontSize: 12,
            fontWeight: s === step ? 700 : 500,
            color: i < stepIndex ? '#166534' : s === step ? '#111827' : '#9ca3af',
            background: i < stepIndex ? '#f0fdf4' : s === step ? 'white' : '#f9fafb',
            borderRight: i < STEPS.length - 1 ? '1px solid #e5e7eb' : 'none',
          }}>
            {i < stepIndex ? '✓ ' : `${i + 1}. `}{STEP_LABELS[i]}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── STEP 1: DETAILS ── */}
      {step === 'details' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Site Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Site / Agency Name *</label>
              <input style={inputStyle} value={data.siteName} onChange={e => set('siteName', e.target.value)} placeholder="Ministry of Finance" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Domain Name *</label>
              <input style={inputStyle} value={data.domain} onChange={e => set('domain', e.target.value)} placeholder="mof.gov.pg" />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Full domain — e.g. mof.gov.pg or treasury.gov.pg</p>
            </div>
            <div>
              <label style={labelStyle}>Agency Type *</label>
              <select style={inputStyle} value={data.agencyType} onChange={e => set('agencyType', e.target.value)}>
                {AGENCY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: ADMIN ── */}
      {step === 'admin' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#111827' }}>Site Administrator</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>This person manages the site. They will receive login credentials by email.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={data.adminFirstName} onChange={e => set('adminFirstName', e.target.value)} placeholder="John" />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={data.adminLastName} onChange={e => set('adminLastName', e.target.value)} placeholder="Smith" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Admin Email *</label>
              <input style={inputStyle} type="email" value={data.adminEmail} onChange={e => set('adminEmail', e.target.value)} placeholder="john.smith@mof.gov.pg" />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Login credentials are emailed here on launch.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW ── */}
      {step === 'review' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Review &amp; Launch</h2>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            {([
              ['Site Name',     data.siteName],
              ['Domain',        data.domain],
              ['Agency Type',   AGENCY_TYPES.find(t => t.value === data.agencyType)?.label ?? data.agencyType],
              ...(isEditor ? [] : [
                ['Admin Email', data.adminEmail],
                ['Admin Name',  [data.adminFirstName, data.adminLastName].filter(Boolean).join(' ') || '—'],
              ]),
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', padding: '11px 18px', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ width: 150, fontWeight: 600, color: '#374151', flexShrink: 0 }}>{label}</span>
                <span style={{ color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '11px 16px', color: '#92400e', fontSize: 13 }}>
            {isEditor
              ? <>⚠️ This will create your site, provision its static repository, assign it to your account, and email you when it&apos;s live.</>
              : <>⚠️ This will create the site record, an editor user, provision its static repository, and send a welcome email to <strong>{data.adminEmail}</strong>.</>
            }
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          style={{ padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, background: 'white', color: '#374151', border: '1px solid #d1d5db', cursor: stepIndex === 0 ? 'not-allowed' : 'pointer', opacity: stepIndex === 0 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        {step === 'review' ? (
          <button
            type="button"
            onClick={handleLaunch}
            disabled={submitting}
            style={{ padding: '10px 26px', borderRadius: 8, fontWeight: 700, fontSize: 14, background: '#374151', color: 'white', border: 'none', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Launching…' : '🚀 Launch Site'}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canNext()}
            style={{ padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, background: canNext() ? '#374151' : '#d1d5db', color: 'white', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed' }}
          >
            Next: {STEP_LABELS[stepIndex + 1] ?? 'Launch'} →
          </button>
        )}
      </div>
    </div>
  )
}
