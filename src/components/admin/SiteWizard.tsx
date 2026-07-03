'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@payloadcms/ui'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type WizardStep = 'template' | 'sections' | 'details' | 'admin' | 'review' | 'success'

type Section = { type: string; label: string; enabled: boolean }

type Template = {
  id: string
  name: string
  category: string
  description?: string
  thumbnail?: { url: string }
  sections?: { type: string; enabled: boolean }[]
}

type WizardData = {
  templateId: string | null
  templateName: string
  sections: Section[]
  siteName: string
  domain: string
  agencyType: string
  theme: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

const SECTION_LABELS: Record<string, string> = {
  hero:      'Hero (Search + CTA)',
  services:  'Citizen Services',
  stats:     'Stats Counter',
  news:      'Government News',
  directory: 'Agency Directory',
  opendata:  'Open Data',
  about:     'About / Mission',
  cta:       'Contact CTA',
}

const DEFAULT_SECTIONS: Section[] = [
  { type: 'hero',      label: 'Hero (Search + CTA)',  enabled: true },
  { type: 'services',  label: 'Citizen Services',      enabled: true },
  { type: 'stats',     label: 'Stats Counter',          enabled: true },
  { type: 'news',      label: 'Government News',        enabled: true },
  { type: 'directory', label: 'Agency Directory',       enabled: true },
  { type: 'opendata',  label: 'Open Data',              enabled: true },
  { type: 'cta',       label: 'Contact CTA',            enabled: true },
]

const AGENCY_TYPES = [
  { label: 'Ministry',               value: 'ministry' },
  { label: 'Department',             value: 'department' },
  { label: 'Statutory Authority',    value: 'authority' },
  { label: 'Commission',             value: 'commission' },
  { label: 'Statutory Body',         value: 'statutory-body' },
  { label: 'Provincial Government',  value: 'provincial' },
  { label: 'State-Owned Enterprise', value: 'soe' },
]

const THEMES = [
  { label: 'Dark Grey (Default)', value: 'default' },
  { label: 'Blue (GoPNG)',        value: 'blue' },
  { label: 'Green',               value: 'green' },
  { label: 'Red',                 value: 'red' },
]

const CATEGORY_LABELS: Record<string, string> = {
  portal:          'National Portal',
  ministry:        'Ministry Website',
  department:      'Department Website',
  provincial:      'Provincial Government',
  authority:       'Statutory Authority',
  commission:      'Commission Website',
  'statutory-body': 'Statutory Body Website',
  soe:             'State-Owned Enterprise Website',
}

const STEPS: WizardStep[] = ['template', 'sections', 'details', 'admin', 'review']
const STEP_LABELS = ['Template', 'Sections', 'Site Details', 'Admin User', 'Review']

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db',
  fontSize: 14, color: '#111827', background: 'white', boxSizing: 'border-box',
}

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="4" y="3" width="2" height="2" rx="1" />
      <rect x="10" y="3" width="2" height="2" rx="1" />
      <rect x="4" y="7" width="2" height="2" rx="1" />
      <rect x="10" y="7" width="2" height="2" rx="1" />
      <rect x="4" y="11" width="2" height="2" rx="1" />
      <rect x="10" y="11" width="2" height="2" rx="1" />
    </svg>
  )
}

function SortableSectionRow({ section, onToggle }: { section: Section; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.type })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 8, marginBottom: 8,
        background: section.enabled ? 'white' : '#f9fafb',
        border: `1px solid ${section.enabled ? '#e5e7eb' : '#f3f4f6'}`,
      }}
    >
      <button
        type="button"
        style={{ cursor: 'grab', color: '#d1d5db', background: 'none', border: 'none', padding: 0, lineHeight: 0, touchAction: 'none' }}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <DragHandleIcon />
      </button>
      <input
        type="checkbox"
        id={`section-${section.type}`}
        checked={section.enabled}
        onChange={onToggle}
        style={{ width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
      />
      <label
        htmlFor={`section-${section.type}`}
        style={{ flex: 1, fontSize: 14, fontWeight: 600, color: section.enabled ? '#111827' : '#9ca3af', cursor: 'pointer' }}
      >
        {section.label}
      </label>
      <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
        {section.type}
      </span>
    </div>
  )
}

