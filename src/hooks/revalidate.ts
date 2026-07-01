import type { CollectionAfterChangeHook } from 'payload'

type TagsArg = string[] | ((doc: any) => string[])

export const revalidateAfterChange =
  (tags: TagsArg): CollectionAfterChangeHook =>
  async ({ doc }) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const secret = process.env.REVALIDATION_SECRET

    if (!secret) return doc

    const resolvedTags = typeof tags === 'function' ? tags(doc) : tags

    try {
      await fetch(`${siteUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ tags: resolvedTags }),
      })
    } catch {
      // Non-fatal: revalidation failure shouldn't break the save
    }

    return doc
  }

/** Extracts the numeric site ID from a doc — handles both populated object and raw ID */
export function siteTag(doc: any): string {
  const id = typeof doc.site === 'object' ? doc.site?.id : doc.site
  return `site-${id}`
}
