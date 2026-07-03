'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import {
  LayoutDashboard, Users, Image, Globe, FileText, Newspaper,
  Building2, FolderOpen, MessageSquare, LayoutTemplate, Rocket,
  LogOut, Menu, ChevronRight,
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
              <Link href="/admin/site-builder" title="Launch New Site"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer', background: C.orange }}>
                <Rocket size={15} color="#000716" />
              </Link>
            )
            : (
              <Link href="/admin/site-builder"
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.orange}`, cursor: 'pointer', background: C.navyDark, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', flex: 1 }}>Launch New Site</span>
                  <ChevronRight size={13} color={C.orange} />
                </div>
                <span style={{ fontSize: 11, color: '#D5DBDB' }}>Deploy a gov website</span>
              </Link>
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
