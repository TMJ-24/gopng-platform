import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host   = headersList.get('host') ?? 'localhost:3000'
  const domain = host.replace(/:\d+$/, '')

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (domain.startsWith('localhost') ? 'http://localhost:3000' : `https://${domain}`)

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host:    siteUrl,
  }
}
