'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'
import {
  Globe, Users, MessageSquare, Plus, Rocket, ExternalLink,
  LogIn, PenLine, Server, Database, GitBranch, CheckCircle2,
} from 'lucide-react'

const C = {
  blue:      '#0972D3',
  blueLight: '#F2F8FD',
  bg:        '#FFFFFF',
  bgPage:    '#F2F3F3',
  border:    '#D5DBDB',
  text:      '#000716',
  textSub:   '#545B64',
  textMuted: '#687078',
  orange:    '#FF9900',
  navy:      '#232F3E',
  success:   '#1D8348',
  successBg: '#F2FAF5',
}

const FONT = '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif'

type Collection = {
  label: string
  slug: string
  description: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
  iconBg: string
}

const GROUPS: { label: string; items: Collection[] }[] = [
  {
    label: 'Content',
    items: [
      { label: 'Sites', slug: 'sites', description: 'Manage government websites', Icon: Globe, iconColor: '#0972D3', iconBg: '#F2F8FD' },
    ],
  },
  {
    label: 'Directory',
    items: [
      { label: 'Contact Submissions', slug: 'contact-submissions', description: 'Enquiries from citizens', Icon: MessageSquare, iconColor: '#6B21A8', iconBg: '#F8F0FF' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Users', slug: 'users', description: 'Admin & editor accounts', Icon: Users, iconColor: '#545B64', iconBg: '#F2F3F3' },
    ],
  },
]

const WORKFLOW_STEPS: { Icon: React.ComponentType<{ size?: number; color?: string }>; title: string; body: string }[] = [
  { Icon: LogIn,    title: '1. Log in',        body: 'Sign in with the DTO account issued to you or your agency. Admins can create new accounts under Users.' },
  { Icon: Rocket,   title: '2. Launch a site', body: 'Use Site Builder to provision a new GitHub repo for your agency and get invited as a collaborator in minutes.' },
  { Icon: PenLine,  title: '3. Customise',     body: 'Edit your site’s pages, news and documents through its own visual editor — changes commit straight to your site’s Git repo.' },
  { Icon: CheckCircle2, title: '4. Publish',   body: 'Every commit rebuilds your static site automatically and goes live on its assigned .gov.pg domain.' },
]

function CollectionCard({ item }: { item: Collection }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bg,
        border: `1px solid ${hovered ? C.blue : C.border}`,
        borderRadius: 16,
        padding: '20px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: hovered
          ? '0 4px 16px rgba(9,114,211,0.12), 0 0 0 1px #0972D3'
          : '0 1px 4px rgba(0,7,22,0.06)',
        transition: 'border-color 0.12s, box-shadow 0.12s',
        position: 'relative',
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: hovered ? C.blueLight : item.iconBg,
        border: `1px solid ${hovered ? '#BDE0F8' : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s',
      }}>
        <item.Icon size={18} color={hovered ? C.blue : item.iconColor} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <Link
          href={`/admin/collections/${item.slug}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: hovered ? C.blue : C.text, marginBottom: 4, transition: 'color 0.12s' }}>
            {item.label}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
            {item.description}
          </div>
        </Link>
      </div>

      {/* Create button — top right */}
      <Link
        href={`/admin/collections/${item.slug}/create`}
        title={`Create ${item.label}`}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: 13, textDecoration: 'none',
          background: hovered ? C.blue : 'transparent',
          border: `1px solid ${hovered ? C.blue : C.border}`,
          transition: 'all 0.12s',
        }}
      >
        <Plus size={13} color={hovered ? '#FFFFFF' : C.textSub} />
      </Link>
    </div>
  )
}

/* ── Compact stat pill ───────────────────────────────────────────────── */
function StatPill({ label, value, loading, href }: { label: string; value: number; loading: boolean; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', flex: '1 1 140px' }}>
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
        padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>
          {loading ? '—' : value}
        </span>
        <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
    </Link>
  )
}

/* ── Recent activity list ────────────────────────────────────────────── */
function ActivityList({ title, items, viewAllHref, renderItem }: {
  title: string
  items: any[]
  viewAllHref: string
  renderItem: (item: any) => React.ReactNode
}) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bgPage }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</span>
        <Link href={viewAllHref} style={{ fontSize: 12, color: C.blue, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '20px 18px', fontSize: 13, color: C.textMuted, textAlign: 'center' }}>Nothing yet</div>
      ) : items.map(renderItem)}
    </div>
  )
}