export function SiteWizardView() {
  const { token } = useAuth()
  const [step, setStep] = useState<WizardStep>('template')
  const [templates, setTemplates] = useState<Template[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [launched, setLaunched] = useState<any>(null)

  const BLANK: WizardData = {
    templateId: null, templateName: '', sections: DEFAULT_SECTIONS,
    siteName: '', domain: '', agencyType: 'department', theme: 'default',
    adminFirstName: '', adminLastName: '', adminEmail: '',
    contactEmail: '', contactPhone: '', contactAddress: '',
  }

  const [data, setData] = useState<WizardData>(BLANK)

  useEffect(() => {
    fetch('/api/templates?limit=50&where[isActive][equals]=true')
      .then(r => r.json())
      .then(d => setTemplates(d.docs ?? []))
      .catch(console.error)
  }, [])

  const set = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData(prev => ({ ...prev, [key]: value }))

  const selectTemplate = (t: Template | null) => {
    if (!t) { set('templateId', null); set('templateName', ''); set('sections', DEFAULT_SECTIONS); return }
    set('templateId', t.id)
    set('templateName', t.name)
    if (t.sections?.length) {
      set('sections', t.sections.map(s => ({
        type: s.type, label: SECTION_LABELS[s.type] ?? s.type, enabled: s.enabled !== false,
      })))
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      set('sections', arrayMove(
        data.sections,
        data.sections.findIndex(s => s.type === active.id),
        data.sections.findIndex(s => s.type === over.id),
      ))
    }
  }

  const toggleSection = (type: string) =>
    set('sections', data.sections.map(s => s.type === type ? { ...s, enabled: !s.enabled } : s))

  const stepIndex = STEPS.indexOf(step)
  const canNext = () => {
    if (step === 'template') return true
    if (step === 'sections') return data.sections.some(s => s.enabled)
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
          theme: data.theme, templateId: data.templateId,
          adminEmail: data.adminEmail, adminFirstName: data.adminFirstName, adminLastName: data.adminLastName,
          contactEmail: data.contactEmail || data.adminEmail, contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
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
              <strong>Admin Panel:</strong>{' '}
              <a href={`https://${launched.site.domain}/admin`} target="_blank" rel="noopener" style={{ color: '#2563eb' }}>
                https://{launched.site.domain}/admin
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/admin/collections/sites" style={{ padding: '10px 24px', background: '#374151', color: 'white', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
              View All Sites
            </a>
            <button
              onClick={() => { setStep('template'); setLaunched(null); setData(BLANK) }}
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

      {/* ── STEP 1: TEMPLATE ── */}
      {step === 'template' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#111827' }}>Choose a Template</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>Templates define the homepage layout and section order.</p>

          <div
            onClick={() => selectTemplate(null)}
            style={{ border: `${data.templateId === null ? '2' : '1'}px solid ${data.templateId === null ? '#374151' : '#e5e7eb'}`, borderRadius: 10, padding: '14px 18px', marginBottom: 12, cursor: 'pointer', background: data.templateId === null ? '#f9fafb' : 'white', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 38, height: 38, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🗋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Blank (no template)</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>All default sections enabled</div>
            </div>
            {data.templateId === null && <span style={{ color: '#374151', fontWeight: 800, fontSize: 16 }}>✓</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {templates.map(t => (
              <div
                key={t.id}
                onClick={() => selectTemplate(t)}
                style={{ border: `${data.templateId === t.id ? '2' : '1'}px solid ${data.templateId === t.id ? '#374151' : '#e5e7eb'}`, borderRadius: 10, padding: 14, cursor: 'pointer', background: data.templateId === t.id ? '#f9fafb' : 'white' }}
              >
                {t.thumbnail?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.thumbnail.url} alt={t.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />
                ) : (
                  <div style={{ width: '100%', height: 80, background: '#f3f4f6', borderRadius: 6, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏛️</div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>{t.name}</span>
                  {data.templateId === t.id && <span style={{ color: '#374151', fontWeight: 800 }}>✓</span>}
                </div>
                <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                  {CATEGORY_LABELS[t.category] ?? t.category}
                </span>
                {t.description && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8, lineHeight: 1.5 }}>{t.description}</p>}
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: 13, fontStyle: 'italic', marginTop: 8 }}>
              No templates yet. Create templates in the Templates collection, then they&apos;ll appear here.
            </p>
          )}
        </div>
      )}

      {/* ── STEP 2: SECTIONS ── */}
      {step === 'sections' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#111827' }}>Customise Sections</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>Drag rows to reorder. Toggle to enable or disable sections on the homepage.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.sections.map(s => s.type)} strategy={verticalListSortingStrategy}>
              {data.sections.map(section => (
                <SortableSectionRow key={section.type} section={section} onToggle={() => toggleSection(section.type)} />
              ))}
            </SortableContext>
          </DndContext>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>
            {data.sections.filter(s => s.enabled).length} of {data.sections.length} sections enabled
          </p>
        </div>
      )}

      {/* ── STEP 3: DETAILS ── */}
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
            <div>
              <label style={labelStyle}>Colour Theme</label>
              <select style={inputStyle} value={data.theme} onChange={e => set('theme', e.target.value)}>
                {THEMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: ADMIN ── */}
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
            <div>
              <label style={labelStyle}>Contact Email (public)</label>
              <input style={inputStyle} type="email" value={data.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="info@mof.gov.pg" />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input style={inputStyle} value={data.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+675 321 XXXX" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Postal Address</label>
              <textarea style={{ ...inputStyle, height: 72, resize: 'vertical' }} value={data.contactAddress} onChange={e => set('contactAddress', e.target.value)} placeholder="PO Box 710, Waigani, NCD" />
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: REVIEW ── */}
      {step === 'review' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Review &amp; Launch</h2>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            {([
              ['Template',      data.templateName || 'Blank (default sections)'],
              ['Site Name',     data.siteName],
              ['Domain',        data.domain],
              ['Agency Type',   AGENCY_TYPES.find(t => t.value === data.agencyType)?.label ?? data.agencyType],
              ['Theme',         THEMES.find(t => t.value === data.theme)?.label ?? data.theme],
              ['Admin Email',   data.adminEmail],
              ['Admin Name',    [data.adminFirstName, data.adminLastName].filter(Boolean).join(' ') || '—'],
              ['Sections',      `${data.sections.filter(s => s.enabled).length} enabled`],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', padding: '11px 18px', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ width: 150, fontWeight: 600, color: '#374151', flexShrink: 0 }}>{label}</span>
                <span style={{ color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '11px 16px', color: '#92400e', fontSize: 13 }}>
            ⚠️ This will create the site record, an editor user, seed default pages, and send a welcome email to <strong>{data.adminEmail}</strong>.
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
