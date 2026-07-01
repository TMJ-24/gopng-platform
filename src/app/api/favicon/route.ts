export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'

    /* Look up the first site's logo */
    const sitesRes = await fetch(`${base}/api/sites?limit=1&depth=1&sort=-createdAt`, {
      cache: 'no-store',
    })
    const sites = await sitesRes.json()
    const rawUrl: string | undefined = sites?.docs?.[0]?.logo?.url

    if (rawUrl) {
      const imgUrl = rawUrl.startsWith('http') ? rawUrl : `${base}${rawUrl}`
      const imgRes  = await fetch(imgUrl, { cache: 'no-store' })
      const imgData = await imgRes.arrayBuffer()
      const mime    = imgRes.headers.get('content-type') ?? 'image/png'

      return new Response(imgData, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    }
  } catch {
    /* fall through to fallback */
  }

  /* Fallback — 1×1 transparent PNG */
  const transparentPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  )
  return new Response(transparentPng, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=60' },
  })
}
