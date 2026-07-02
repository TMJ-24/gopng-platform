import type { CollectionAfterChangeHook } from 'payload'
import { dispatchWorkflow, ghHeaders, setRepoVar, waitForRepo } from '@/lib/github'

async function provision(doc: any, payload: any) {
  const token        = process.env.GITHUB_TOKEN
  const org          = process.env.GITHUB_ORG
  const templateRepo = process.env.GITHUB_TEMPLATE_REPO ?? 'site-template'
  const payloadUrl   = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? ''
  const s3Bucket     = process.env.S3_STATIC_SITES_BUCKET ?? ''
  const awsRegion    = process.env.AWS_REGION ?? 'ap-southeast-2'

  if (!token || !org) {
    payload.logger.warn('[provisionSiteRepo] GITHUB_TOKEN or GITHUB_ORG not set — skipping')
    return
  }

  const siteSlug = doc.slug as string
  const domain   = (doc.domain as string) ?? ''
  const siteName = typeof doc.name === 'object'
    ? ((doc.name as Record<string, string>)?.en ?? siteSlug)
    : ((doc.name as string) ?? siteSlug)

  const repoName = `site-${siteSlug}`

  payload.logger.info(`[provisionSiteRepo] Creating repo ${org}/${repoName} from template ${templateRepo}`)

  // ── 1. Create repo from template ──────────────────────────────────
  const createRes = await fetch(`https://api.github.com/repos/${org}/${templateRepo}/generate`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({
      owner: org,
      name: repoName,
      description: `GoPNG static site — ${siteName}`,
      private: false,
      include_all_branches: false,
    }),
  })

  if (!createRes.ok) {
    const body = await createRes.text()
    payload.logger.error(`[provisionSiteRepo] Repo creation failed (${createRes.status}): ${body}`)
    await payload.update({
      collection: 'sites',
      id: doc.id,
      data: { deployStatus: 'failed' },
      overrideAccess: true,
    })
    return
  }

  const repoData = (await createRes.json()) as { html_url: string }
  const repoUrl  = repoData.html_url

  await payload.update({
    collection: 'sites',
    id: doc.id,
    data: { repoName, repoUrl, deployStatus: 'building' },
    overrideAccess: true,
  })

  // ── 2. Poll until the repo is ready ───────────────────────────────
  const ready = await waitForRepo(org, repoName, token)
  if (!ready) {
    payload.logger.error(`[provisionSiteRepo] Repo ${repoName} never became ready`)
    await payload.update({
      collection: 'sites',
      id: doc.id,
      data: { deployStatus: 'failed' },
      overrideAccess: true,
    })
    return
  }

  // ── 3. Set Actions variables ───────────────────────────────────────
  await Promise.all([
    setRepoVar(org, repoName, token, 'SITE_SLUG',      siteSlug),
    setRepoVar(org, repoName, token, 'PAYLOAD_API_URL', payloadUrl),
    setRepoVar(org, repoName, token, 'S3_BUCKET',       s3Bucket),
    setRepoVar(org, repoName, token, 'SITE_DOMAIN',     domain),
    setRepoVar(org, repoName, token, 'AWS_REGION',      awsRegion),
    setRepoVar(org, repoName, token, 'DEPLOY_WEBHOOK_URL',
      `${payloadUrl}/api/deploy-webhook`),
  ])

  // ── 4. Trigger the initial build ───────────────────────────────────
  await dispatchWorkflow(org, repoName, token, 'deploy.yml', 'main', {
    site_slug: siteSlug,
  })

  payload.logger.info(`[provisionSiteRepo] Provisioned ${repoUrl} — initial deploy triggered`)
}

/**
 * Fires after a Site document is created. Provisions a GitHub repo from the
 * site-template, sets Actions variables, and dispatches the first deploy.
 */
export const provisionSiteRepo: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  if (operation !== 'create' || doc.repoName) return doc

  const payload = req.payload

  void provision(doc, payload).catch((err: unknown) => {
    payload.logger.error(`[provisionSiteRepo] Unhandled error: ${err}`)
    void payload
      .update({ collection: 'sites', id: doc.id, data: { deployStatus: 'failed' }, overrideAccess: true })
      .catch(() => {})
  })

  return doc
}
