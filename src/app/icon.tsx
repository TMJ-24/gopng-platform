export const dynamic     = 'force-dynamic'
export const contentType = 'image/png'

/**
 * Root-level favicon for Next.js frontend routes.
 * Delegates to /api/favicon which proxies the uploaded site logo.
 */
export default async function Icon() {
  const base = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'
  const res  = await fetch(`${base}/api/favicon`, { cache: 'no-store' })
  const data = await res.arrayBuffer()

  return new Response(data, {
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
