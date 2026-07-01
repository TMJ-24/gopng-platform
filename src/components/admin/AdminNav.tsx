'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import {
  LayoutDashboard, Users, Image, Globe, FileText, Newspaper,
  Building2, FolderOpen, MessageSquare, LayoutTemplate, Rocket,
  LogOut, Menu, ChevronRight, Check, Loader2, ExternalLink, Layers,
} from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/* ── Colour tokens ─────────────────────────────────────────────────── */
const C = {
  navy:       '#232F3E',
  navyDark:   '#1A2536',
  blue:       '#0972D3',
  blueLight:  '#EBF5FB',
  bg:         '#FFFFFF',
  bgPage:     '#F4F6F8',
  border:     '#D5DBDB',
  text:       '#000716',
  textSub:    '#545B64',
  textMuted:  '#687078',
  orange:     '#FF9900',
  green:      '#1D8348',
  red:        '#D13212',
}

const SECTION_LABELS: Record<string, string> = {
  hero:      'Hero & Search',
  services:  'Citizen Services',
  stats:     'Statistics',
  news:      'News Feed',
  directory: 'Agency Directory',
  opendata:  'Open Data',
  about:     'About / Mandate',
  cta:       'Contact CTA',
}

/* ── Template definitions ───────────────────────────────────────────── */
const WIZARD_TEMPLATES = [
  {
    id: 'gov-portal',
    slug: 'gov-portal',
    name: 'Government Portal',
    category: 'portal',
    description: 'Full-featured national portal with search hero, services grid, live stats, news and agency directory.',
    theme: 'default',
    primary: '#232F3E',
    accent: '#FF9900',
    badge: 'Most Popular',
    sections: ['hero', 'services', 'stats', 'news', 'directory', 'cta'],
  },
  {
    id: 'ministry-site',
    slug: 'ministry-site',
    name: 'Ministry Website',
    category: 'ministry',
    description: 'Professional ministry site with mandate section, policy news, and contact call-to-action.',
    theme: 'blue',
    primary: '#0972D3',
    accent: '#FF9900',
    badge: null,
    sections: ['hero', 'about', 'services', 'news', 'cta'],
  },
  {
    id: 'department-site',
    slug: 'department-site',
    name: 'Department Website',
    category: 'department',
    description: 'Clean department site focused on citizen services, publications, and quick contact info.',
    theme: 'default',
    primary: '#232F3E',
    accent: '#FF9900',
    badge: null,
    sections: ['hero', 'services', 'news', 'cta'],
  },
  {
    id: 'provincial-gov',
    slug: 'provincial-gov',
    name: 'Provincial Government',
    category: 'provincial',
    description: 'Provincial portal showcasing local departments, community news, and regional services.',
    theme: 'green',
    primary: '#1D6B2B',
    accent: '#F2820A',
    badge: null,
    sections: ['hero', 'services', 'news', 'directory', 'cta'],
  },
]

/* ── Agency types ───────────────────────────────────────────────────── */
const AGENCY_TYPES = [
  { label: 'Ministry',             value: 'ministry' },
  { label: 'Department',           value: 'department' },
  { label: 'Authority',            value: 'authority' },
  { label: 'Commission',           value: 'commission' },
  { label: 'Statutory Body',       value: 'statutory-body' },
  { label: 'Provincial Government',value: 'provincial' },
  { label: 'State-Owned Enterprise',value: 'soe' },
]

const THEMES = [
  { value: 'default', label: 'GoPNG Navy',       primary: '#232F3E', accent: '#FF9900' },
  { value: 'blue',    label: 'Government Blue',   primary: '#0972D3', accent: '#FF9900' },
  { value: 'green',   label: 'Forest Green',      primary: '#1D6B2B', accent: '#F2820A' },
  { value: 'red',     label: 'PNG Red',            primary: '#CE1126', accent: '#000000' },
]

