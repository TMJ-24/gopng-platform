'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'
import {
  Globe, FileText, Newspaper, Users, FolderOpen, Image as ImageIcon,
  Building2, LayoutTemplate, Rocket, Plus,
  ArrowRight, CheckCircle, ExternalLink,
} from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  DragOverlay, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  arrayMove, rectSortingStrategy, horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/* ── Cloudscape tokens ───────────────────────────────────────────────── */
const C = {
  navy:      '#232F3E',
  blue:      '#0972D3',
  blueHover: '#033160',
  blueLight: '#F2F8FD',
  bg:        '#FFFFFF',
  bgPage:    '#F2F3F3',
  border:    '#D5DBDB',
  text:      '#000716',
  textSub:   '#545B64',
  textMuted: '#687078',
  orange:    '#FF9900',
  success:   '#1D8348',
  successBg: '#F2FAF5',
}

type StatDef = {
  label: string
  slug: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  href: string
}

type ActionDef = {
  slug: string
  label: string
  href: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  primary: boolean
}

const STATS_DEFAULT: StatDef[] = [
  { label: 'Sites',       slug: 'sites',       Icon: Globe,          href: '/admin/collections/sites'       },
  { label: 'Pages',       slug: 'pages',       Icon: FileText,       href: '/admin/collections/pages'       },
  { label: 'News',        slug: 'news',        Icon: Newspaper,      href: '/admin/collections/news'        },
  { label: 'Users',       slug: 'users',       Icon: Users,          href: '/admin/collections/users'       },
  { label: 'Documents',   slug: 'documents',   Icon: FolderOpen,     href: '/admin/collections/documents'   },
  { label: 'Media',       slug: 'media',       Icon: ImageIcon,      href: '/admin/collections/media'       },
  { label: 'Departments', slug: 'departments', Icon: Building2,      href: '/admin/collections/departments' },
  { label: 'Templates',   slug: 'templates',   Icon: LayoutTemplate, href: '/admin/collections/templates'   },
]

const ACTIONS_DEFAULT: ActionDef[] = [
  { slug: 'launch-site',     label: 'Launch New Site',   href: '/admin/site-wizard',                    Icon: Rocket,       primary: true  },
  { slug: 'new-news',        label: 'New News Article',  href: '/admin/collections/news/create',        Icon: Plus,         primary: false },
  { slug: 'new-page',        label: 'New Page',          href: '/admin/collections/pages/create',       Icon: Plus,         primary: false },
  { slug: 'upload-media',    label: 'Upload Media',      href: '/admin/collections/media/create',       Icon: Plus,         primary: false },
  { slug: 'new-department',  label: 'New Department',    href: '/admin/collections/departments/create', Icon: Building2,    primary: false },
  { slug: 'view-sites',      label: 'View All Sites',    href: '/admin/collections/sites',              Icon: ExternalLink, primary: false },
]

/* ── Helpers ─────────────────────────────────────────────────────────── */
function loadOrder<T extends { slug: string }>(key: string, defaults: T[]): T[] {
  if (typeof window === 'undefined') return defaults
  try {
    const saved: string[] = JSON.parse(localStorage.getItem(key) ?? 'null')
    if (!Array.isArray(saved)) return defaults
    const ordered = saved.map(id => defaults.find(d => d.slug === id)).filter(Boolean) as T[]
    const extras  = defaults.filter(d => !saved.includes(d.slug))
    return [...ordered, ...extras]
  } catch { return defaults }
}

function saveOrder(key: string, ids: string[]) {
  try { localStorage.setItem(key, JSON.stringify(ids)) } catch { /* ignore */ }
}

function DragHandleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <rect x="2" y="2" width="2" height="2" rx="0.5" />
      <rect x="8" y="2" width="2" height="2" rx="0.5" />
      <rect x="2" y="5" width="2" height="2" rx="0.5" />
      <rect x="8" y="5" width="2" height="2" rx="0.5" />
      <rect x="2" y="8" width="2" height="2" rx="0.5" />
      <rect x="8" y="8" width="2" height="2" rx="0.5" />
    </svg>
  )
}

