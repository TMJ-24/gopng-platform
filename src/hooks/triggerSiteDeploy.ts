import type { CollectionAfterChangeHook } from 'payload'
import { dispatchWorkflow } from '@/lib/github'

// Debounce per-site to avoid queuing many builds on rapid saves
const pending = new Map<number | string, ReturnType<typeof setTimeout>>()

async function redeploy(siteId: number | string, payload: any) {
  const token = process.env.GITHUB_TOKEN
  const org   = process.env.GITHUB_ORG

  if (!token || !org) return

  let site: any
  try {
    site = await payload.findByID({ collection: 'sites', id: siteId, overrideAccess: true })
  } catch {
    return
  }

  if (!site?.repoName) return // not yet provisioned

  try {
    await payload.update({
      collection: 'sites',
      id: siteId,
      data: { deployStatus: 'building' },
      overrideAccess: true,
    })
    await dispatchWorkflow(org, site.repoName, token, 'deploy.yml', 'main', {
      site_slug: site.slug,
    })
    payload.logger.info(`[triggerSiteDeploy] Triggered rebuild for ${site.repoName}`)
  } catch (err) {
    payload.logger.error(`[triggerSiteDeploy] Failed to dispatch for ${site.repoName}: ${err}`)
    await payload.update({
      collection: 'sites',
      id: siteId,
      data: { deployStatus: 'failed' },
      overrideAccess: true,
    }).catch(() => {})
  }
}

/**
 * Fires after a Page or News doc is saved with status=published.
 * Debounces per-site (500 ms) so rapid saves don't queue dozens of builds.
 */
export const triggerSiteDeploy: CollectionAfterChangeHook = ({ doc, req }) => {
  if (doc.status !== 'published') return doc

  const siteId: number | string =
    typeof doc.site === 'object' ? doc.site?.id : doc.site
  if (!siteId) return doc

  const payload = req.payload

  // Cancel any pending trigger for this site, replace with a fresh one
  const existing = pending.get(siteId)
  if (existing) clearTimeout(existing)

  pending.set(
    siteId,
    setTimeout(() => {
      pending.delete(siteId)
      void redeploy(siteId, payload).catch((err: unknown) => {
        payload.logger.error(`[triggerSiteDeploy] Unhandled: ${err}`)
      })
    }, 500),
  )

  return doc
}
