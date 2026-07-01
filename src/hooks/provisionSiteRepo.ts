import type { CollectionAfterChangeHook } from 'payload'

const GH = 'https://api.github.com'

const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
})

async function setVar(org: string, repo: string, token: string, name: string, value: string) {
  const res = await fetch(`${GH}/repos/${org}/${repo}/actions/variables`, {
    method: 'POST',
    headers: GH_HEADERS(token),
    body: JSON.stringify({ name, value }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`setVar(${name}) failed ${res.status}: ${text}`)
  }
}

async function dispatchWorkflow(
  org: string,
  repo: string,
  token: string,
  workflow: string,
  ref = 'main',
  inputs: Record<string, string> = {},
) {
  const res = await fetch(`${GH}/repos/${org}/${repo}/actions/workflows/${workflow}/dispatches`, {
    method: 'POST',
    headers: GH_HEADERS(token),
    body: JSON.stringify({ ref, inputs }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`dispatchWorkflow failed ${res.status}: ${text}`)
  }
}

async function waitForRepo(org: string, repo: string, token: string, attempts = 8): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${GH}/repos/${org}/${repo}`, { headers: GH_HEADERS(token) })
    if (res.ok) return true
    await new Promise(r => setTimeout(r, 2000))
  }
  return false
}

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
  const createRes = await fetch(`${GH}/repos/${org}/${templateRepo}/generate`, {
    method: 'POST',
    headers: GH_HEADERS(token),
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

  // Persist repoName + repoUrl immediately so the admin can see the link
  await payload.update({
    collection: 'sites',
    id: doc.id,
    data: { repoName, repoUrl, deployStatus: 'building' },
    overrideAccess: true,
  })

  // ── 2. Poll until the repo is ready (GitHub takes a few seconds) ──
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

  // ── 3. Set Actions variables (non-sensitive config) ────────────────
  await Promise.all([
    setVar(org, repoName, token, 'SITE_SLUG',       siteSlug),
    setVar(org, repoName, token, 'PAYLOAD_API_URL',  payloadUrl),
    setVar(org, repoName, token, 'S3_BUCKET',        s3Bucket),
    setVar(org, repoName, token, 'SITE_DOMAIN',      domain),
    setVar(org, repoName, token, 'AWS_REGION',       awsRegion),
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
 *
 * Uses fire-and-forget so the admin UI responds immediately rather than
 * waiting on GitHub API round-trips.
 */
export const provisionSiteRepo: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  // Only run on first creation and only when the repo hasn't been set yet
  if (operation !== 'create' || doc.repoName) return doc

  // Capture payload before entering async context — fixes type inference
  const payload = req.payload

  // Detach from the request lifecycle — admin gets an instant response
  void provision(doc, payload).catch((err: unknown) => {
    payload.logger.error(`[provisionSiteRepo] Unhandled error: ${err}`)
    void payload
      .update({ collection: 'sites', id: doc.id, data: { deployStatus: 'failed' }, overrideAccess: true })
      .catch(() => {})
  })

  return doc
}