/* ── Stat card ───────────────────────────────────────────────────────── */
function StatCardBody({ def, count, loading, hovered }: { def: StatDef; count: number; loading: boolean; hovered: boolean }) {
  return (
    <div style={{
      background: C.bg,
      border: `1px solid ${hovered ? C.blue : C.border}`,
      borderTop: `3px solid ${hovered ? C.blue : '#8D99A8'}`,
      borderRadius: 4,
      padding: '16px 18px',
      boxShadow: hovered ? '0 2px 6px rgba(0,28,36,0.18)' : '0 1px 2px rgba(0,28,36,0.1)',
      transition: 'all 0.12s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <def.Icon size={16} color={hovered ? C.blue : C.textSub} />
        <ArrowRight size={13} color={hovered ? C.blue : C.border} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>
        {loading ? <div style={{ width: 36, height: 24, background: C.bgPage, borderRadius: 3 }} /> : count}
      </div>
      <div style={{ fontSize: 12, color: C.textSub, fontWeight: 400 }}>{def.label}</div>
    </div>
  )
}

function SortableStatCard({ def, count, loading }: { def: StatDef; count: number; loading: boolean }) {
  const [hovered, setHovered] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: def.slug })

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        position: 'relative',
      }}
    >
      {/* Drag handle — top-right, revealed on hover */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${def.label} card to reorder`}
        style={{
          position: 'absolute', top: 6, right: 6, zIndex: 10,
          background: 'none', border: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: 3, lineHeight: 0, touchAction: 'none',
          color: hovered ? C.textMuted : 'transparent',
          transition: 'color 0.15s',
        }}
      >
        <DragHandleIcon />
      </button>

      <Link href={def.href} style={{ textDecoration: 'none', display: 'block' }}>
        <StatCardBody def={def} count={count} loading={loading} hovered={hovered} />
      </Link>
    </div>
  )
}

/* ── Quick action button ─────────────────────────────────────────────── */
function ActionBtnBody({ action, hovered }: { action: ActionDef; hovered: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600,
      background: action.primary
        ? hovered ? C.blueHover : C.blue
        : hovered ? C.bgPage : C.bg,
      color: action.primary ? '#FFFFFF' : hovered ? C.blueHover : C.text,
      border: action.primary
        ? `1px solid ${hovered ? C.blueHover : C.blue}`
        : `1px solid ${hovered ? C.blue : C.border}`,
      transition: 'all 0.12s',
      cursor: 'pointer',
    }}>
      <action.Icon size={13} color={action.primary ? '#FFFFFF' : hovered ? C.blue : C.textSub} />
      {action.label}
    </div>
  )
}

function SortableActionBtn({ action }: { action: ActionDef }) {
  const [hovered, setHovered] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: action.slug })

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* Drag handle — left of button, revealed on hover */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${action.label} to reorder`}
        style={{
          background: 'none', border: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: '0 4px 0 0', lineHeight: 0, touchAction: 'none',
          color: hovered ? C.textMuted : 'transparent',
          transition: 'color 0.15s', flexShrink: 0,
        }}
      >
        <DragHandleIcon />
      </button>

      <Link href={action.href} style={{ textDecoration: 'none' }}>
        <ActionBtnBody action={action} hovered={hovered} />
      </Link>
    </div>
  )
}

