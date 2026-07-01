const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

async function payloadFetch<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T> {
  const { revalidate = 60, tags } = options
  const res = await fetch(`${PAYLOAD_URL}/api${path}`, {
    next: tags ? { tags, revalidate } : { revalidate },
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`)
  return res.json()
}

export async function getNews(siteId: number, limit = 10, page = 1, locale = 'en') {
  return payloadFetch<{ docs: any[]; totalPages: number; totalDocs: number }>(
    `/news?where[site][equals]=${siteId}&where[status][equals]=published&sort=-publishedDate&limit=${limit}&page=${page}&depth=1&locale=${locale}`,
    { tags: ['news', `site-${siteId}`], revalidate: 60 },
  )
}

export async function getNewsArticle(siteId: number, slug: string, locale = 'en') {
  const data = await payloadFetch<{ docs: any[] }>(
    `/news?where[site][equals]=${siteId}&where[slug][equals]=${slug}&depth=1&locale=${locale}`,
    { tags: ['news', `site-${siteId}`] },
  )
  return data.docs?.[0] ?? null
}

export async function getPages(siteId: number, locale = 'en') {
  return payloadFetch<{ docs: any[] }>(
    `/pages?where[site][equals]=${siteId}&where[status][equals]=published&depth=1&locale=${locale}`,
    { tags: ['pages', `site-${siteId}`], revalidate: 300 },
  )
}

export async function getPage(siteId: number, slug: string, locale = 'en') {
  const data = await payloadFetch<{ docs: any[] }>(
    `/pages?where[site][equals]=${siteId}&where[slug][equals]=${slug}&depth=1&locale=${locale}`,
    { tags: ['pages', `site-${siteId}`] },
  )
  return data.docs?.[0] ?? null
}

export async function getDepartments(siteId: number) {
  return payloadFetch<{ docs: any[] }>(
    `/departments?where[site][equals]=${siteId}&sort=name&limit=50&depth=1`,
    { tags: ['departments', `site-${siteId}`], revalidate: 300 },
  )
}

export async function getDocuments(siteId: number, category?: string) {
  const categoryFilter = category ? `&where[category][equals]=${category}` : ''
  return payloadFetch<{ docs: any[] }>(
    `/documents?where[site][equals]=${siteId}${categoryFilter}&sort=-createdAt&depth=1`,
    { tags: ['documents', `site-${siteId}`], revalidate: 60 },
  )
}

export async function searchContent(siteId: number, query: string, locale = 'en') {
  const q = encodeURIComponent(query)
  const [newsRes, pagesRes] = await Promise.all([
    payloadFetch<{ docs: any[] }>(
      `/news?where[site][equals]=${siteId}&where[or][0][title][contains]=${q}&where[or][1][summary][contains]=${q}&where[status][equals]=published&depth=1&locale=${locale}`,
      { revalidate: 0 },
    ),
    payloadFetch<{ docs: any[] }>(
      `/pages?where[site][equals]=${siteId}&where[title][contains]=${q}&where[status][equals]=published&depth=1&locale=${locale}`,
      { revalidate: 0 },
    ),
  ])
  return { news: newsRes.docs, pages: pagesRes.docs }
}
