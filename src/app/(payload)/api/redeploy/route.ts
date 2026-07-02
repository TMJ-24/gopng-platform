import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { dispatchWorkflow } from '@/lib/github'

/**
 * POST { siteId: number }
 * Triggers a fresh GitHub Actions build for an already-provisioned site.
 * Requires admin or editor auth.
 */
export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const headersList = await headers()

  const { user } = await payload.auth({ headers: headersList as any })
  if (!user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }
  if ((user as any).role !== 'admin' && (user as any).role !== 'editor') {
    return Response.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  let body: { siteId?: number | string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { siteId } = body
  if (!siteId) {
    return Response.json({ error: 'siteId is required' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  const org   = process.env.GITHUB_ORG
  if (!token || !org) {
    return Response.json({ error: 'GitHub integration not configured' }, { status: 503 })
  }

  let site: any
  try {
    site = await payload.findByID({ collection: 'sites', id: siteId, overrideAccess: true })
  } catch {
    return Response.json({ error: 'Site not found' }, { status: 404 })
  }

  if (!site?.repoName) {
    return Response.json({ error: 'Site has no provisioned repository' }, { status: 409 })
  }

  // Editors may only redeploy sites they are assigned to
  if ((user as any).role === 'editor') {
    const assigned: (number | string)[] = ((user as any).assignedSites ?? []).map(
      (s: any) => (typeof s === 'object' ? s.id : s),
    )
    if (!assigned.map(String).includes(String(siteId))) {
      return Response.json({ error: 'You are not assigned to this site' }, { status: 403 })
    }
  }

  await payload.update({
    collection: 'sites',
    id: siteId,
    data: { deployStatus: 'building' },
    overrideAccess: true,
  })

  try {
    await dispatchWorkflow(org, site.repoName, token, 'deploy.yml', 'main', {
      site_slug: site.slug,
    })
  } catch (err) {
    await payload.update({
      collection: 'sites',
      id: siteId,
      data: { deployStatus: 'failed' },
      overrideAccess: true,
    }).catch(() => {})
    return Response.json({ error: String(err) }, { status: 502 })
  }

  return Response.json({ ok: true, site: site.slug, status: 'building' })
}