/* ── Nav structure ──────────────────────────────────────────────────── */
type NavItem = {
  label: string
  href: string
  slug: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
  iconBg: string
}
type NavGroup = { label: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content',
    items: [
      { label: 'Sites',     href: '/admin/collections/sites',    slug: 'sites',    Icon: Globe,          iconColor: '#0972D3', iconBg: '#EBF5FB' },
      { label: 'Pages',     href: '/admin/collections/pages',    slug: 'pages',    Icon: FileText,       iconColor: '#545B64', iconBg: '#F4F6F8' },
      { label: 'News',      href: '/admin/collections/news',     slug: 'news',     Icon: Newspaper,      iconColor: '#1D6B2B', iconBg: '#E9F7EE' },
      { label: 'Documents', href: '/admin/collections/documents', slug: 'documents', Icon: FolderOpen,   iconColor: '#7A5400', iconBg: '#FFF8EC' },
      { label: 'Media',     href: '/admin/collections/media',    slug: 'media',    Icon: Image,          iconColor: '#545B64', iconBg: '#F4F6F8' },
    ],
  },
  {
    label: 'Directory',
    items: [
      { label: 'Departments',         href: '/admin/collections/departments',          slug: 'departments',          Icon: Building2,     iconColor: '#0972D3', iconBg: '#EBF5FB' },
      { label: 'Contact Submissions', href: '/admin/collections/contact-submissions',  slug: 'contact-submissions',  Icon: MessageSquare, iconColor: '#6B21A8', iconBg: '#F5F0FF' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Templates', href: '/admin/collections/templates', slug: 'templates', Icon: LayoutTemplate, iconColor: '#0972D3', iconBg: '#EBF5FB' },
      { label: 'Users',     href: '/admin/collections/users',     slug: 'users',     Icon: Users,          iconColor: '#545B64', iconBg: '#F4F6F8' },
    ],
  },
]

/* ── DashboardLink ──────────────────────────────────────────────────── */
function DashboardLink({ active, collapsed }: { active: boolean; collapsed: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href="/admin"
      title={collapsed ? 'Dashboard' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        margin: '2px 8px', padding: collapsed ? '8px 0' : '8px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        textDecoration: 'none', borderRadius: 8,
        background: active ? C.blueLight : hovered ? '#F0F4F8' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? '#D6EAF8' : hovered ? '#E8F4FD' : '#F4F6F8',
        transition: 'background 0.15s',
      }}>
        <LayoutDashboard size={15} color={active ? C.blue : C.textSub} />
      </div>
      {!collapsed && (
        <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.blue : C.text }}>
          Dashboard
        </span>
      )}
    </Link>
  )
}

/* ── NavItemLink ────────────────────────────────────────────────────── */
function NavItemLink({
  item, active, collapsed, count,
}: { item: NavItem; active: boolean; collapsed: boolean; count?: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        margin: '1px 8px', padding: collapsed ? '7px 0' : '7px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        textDecoration: 'none', borderRadius: 8,
        background: active ? C.blueLight : hovered ? '#F0F4F8' : 'transparent',
        transition: 'background 0.15s',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? C.blueLight : hovered ? item.iconBg : item.iconBg,
        border: `1px solid ${active ? '#BDE0F8' : 'transparent'}`,
        transition: 'background 0.15s',
      }}>
        <item.Icon size={14} color={active ? C.blue : item.iconColor} />
      </div>

      {!collapsed && (
        <>
          <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.blue : C.text, flex: 1 }}>
            {item.label}
          </span>
          {count !== undefined && count > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9,
              background: active ? C.blue : '#E8ECF0',
              color: active ? '#FFFFFF' : C.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 5px', flexShrink: 0,
            }}>
              {count > 99 ? '99+' : count}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

/* ── Site Launch Wizard ─────────────────────────────────────────────── */
type WizardForm = {
  name: string; domain: string; agencyType: string
  theme: string; status: string; templateSlug: string
}

function SiteWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<WizardForm>({
    name: '', domain: '', agencyType: '', theme: 'default', status: 'draft', templateSlug: '',
  })
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<{ id: string | number; name: string } | null>(null)
  const [error, setError] = useState('')

  const update = (k: keyof WizardForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const canNext1 = form.name.trim() && form.agencyType
  const canNext2 = !!form.templateSlug
  const canNext3 = !!form.theme

  /* Auto-apply template theme when template is picked */
  const pickTemplate = (t: typeof WIZARD_TEMPLATES[0]) => {
    setForm(f => ({ ...f, templateSlug: t.slug, theme: t.theme }))
  }

  async function handleCreate() {
    setCreating(true)
    setError('')
    try {
      /* 1 — ensure template exists in DB */
      let templateId: string | number | undefined
      const tDef = WIZARD_TEMPLATES.find(t => t.slug === form.templateSlug)
      if (tDef) {
        const existing = await fetch(`/api/templates?where[slug][equals]=${tDef.slug}&limit=1`, { credentials: 'include' }).then(r => r.json())
        if (existing?.docs?.[0]?.id) {
          templateId = existing.docs[0].id
        } else {
          const created = await fetch('/api/templates', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: tDef.name, slug: tDef.slug, category: tDef.category,
              description: tDef.description, defaultTheme: tDef.theme, isActive: true,
              sections: tDef.sections.map(type => ({ type, enabled: true })),
            }),
          }).then(r => r.json())
          templateId = created?.doc?.id
        }
      }

      /* 2 — create site */
      const res = await fetch('/api/sites', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          domain: form.domain.trim() || undefined,
          agencyType: form.agencyType,
          theme: form.theme,
          status: form.status,
          ...(templateId ? { template: templateId } : {}),
        }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.message ?? `Error ${res.status}`) }
      const data = await res.json()
      setCreated({ id: data.doc?.id, name: data.doc?.name ?? form.name })
      setStep(5)
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  const selectedTheme   = THEMES.find(t => t.value === form.theme) ?? THEMES[0]!
  const selectedType    = AGENCY_TYPES.find(t => t.value === form.agencyType)
  const selectedTpl     = WIZARD_TEMPLATES.find(t => t.slug === form.templateSlug)

  const STEPS = ['Basic Info', 'Template', 'Theme', 'Review']

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,7,22,0.60)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div style={{
        width: '100%', maxWidth: step === 2 ? 680 : 540,
        background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 64px rgba(0,7,22,0.28)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92vh', overflow: 'hidden',
        fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif',
        transition: 'max-width 0.25s ease',
      }}>

        {/* ── Wizard header ── */}
        <div style={{ background: C.navy, padding: '20px 24px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <Rocket size={15} color={C.orange} />
                <span style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>Launch New Site</span>
              </div>
              <p style={{ fontSize: 12, color: '#B0BAC4', margin: 0 }}>Deploy a government website in minutes</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0BAC4', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          {step < 5 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STEPS.map((label, i) => {
                const num = i + 1
                const done = step > num
                const active = step === num
                return (
                  <React.Fragment key={label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                        background: done ? C.green : active ? C.orange : 'rgba(255,255,255,0.12)',
                        border: `2px solid ${done ? C.green : active ? C.orange : 'rgba(255,255,255,0.25)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {done
                          ? <Check size={11} color="#fff" />
                          : <span style={{ fontSize: 10, fontWeight: 700, color: active ? '#000716' : 'rgba(255,255,255,0.4)' }}>{num}</span>
                        }
                      </div>
                      <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? '#FFFFFF' : done ? '#B0BAC4' : 'rgba(255,255,255,0.35)' }}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 8px' }} />}
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Agency / Site Name <span style={{ color: C.red }}>*</span>
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. Department of Health"
                  style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, color: C.text, boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Domain</label>
                <input
                  value={form.domain}
                  onChange={e => update('domain', e.target.value)}
                  placeholder="e.g. health.gov.pg"
                  style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, color: C.text, boxSizing: 'border-box', outline: 'none' }}
                />
                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Leave blank to configure later</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Agency Type <span style={{ color: C.red }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {AGENCY_TYPES.map(t => (
                    <button key={t.value} onClick={() => update('agencyType', t.value)}
                      style={{
                        padding: '10px 12px', border: `2px solid ${form.agencyType === t.value ? C.blue : C.border}`,
                        borderRadius: 8, background: form.agencyType === t.value ? C.blueLight : '#FFFFFF',
                        cursor: 'pointer', fontSize: 13, fontWeight: form.agencyType === t.value ? 700 : 400,
                        color: form.agencyType === t.value ? C.blue : C.text, textAlign: 'left', transition: 'all 0.1s',
                      }}
                    >{t.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Template Selection */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 4px' }}>
                Choose a professionally designed template to start from. You can customise every section later.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {WIZARD_TEMPLATES.map(t => {
                  const selected = form.templateSlug === t.slug
                  return (
                    <button
                      key={t.slug}
                      onClick={() => pickTemplate(t)}
                      style={{
                        padding: 0, border: `2px solid ${selected ? C.blue : C.border}`,
                        borderRadius: 12, background: '#FFFFFF', cursor: 'pointer', textAlign: 'left',
                        boxShadow: selected ? '0 0 0 3px rgba(9,114,211,0.12)' : 'none',
                        transition: 'all 0.15s', overflow: 'hidden', position: 'relative',
                      }}
                    >
                      {/* Colour bar preview */}
                      <div style={{ height: 6, background: t.primary }} />
                      <div style={{ height: 4, background: t.accent }} />

                      <div style={{ padding: '14px 14px 12px' }}>
                        {/* Badge */}
                        {t.badge && (
                          <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, background: C.orange, color: '#000716', padding: '2px 7px', borderRadius: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t.badge}
                          </span>
                        )}

                        <div style={{ fontSize: 14, fontWeight: 700, color: selected ? C.blue : C.text, marginBottom: 4 }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, marginBottom: 10 }}>
                          {t.description}
                        </div>

                        {/* Sections list */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {t.sections.map(s => (
                            <span key={s} style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 10,
                              background: selected ? '#EBF5FB' : '#F4F6F8',
                              color: selected ? C.blue : C.textSub, fontWeight: 500,
                            }}>
                              {SECTION_LABELS[s] ?? s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selected checkmark */}
                      {selected && (
                        <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: '#F4F6F8', border: `1px solid ${C.border}` }}>
                <Layers size={14} color={C.textMuted} />
                <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
                  All templates include the same collections (News, Pages, Media, etc.). Only the homepage layout differs.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Theme */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Colour Theme
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {THEMES.map(t => (
                    <button key={t.value} onClick={() => update('theme', t.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        border: `2px solid ${form.theme === t.value ? C.blue : C.border}`,
                        borderRadius: 10, background: form.theme === t.value ? C.blueLight : '#FFFFFF',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 5, background: t.primary }} />
                        <div style={{ width: 22, height: 22, borderRadius: 5, background: t.accent }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: form.theme === t.value ? C.blue : C.text }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{t.primary} · {t.accent}</div>
                      </div>
                      {form.theme === t.value && (
                        <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: 9, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Initial Status</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ v: 'draft', l: 'Draft', d: 'Not publicly visible' }, { v: 'active', l: 'Active', d: 'Publicly accessible' }].map(s => (
                    <button key={s.v} onClick={() => update('status', s.v)}
                      style={{
                        flex: 1, padding: '10px 12px',
                        border: `2px solid ${form.status === s.v ? C.blue : C.border}`,
                        borderRadius: 8, background: form.status === s.v ? C.blueLight : '#FFFFFF',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.status === s.v ? C.blue : C.text }}>{s.l}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{s.d}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>Review your site configuration before launching.</p>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {[
                  { label: 'Site Name',    value: form.name },
                  { label: 'Domain',       value: form.domain || '— configure later' },
                  { label: 'Agency Type',  value: selectedType?.label ?? '—' },
                  { label: 'Template',     value: selectedTpl?.name ?? '— None' },
                  { label: 'Theme',        value: selectedTheme.label },
                  { label: 'Status',       value: form.status === 'active' ? 'Active' : 'Draft' },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: 'flex', gap: 12, padding: '11px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? '#FFFFFF' : '#FAFBFC' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, minWidth: 110 }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{row.value}</span>
                  </div>
                ))}
              </div>
              {selectedTpl && (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  <div style={{ height: 8, background: selectedTheme.primary }} />
                  <div style={{ height: 4, background: selectedTheme.accent }} />
                  <div style={{ padding: '10px 14px', background: '#FAFBFC' }}>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: '0 0 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Homepage Sections</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedTpl.sections.map(s => (
                        <span key={s} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 10, background: '#E9F1FB', color: C.blue, fontWeight: 500 }}>
                          {SECTION_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FFF5F4', border: `1px solid #FFB3AA`, fontSize: 13, color: C.red }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — Success */}
          {step === 5 && created && (
            <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: '#E9F7EF', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={24} color={C.green} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Site Created!</h3>
              <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 24px' }}>
                <strong>{created.name}</strong> has been added to the platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href={`/admin/collections/sites/${created.id}`} onClick={onClose}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 16px', borderRadius: 4, textDecoration: 'none', background: C.blue, color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>
                  Open Site Settings <ChevronRight size={14} />
                </Link>
                <Link href="/admin/collections/sites" onClick={onClose}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 16px', borderRadius: 4, textDecoration: 'none', background: C.bgPage, border: `1px solid ${C.border}`, color: C.text, fontSize: 13 }}>
                  View All Sites <ExternalLink size={13} />
                </Link>
                <button onClick={() => { setStep(1); setForm({ name: '', domain: '', agencyType: '', theme: 'default', status: 'draft', templateSlug: '' }); setCreated(null) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 16px', borderRadius: 4, background: 'none', border: 'none', color: C.blue, fontSize: 13, cursor: 'pointer' }}>
                  <Rocket size={13} /> Launch Another Site
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {step < 5 && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 4, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: C.text }}>Back</button>
              : <button onClick={onClose} style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', fontSize: 13, color: C.textMuted }}>Cancel</button>
            }

            {step < 4 && (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canNext1 : step === 2 ? !canNext2 : !canNext3}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: (step === 1 ? canNext1 : step === 2 ? canNext2 : canNext3) ? C.blue : C.border,
                  color: (step === 1 ? canNext1 : step === 2 ? canNext2 : canNext3) ? '#FFFFFF' : C.textMuted,
                  fontSize: 13, fontWeight: 700,
                }}
              >
                Continue <ChevronRight size={14} />
              </button>
            )}
            {step === 4 && (
              <button onClick={handleCreate} disabled={creating}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 4, border: 'none', cursor: creating ? 'not-allowed' : 'pointer',
                  background: creating ? C.border : C.orange, color: creating ? C.textMuted : '#000716', fontSize: 13, fontWeight: 700,
                }}
              >
                {creating ? <><Loader2 size={13} /> Creating…</> : <><Rocket size={13} /> Create Site</>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Nav drag handle ────────────────────────────────────────────────── */
function NavDragHandle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      {...props}
      style={{
        background: 'none', border: 'none', cursor: 'grab',
        padding: '0 4px', lineHeight: 0, touchAction: 'none', flexShrink: 0,
        color: 'inherit',
        ...props.style,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <rect x="2" y="2" width="2" height="2" rx="0.5" />
        <rect x="8" y="2" width="2" height="2" rx="0.5" />
        <rect x="2" y="5" width="2" height="2" rx="0.5" />
        <rect x="8" y="5" width="2" height="2" rx="0.5" />
        <rect x="2" y="8" width="2" height="2" rx="0.5" />
        <rect x="8" y="8" width="2" height="2" rx="0.5" />
      </svg>
    </button>
  )
}

/* ── Sortable nav item ───────────────────────────────────────────────── */
function SortableNavItem({
  item, active, collapsed, count,
}: { item: NavItem; active: boolean; collapsed: boolean; count?: number }) {
  const [hovered, setHovered] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.slug })

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <NavItemLink item={item} active={active} collapsed={collapsed} count={count} />

      {/* Drag handle — right edge, revealed on hover, hidden when collapsed */}
      {!collapsed && (
        <NavDragHandle
          {...attributes}
          {...listeners}
          style={{
            position: 'absolute', right: 10,
            color: hovered && !isDragging ? C.textMuted : 'transparent',
            transition: 'color 0.15s',
          }}
        />
      )}
    </div>
  )
}

/* ── localStorage helpers for nav order ─────────────────────────────── */
function loadNavGroup(group: NavGroup): NavGroup {
  if (typeof window === 'undefined') return group
  try {
    const saved: string[] = JSON.parse(localStorage.getItem(`nav-group-${group.label}`) ?? 'null')
    if (!Array.isArray(saved)) return group
    const ordered = saved.map(slug => group.items.find(i => i.slug === slug)).filter(Boolean) as NavItem[]
    const extras  = group.items.filter(i => !saved.includes(i.slug))
    return { ...group, items: [...ordered, ...extras] }
  } catch { return group }
}

function saveNavGroup(label: string, items: NavItem[]) {
  try { localStorage.setItem(`nav-group-${label}`, JSON.stringify(items.map(i => i.slug))) } catch { /* ignore */ }
}

/* ── Main AdminNav ──────────────────────────────────────────────────── */
export function AdminNav() {
  const { user, logOut } = useAuth()
  const pathname = usePathname() ?? ''
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  const [collapsed, setCollapsed] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [navGroups, setNavGroups] = useState<NavGroup[]>(() => NAV_GROUPS.map(loadNavGroup))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleNavDragEnd = (groupIndex: number) => ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const group = navGroups[groupIndex]!
    const from = group.items.findIndex(i => i.slug === active.id)
    const to   = group.items.findIndex(i => i.slug === over.id)
    if (from === -1 || to === -1) return
    const newItems  = arrayMove(group.items, from, to)
    const newGroups = navGroups.map((g, i) => i === groupIndex ? { ...g, items: newItems } : g)
    setNavGroups(newGroups)
    saveNavGroup(group.label, newItems)
  }

  const initials = user
    ? ((user as any).firstName?.[0] ?? (user as any).email?.[0] ?? '?').toUpperCase()
    : '?'

  /* Fetch logo + record counts on mount */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'

    fetch('/api/sites?limit=1&depth=1&sort=-createdAt').then(r => r.json()).then(data => {
      const site = data?.docs?.[0]
      if (site?.logo?.url) {
        const url = site.logo.url.startsWith(base) ? site.logo.url.slice(base.length) : site.logo.url
        setLogoUrl(url)
      }
    }).catch(() => {})

    const slugs = ['sites', 'pages', 'news', 'documents', 'media', 'departments', 'contact-submissions', 'templates', 'users']
    slugs.forEach(slug => {
      fetch(`/api/${slug}?limit=0`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => { if (data?.totalDocs !== undefined) setCounts(c => ({ ...c, [slug]: data.totalDocs })) })
        .catch(() => {})
    })
  }, [])

  /* Sync sidebar width — CSS transition handles the animation */
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.template-default__nav')
    if (!nav) return
    nav.style.width = collapsed ? '52px' : '280px'
    nav.style.minWidth = collapsed ? '52px' : '280px'
  }, [collapsed])

  /* Hide any element Payload renders directly inside the nav that isn't our wrapper */
  useEffect(() => {
    const navEl = document.querySelector<HTMLElement>('.template-default__nav')
    if (!navEl) return

    const remove = () => {
      Array.from(navEl.children).forEach(child => {
        if (!(child as HTMLElement).dataset.customNav) {
          (child as HTMLElement).style.display = 'none'
        }
      })
    }
    remove()
    const observer = new MutationObserver(remove)
    observer.observe(navEl, { childList: true })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {showWizard && <SiteWizard onClose={() => setShowWizard(false)} />}

      <div data-custom-nav style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, overflow: 'hidden', fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif' }}>

        {/* Header */}
        <div style={{ background: C.navy, height: 60, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '0' : '0 12px', gap: 8, flexShrink: 0, borderBottom: `2px solid ${C.orange}` }}>
          <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', display: 'flex', padding: 4, flexShrink: 0, borderRadius: 4 }}>
            <Menu size={18} />
          </button>
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              {logoUrl
                ? <img src={logoUrl} alt="GoPNG" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4, flexShrink: 0 }} />
                : (
                  <div style={{ width: 32, height: 32, borderRadius: 4, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#000', clipPath: 'polygon(0 0,100% 0,0 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: '#CE1126', clipPath: 'polygon(100% 0,100% 100%,0 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⭐</div>
                  </div>
                )
              }
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', whiteSpace: 'nowrap' }}>GoPNG Platform</div>
                <div style={{ fontSize: 11, color: '#FFFFFF', opacity: 0.7, marginTop: 1, whiteSpace: 'nowrap' }}>Admin Console</div>
              </div>
            </Link>
          )}
        </div>

        {/* Dashboard */}
        <div style={{ padding: '10px 0 4px' }}>
          <DashboardLink active={isDashboard} collapsed={collapsed} />
        </div>

        {/* Nav groups — sortable within each group */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 4 }}>
          {navGroups.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              {gi > 0 && <div style={{ height: 1, background: '#EEF0F3', margin: '8px 16px' }} />}
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 4px' }}>
                  <div style={{ width: 3, height: 12, borderRadius: 2, background: C.blue, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {group.label}
                  </span>
                </div>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleNavDragEnd(gi)}
              >
                <SortableContext items={group.items.map(i => i.slug)} strategy={verticalListSortingStrategy}>
                  {group.items.map(item => (
                    <SortableNavItem
                      key={item.slug}
                      item={item}
                      active={isActive(item.href)}
                      collapsed={collapsed}
                      count={counts[item.slug]}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ))}
        </div>

        {/* Launch CTA */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? '10px 6px 8px' : '10px 12px 8px' }}>
          {collapsed
            ? (
              <button onClick={() => setShowWizard(true)} title="Launch New Site"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer', background: C.orange }}>
                <Rocket size={15} color="#000716" />
              </button>
            )
            : (
              <button onClick={() => setShowWizard(true)}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.orange}`, cursor: 'pointer', background: C.navyDark, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', flex: 1 }}>Launch New Site</span>
                  <ChevronRight size={13} color={C.orange} />
                </div>
                <span style={{ fontSize: 11, color: '#D5DBDB' }}>Deploy a gov website</span>
              </button>
            )
          }
        </div>

        {/* User */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? '10px 6px 12px' : '10px 12px 14px' }}>
          {collapsed
            ? (
              <div title={(user as any)?.email ?? 'User'} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>
                  {initials}
                </div>
              </div>
            )
            : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{(user as any)?.firstName || 'Admin'}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(user as any)?.email ?? ''}</div>
                </div>
                <button onClick={() => logOut()} title="Sign out"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.textSub, display: 'flex', flexShrink: 0 }}>
                  <LogOut size={14} />
                </button>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}
