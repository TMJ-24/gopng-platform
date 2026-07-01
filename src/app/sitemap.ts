import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getSiteByDomain } from '@/lib/tenant'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

async function payloadFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api${path}`, { next: { revalidate: 3600 } })
  if (!res.ok) return { docs: [] } as T
  return res.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Resolve the current site from the incoming request host
  const headersList = await headers()
  const host   = headersList.get('host') ?? 'localhost:3000'
  const domain = host.replace(/:\d+$/, '')
  const site   = await getSiteByDomain(domain)

  // Build the canonical base URL: prefer env var, fall back to the domain itself
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (domain.startsWith('localhost') ? 'http://localhost:3000' : `https://${domain}`)

  const urls: MetadataRoute.Sitemap = [
    { url: base,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/news`,             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/about`,                                      changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/what-we-do`,                                 changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/departments`,                                changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/publications`,                               changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/contact`,                                    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/search`,                                     changeFrequency: 'monthly', priority: 0.4 },
  ]

  if (!site) return urls

  try {
    // News articles scoped to this site
    const news = await payloadFetch<{ docs: { slug: string; updatedAt: string }[] }>(
      `/news?where[site][equals]=${site.id}&where[status][equals]=published&limit=500&select=slug,updatedAt`,
    )
    for (const item of news.docs) {
      urls.push({
        url:             `${base}/news/${item.slug}`,
        lastModified:    new Date(item.updatedAt),
        changeFrequency: 'weekly',
        priority:        0.6,
      })
    }

    // CMS pages scoped to this site (exclude slugs already listed as static routes)
    const STATIC_SLUGS = new Set(['home', 'about', 'what-we-do', 'contact'])
    const pages = await payloadFetch<{ docs: { slug: string; updatedAt: string }[] }>(
      `/pages?where[site][equals]=${site.id}&where[status][equals]=published&limit=500&select=slug,updatedAt`,
    )
    for (const item of pages.docs) {
      if (STATIC_SLUGS.has(item.slug)) continue
      urls.push({
        url:             `${base}/${item.slug}`,
        lastModified:    new Date(item.updatedAt),
        changeFrequency: 'monthly',
        priority:        0.5,
      })
    }
  } catch {
    // Gracefully degrade — return static URLs only
  }

  return urls
}