export function DashboardCollectionCards() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [recentSites, setRecentSites] = useState<any[]>([])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')

    /* Hide Payload's native dashboard sections — they use hashed class names
       so we target by structure: any sibling section rendered after our card block */
    const hide = () => {
      const ourBlock = document.querySelector('[data-gopng="cards"]')
      if (!ourBlock) return

      /* Walk all siblings AFTER our block inside the dashboard wrap */
      let el = ourBlock.nextElementSibling as HTMLElement | null
      while (el) {
        el.style.display = 'none'
        el = el.nextElementSibling as HTMLElement | null
      }

      /* Also catch by known class fragments */
      document.querySelectorAll<HTMLElement>(
        '.dashboard__group, .dashboard__card-list, .collection-card, [class*="cardList"], [class*="card-list"]'
      ).forEach(e => { e.style.display = 'none' })
    }
    hide()
    const observer = new MutationObserver(hide)
    observer.observe(document.body, { childList: true, subtree: true })

    const slugs = ['sites', 'contact-submissions', 'users']
    Promise.all(
      slugs.map(slug =>
        fetch(`/api/${slug}?limit=0`).then(r => r.json()).then(d => [slug, d.totalDocs ?? 0] as [string, number]).catch(() => [slug, 0] as [string, number])
      )
    ).then(entries => { setCounts(Object.fromEntries(entries)); setLoading(false) })

    fetch('/api/sites?limit=1&where[status][equals]=active&limit=0').then(r => r.json()).then(d => setCounts(c => ({ ...c, 'sites-active': d.totalDocs ?? 0 }))).catch(() => {})
    fetch('/api/contact-submissions?limit=0&where[status][equals]=new').then(r => r.json()).then(d => setCounts(c => ({ ...c, 'contact-new': d.totalDocs ?? 0 }))).catch(() => {})
    fetch('/api/sites?limit=5&sort=-createdAt').then(r => r.json()).then(d => setRecentSites(d.docs ?? [])).catch(() => {})

    return () => observer.disconnect()
  }, [])

  const now       = new Date()
  const hour      = now.getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'there'

  return (
    <div data-gopng="cards" style={{ fontFamily: FONT }}>

      {/* ── Dashboard page header ── */}
      <div style={{ marginBottom: 0, paddingBottom: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
          {greeting}, {firstName}
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Manage your government website, content and platform settings.
        </p>
      </div>

      {/* ── About this platform ─────────────────────────────────────── */}
      <div style={{
        marginTop: 20, background: C.navy, borderRadius: 16, padding: '24px 28px',
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Server size={16} color={C.orange} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              GoPNG Platform
            </span>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            One centralised CMS for every PNG government website
          </h2>
          <p style={{ fontSize: 13, color: '#B0BAC4', lineHeight: 1.6, margin: 0 }}>
            Instead of every ministry, department and provincial government running its own separate website
            infrastructure, GoPNG Platform gives Digital Transformation Officers (DTOs) one shared launch point.
            This console manages the roster of agency sites, DTO accounts and citizen enquiries — each agency's
            actual content lives as static pages in its own Git repository, edited through its own visual editor.
          </p>
        </div>

        {/* Storage / architecture mini-facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Database size={15} color={C.orange} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#D5DBDB', lineHeight: 1.5 }}>
              <strong style={{ color: '#FFFFFF' }}>Platform registry</strong> — the site roster, DTO accounts and
              contact-form enquiries are stored in a shared Postgres database here, so every agency uses the same
              reliable, backed-up control plane.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <GitBranch size={15} color={C.orange} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#D5DBDB', lineHeight: 1.5 }}>
              <strong style={{ color: '#FFFFFF' }}>Independent deploys</strong> — each launched site gets its own
              repository and deployment, so one agency's traffic or changes never affect another's site.
            </span>
          </div>
        </div>
      </div>

      {/* ── Getting started for DTOs ────────────────────────────────── */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: C.blue, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Getting started as a Digital Transformation Officer
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {WORKFLOW_STEPS.map(step => (
            <div key={step.title} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <step.Icon size={18} color={C.blue} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '10px 0 4px' }}>{step.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>{step.body}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/admin/site-builder" style={{ textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 4, fontSize: 13, fontWeight: 700, background: C.blue, color: '#FFFFFF' }}>
              <Rocket size={13} /> Launch a new site
            </span>
          </Link>
          <Link href="/admin/collections/sites" style={{ textDecoration: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, background: C.bg, color: C.text, border: `1px solid ${C.border}` }}>
              <ExternalLink size={13} /> View all sites
            </span>
          </Link>
        </div>
      </div>

      {/* ── Key stats ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <StatPill label="Sites"              value={counts['sites'] ?? 0}         loading={loading} href="/admin/collections/sites" />
        <StatPill label="Active Sites"        value={counts['sites-active'] ?? 0}  loading={loading} href="/admin/collections/sites?where[status][equals]=active" />
        <StatPill label="New Enquiries"       value={counts['contact-new'] ?? 0}   loading={loading} href="/admin/collections/contact-submissions" />
      </div>

      {/* ── Separator ── */}
      <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ height: 2, flex: 1, background: `linear-gradient(to right, ${C.blue}, ${C.border} 70%, transparent)`, borderRadius: 1 }} />
      </div>

      {/* ── Collection groups ── */}
      {GROUPS.map((group, gi) => (
        <div key={group.label} style={{ marginBottom: gi < GROUPS.length - 1 ? 32 : 24 }}>

          {/* Section label with left accent bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: C.blue, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {group.label}
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {group.items.map(item => (
              <CollectionCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* ── Recent activity ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 8 }}>
        <ActivityList
          title="Recent Sites"
          items={recentSites}
          viewAllHref="/admin/collections/sites"
          renderItem={(site: any) => (
            <Link key={site.id} href={`/admin/collections/sites/${site.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Globe size={14} color={C.blue} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof site.name === 'object' ? site.name?.en : site.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{site.domain || 'No domain set'}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: site.status === 'active' ? C.successBg : C.bgPage, color: site.status === 'active' ? C.success : C.textMuted, border: `1px solid ${site.status === 'active' ? '#A8D5B5' : C.border}`, fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}>
                  {site.status ?? 'draft'}
                </span>
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  )
}
