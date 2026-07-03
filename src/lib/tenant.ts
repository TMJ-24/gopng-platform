import { cache } from 'react'

export type Site = {
  id: number
  name: string
  slug: string
  domain: string
  agencyType: string
  theme: string
  status: string
  logo?: { url: string; alt?: string }
  heroImage?: { url: string; alt?: string }
  navigation?: {
    label: string
    href: string
    openInNewTab?: boolean
    children?: { label: string; href: string; description?: string; openInNewTab?: boolean }[]
  }[]
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
    poBox?: string
  }
}

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export const getSiteByDomain = cache(async (domain: string, locale = 'en'): Promise<Site | null> => {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/sites?where[domain][equals]=${domain}&limit=1&depth=1&locale=${locale}`,
      { next: { tags: ['sites'], revalidate: 300 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
})

export function getThemeColors(theme: string) {
  const themes: Record<string, { primary: string; secondary: string; accent: string }> = {
    default: { primary: '#232F3E', secondary: '#0972D3', accent: '#FF9900' },
    blue:    { primary: '#003087', secondary: '#0050c8', accent: '#FF9900' },
    green:   { primary: '#005a30', secondary: '#007a3d', accent: '#FF9900' },
    red:     { primary: '#8b0000', secondary: '#b91c1c', accent: '#FF9900' },
  }
  return themes[theme] ?? themes.default
}
