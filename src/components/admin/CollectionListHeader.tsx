'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Globe, FileText, Newspaper, Users, FolderOpen,
  Image as ImageIcon, Building2, MessageSquare,
  LayoutTemplate, Rocket,
} from 'lucide-react'

const C = {
  navy:      '#232F3E',
  blue:      '#0972D3',
  blueLight: '#EBF5FB',
  blueBorder:'#BDE0F8',
  bg:        '#FFFFFF',
  bgPage:    '#F2F3F3',
  border:    '#D5DBDB',
  text:      '#000716',
  textSub:   '#545B64',
  textMuted: '#687078',
  orange:    '#FF9900',
  green:     '#1D8348',
  greenBg:   '#F2FAF5',
  greenBdr:  '#A8D5B5',
}

type CollectionMeta = {
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
  iconBg: string
  title: string
  description: string
  cta?: { label: string; href: string; primary?: boolean }
  automatedBadge?: string
}

const META: Record<string, CollectionMeta> = {
  sites: {
    Icon: Globe,
    iconColor: C.blue, iconBg: C.blueLight,
    title: 'Government Sites',
    description: 'Each site represents one agency website on the GoPNG platform. Use the Site Builder for automated provisioning.',
    cta: { label: 'Launch Site Builder', href: '/admin/site-builder', primary: true },
    automatedBadge: 'Automated provisioning available',
  },
  pages: {
    Icon: FileText,
    iconColor: '#545B64', iconBg: '#F4F6F8',
    title: 'Pages',
    description: 'Web pages for government sites. Each page belongs to a site and supports rich content in English and Tok Pisin.',
    cta: { label: 'New Page', href: '/admin/collections/pages/create' },
  },
  news: {
    Icon: Newspaper,
    iconColor: C.green, iconBg: C.greenBg,
    title: 'News & Announcements',
    description: 'Government news articles and press releases. Published articles appear on the site\'s news feed.',
    cta: { label: 'New Article', href: '/admin/collections/news/create' },
  },
  documents: {
    Icon: FolderOpen,
    iconColor: '#7A5400', iconBg: '#FFF8EC',
    title: 'Documents',
    description: 'Policy documents, reports, forms, and publications. Uploaded files are linked to a specific site.',
    cta: { label: 'Upload Document', href: '/admin/collections/documents/create' },
  },
  media: {
    Icon: ImageIcon,
    iconColor: '#545B64', iconBg: '#F4F6F8',
    title: 'Media Library',
    description: 'Images and files used across all sites. Supported formats: JPEG, PNG, WebP, PDF, SVG.',
    cta: { label: 'Upload Media', href: '/admin/collections/media/create' },
  },
  departments: {
    Icon: Building2,
    iconColor: C.blue, iconBg: C.blueLight,
    title: 'Departments',
    description: 'Government departments and agencies listed in the site directory. Each entry links to a site.',
    cta: { label: 'New Department', href: '/admin/collections/departments/create' },
  },
  'contact-submissions': {
    Icon: MessageSquare,
    iconColor: '#6B21A8', iconBg: '#F5F0FF',
    title: 'Contact Submissions',
    description: 'Messages submitted through site contact forms. Review and respond to citizen enquiries here.',
  },
  templates: {
    Icon: LayoutTemplate,
    iconColor: C.blue, iconBg: C.blueLight,
    title: 'Page Templates',
    description: 'Templates control the homepage section layout for each site. Use the section builder to drag-and-drop sections.',
    cta: { label: 'New Template', href: '/admin/collections/templates/create' },
  },
  users: {
    Icon: Users,
    iconColor: '#545B64', iconBg: '#F4F6F8',
    title: 'Users',
    description: 'Platform administrators and site editors. Editors are assigned to specific sites; admins access everything.',
    cta: { label: 'New User', href: '/admin/collections/users/create' },
  },
}

function StatPill({ count, label, color }: { count: number | null; label: string; color?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 4,
      background: C.bg, border: `1px solid ${C.border}`,
      fontSize: 13,
    }}>
      <span style={{ fontWeight: 700, color: color ?? C.text }}>
        {count === null ? '—' : count.toLocaleString()}
      </span>
      <span style={{ color: C.textMuted }}>{label}</span>
    </div>
  )
}

export function CollectionListHeader() {
  const pathname = usePathname() ?? ''
  const slug = pathname.match(/\/admin\/collections\/([^/]+)/)?.[1] ?? ''
  const meta = META[slug]

  const [total,     setTotal]     = useState<number | null>(null)
  const [published, setPublished] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/${slug}?limit=0`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setTotal(d.totalDocs ?? null))
      .catch(() => {})

    if (slug === 'news' || slug === 'pages') {
      fetch(`/api/${slug}?limit=0&where[status][equals]=published`, { credentials: 'include' })
        .then(r => r.json())
        .then(d => setPublished(d.totalDocs ?? null))
        .catch(() => {})
    }
    if (slug === 'sites') {
      fetch(`/api/sites?limit=0&where[status][equals]=active`, { credentials: 'include' })
        .then(r => r.json())
        .then(d => setPublished(d.totalDocs ?? null))
        .catch(() => {})
    }
  }, [slug])

  if (!meta) return null

  const { Icon, iconColor, iconBg, description, automatedBadge } = meta

  return (
    <div style={{
      fontFamily: '"Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif',
      marginTop: 20,
      marginBottom: 16,
    }}>
      {/* ── Separator from Payload's native page heading ── */}
      <div style={{ margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ height: 2, flex: 1, background: `linear-gradient(to right, #0972D3, #D5DBDB 60%, transparent)`, borderRadius: 1 }} />
      </div>

      {/* ── Automated provisioning banner (Sites only) ── */}
      {automatedBadge && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', marginBottom: 10,
          background: '#FFFBEB', border: '1px solid #FDE68A',
          borderLeft: `4px solid ${C.orange}`, borderRadius: 4,
          fontSize: 12, color: '#92400E',
        }}>
          <Rocket size={13} color={C.orange} style={{ flexShrink: 0 }} />
          <span>
            <strong>Automated setup available.</strong> For new sites, use the{' '}
            <Link href="/admin/site-builder" style={{ color: C.blue, fontWeight: 700 }}>
              Site Builder
            </Link>
            {' '}— it provisions everything in one guided flow.
          </span>
        </div>
      )}

      {/* ── Info strip: icon + description + stats ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '10px 14px',
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.blue}`,
        borderRadius: 4,
        boxShadow: '0 1px 2px rgba(0,28,36,0.06)',
      }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 6, flexShrink: 0,
          background: iconBg, border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={iconColor} />
        </div>

        {/* Description */}
        <p style={{
          flex: 1, minWidth: 0,
          fontSize: 12, color: C.textSub, margin: 0, lineHeight: 1.5,
        }}>
          {description}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <StatPill count={total} label="total" />
          {(slug === 'news' || slug === 'pages') && (
            <StatPill count={published} label="published" color={C.green} />
          )}
          {slug === 'sites' && (
            <StatPill count={published} label="active" color={C.green} />
          )}
        </div>
      </div>
    </div>
  )
}
