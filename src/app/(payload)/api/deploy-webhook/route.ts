import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Called by GitHub Actions at the end of a site build.
 * Body: { site_slug: string, status: 'deployed' | 'failed', sha?: string }
 * Secured by DEPLOY_WEBHOOK_SECRET header.
 */
export async function POST(req: Request) {
  const secret = process.env.DEPLOY_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const incoming = req.headers.get('x-deploy-secret')
  if (!incoming || incoming !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { site_slug?: string; status?: string; sha?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { site_slug, status, sha } = body

  if (!site_slug || (status !== 'deployed' && status !== 'failed')) {
    return Response.json(
      { error: 'site_slug and status (deployed|failed) are required' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'sites',
    where: { slug: { equals: site_slug } },
    limit: 1,
    overrideAccess: true,
  })

  if (result.totalDocs === 0) {
    return Response.json({ error: `Site "${site_slug}" not found` }, { status: 404 })
  }

  const site = result.docs[0]

  await payload.update({
    collection: 'sites',
    id: site.id,
    data: { deployStatus: status as 'deployed' | 'failed' },
    overrideAccess: true,
  })

  payload.logger.info(
    `[deploy-webhook] ${site_slug} → ${status}${sha ? ` (${sha.slice(0, 7)})` : ''}`,
  )

  return Response.json({ ok: true, site: site_slug, status })
}