/* ── Container ───────────────────────────────────────────────────────── */
function Container({ title, children, viewAllHref, viewAllLabel }: {
  title: string
  children: React.ReactNode
  viewAllHref?: string
  viewAllLabel?: string
}) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,28,36,0.1)' }}>
      <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bgPage }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</span>
        {viewAllHref && (
          <Link href={viewAllHref} style={{ fontSize: 12, color: C.blue, textDecoration: 'none', fontWeight: 600 }}>
            {viewAllLabel ?? 'View all'} →
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

/* ── Main dashboard ──────────────────────────────────────────────────── */
export function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState<StatDef[]>(() => loadOrder('dashboard-stats-order', STATS_DEFAULT))
  const [actions, setActions] = useState<ActionDef[]>(() => loadOrder('dashboard-actions-order', ACTIONS_DEFAULT))
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [recentSites, setRecentSites] = useState<any[]>([])
  const [recentNews, setRecentNews] = useState<any[]>([])

  const [activeStat, setActiveStat]     = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')

    Promise.all(
      STATS_DEFAULT.map(s =>
        fetch(`/api/${s.slug}?limit=0`)
          .then(r => r.json())
          .then(d => [s.slug, d.totalDocs ?? 0] as [string, number])
          .catch(() => [s.slug, 0] as [string, number])
      )
    ).then(entries => { setCounts(Object.fromEntries(entries)); setLoading(false) })

    fetch('/api/sites?limit=5&sort=-createdAt').then(r => r.json()).then(d => setRecentSites(d.docs ?? [])).catch(() => {})
    fetch('/api/news?limit=5&sort=-createdAt&where[status][equals]=published').then(r => r.json()).then(d => setRecentNews(d.docs ?? [])).catch(() => {})
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleStatDragStart = ({ active }: DragStartEvent) => setActiveStat(active.id as string)
  const handleStatDragEnd   = ({ active, over }: DragEndEvent) => {
    setActiveStat(null)
    if (!over || active.id === over.id) return
    const from = stats.findIndex(s => s.slug === active.id)
    const to   = stats.findIndex(s => s.slug === over.id)
    const next = arrayMove(stats, from, to)
    setStats(next)
    saveOrder('dashboard-stats-order', next.map(s => s.slug))
  }

  const handleActionDragStart = ({ active }: DragStartEvent) => setActiveAction(active.id as string)
  const handleActionDragEnd   = ({ active, over }: DragEndEvent) => {
    setActiveAction(null)
    if (!over || active.id === over.id) return
    const from = actions.findIndex(a => a.slug === active.id)
    const to   = actions.findIndex(a => a.slug === over.id)
    const next = arrayMove(actions, from, to)
    setActions(next)
    saveOrder('dashboard-actions-order', next.map(a => a.slug))
  }

  const activeStatDef    = activeStat   ? stats.find(s => s.slug === activeStat)      : null
  const activeActionDef  = activeAction ? actions.find(a => a.slug === activeAction)  : null

  const now       = new Date()
  const hour      = now.getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr   = now.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const firstName = (user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Admin'

  return (
    <div style={{ fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif', color: C.text }}>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>GoPNG Platform / Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 2px', letterSpacing: '-0.01em' }}>
              {greeting}, {firstName}
            </h1>
            <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>{dateStr}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.successBg, border: '1px solid #A8D5B5', borderRadius: 4, padding: '6px 12px', fontSize: 12, color: C.success, fontWeight: 600 }}>
            <CheckCircle size={13} color={C.success} />
            Platform operational
          </div>
        </div>
      </div>

      {/* ── Flash notice ─────────────────────────────────────────── */}
      <div style={{ background: C.blueLight, border: '1px solid #BDE0F8', borderLeft: `4px solid ${C.blue}`, borderRadius: 4, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.text }}>
        <Globe size={14} color={C.blue} />
        <span><strong>Government Website Platform</strong> — Manage all agency websites from this console. Launch new sites via the <Link href="/admin/site-wizard" style={{ color: C.blue, fontWeight: 600 }}>Site Wizard</Link>.</span>
      </div>

      {/* ── Stats grid (sortable) ─────────────────────────────────── */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform Overview</div>
          <span style={{ fontSize: 11, color: C.textMuted, opacity: 0.7 }}>· drag cards to reorder</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleStatDragStart}
          onDragEnd={handleStatDragEnd}
          onDragCancel={() => setActiveStat(null)}
        >
          <SortableContext items={stats.map(s => s.slug)} strategy={rectSortingStrategy}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
              {stats.map(s => (
                <SortableStatCard key={s.slug} def={s} count={counts[s.slug] ?? 0} loading={loading} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeStatDef && (
              <div style={{ boxShadow: '0 8px 24px rgba(0,28,36,0.22)', borderRadius: 4, cursor: 'grabbing', opacity: 0.95 }}>
                <StatCardBody def={activeStatDef} count={counts[activeStatDef.slug] ?? 0} loading={loading} hovered />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ── Quick actions (sortable) ──────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Actions</div>
          <span style={{ fontSize: 11, color: C.textMuted, opacity: 0.7 }}>· drag to reorder</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleActionDragStart}
          onDragEnd={handleActionDragEnd}
          onDragCancel={() => setActiveAction(null)}
        >
          <SortableContext items={actions.map(a => a.slug)} strategy={horizontalListSortingStrategy}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {actions.map(a => <SortableActionBtn key={a.slug} action={a} />)}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeActionDef && (
              <div style={{ boxShadow: '0 4px 16px rgba(0,28,36,0.18)', borderRadius: 4, cursor: 'grabbing', opacity: 0.95 }}>
                <ActionBtnBody action={activeActionDef} hovered />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ── Recent content ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <Container title="Recent Sites" viewAllHref="/admin/collections/sites" viewAllLabel="View all sites">
          {recentSites.length === 0 ? (
            <div style={{ padding: '20px 18px', fontSize: 13, color: C.textMuted, textAlign: 'center' }}>No sites yet</div>
          ) : recentSites.map((site: any) => (
            <Link key={site.id} href={`/admin/collections/sites/${site.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Globe size={14} color={C.blue} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof site.name === 'object' ? site.name?.en : site.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{site.domain}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: site.status === 'active' ? '#F2FAF5' : C.bgPage, color: site.status === 'active' ? C.success : C.textMuted, border: `1px solid ${site.status === 'active' ? '#A8D5B5' : C.border}`, fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}>
                  {site.status ?? 'draft'}
                </span>
              </div>
            </Link>
          ))}
        </Container>

        <Container title="Latest News" viewAllHref="/admin/collections/news" viewAllLabel="View all articles">
          {recentNews.length === 0 ? (
            <div style={{ padding: '20px 18px', fontSize: 13, color: C.textMuted, textAlign: 'center' }}>No published news yet</div>
          ) : recentNews.map((item: any) => (
            <Link key={item.id} href={`/admin/collections/news/${item.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Newspaper size={14} color={C.textSub} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof item.title === 'object' ? item.title?.en : item.title}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : 'Draft'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Container>
      </div>
    </div>
  )
}
