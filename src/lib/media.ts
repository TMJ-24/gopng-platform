/**
 * Converts a Payload absolute media URL to a relative path.
 * Payload returns URLs like http://localhost:3000/api/media/file/logo.jpg
 * Next.js <Image> needs either remotePatterns or a relative URL.
 * Making it relative is simpler and works in both dev and prod.
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const base = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:3000'
  if (url.startsWith(base + '/')) return url.slice(base.length)
  return url
}
