'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Globe, FileText, Newspaper, Users, FolderOpen, Image as ImageIcon,
  Building2, MessageSquare, LayoutTemplate, Plus,
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
}

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
      { label: 'Sites',               slug: 'sites',               description: 'Manage government websites',   Icon: Globe,          iconColor: '#0972D3', iconBg: '#F2F8FD' },
      { label: 'Pages',               slug: 'pages',               description: 'Static & dynamic pages',       Icon: FileText,       iconColor: '#545B64', iconBg: '#F2F3F3' },
      { label: 'News',                slug: 'news',                description: 'News articles & announcements', Icon: Newspaper,     iconColor: '#1D6B2B', iconBg: '#EAF7EE' },
      { label: 'Documents',           slug: 'documents',           description: 'Files, policies & reports',    Icon: FolderOpen,     iconColor: '#7A5400', iconBg: '#FFF8EC' },
      { label: 'Media',               slug: 'media',               description: 'Images, logos & uploads',      Icon: ImageIcon,      iconColor: '#545B64', iconBg: '#F2F3F3' },
    ],
  },
  {
    label: 'Directory',
    items: [
      { label: 'Departments',         slug: 'departments',          description: 'Government departments',       Icon: Building2,      iconColor: '#0972D3', iconBg: '#F2F8FD' },
      { label: 'Contact Submissions', slug: 'contact-submissions', description: 'Enquiries from citizens',      Icon: MessageSquare,  iconColor: '#6B21A8', iconBg: '#F8F0FF' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Templates',           slug: 'templates',           description: 'Site layout templates',        Icon: LayoutTemplate, iconColor: '#0972D3', iconBg: '#F2F8FD' },
      { label: 'Users',               slug: 'users',               description: 'Admin & editor accounts',      Icon: Users,          iconColor: '#545B64', iconBg: '#F2F3F3' },
    ],
  },
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

export function DashboardCollectionCards() {
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
    return () => observer.disconnect()
  }, [])

  return (
    <div data-gopng="cards" style={{ fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif' }}>

      {/* ── Dashboard page header ── */}
      <div style={{ marginBottom: 0, paddingBottom: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Manage your government websites, content and platform settings.
        </p>
      </div>

      {/* ── Separator ── */}
      <div style={{ margin: '20px 0 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
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
    </div>
  )
}
