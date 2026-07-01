import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'

export const isAdminOrSelf: Access = ({ req, id }) => {
  if (req.user?.role === 'admin') return true
  if (req.user && id) return req.user.id === id
  return false
}

// Public read, authenticated write
export const publicRead: Access = ({ req }) => {
  if (req.user) return true
  return true // public
}

// Admin can do anything; editor can write only to their assigned sites
export const contentAccess =
  (operation: 'create' | 'update' | 'delete'): Access =>
  ({ req, data }) => {
    if (!req.user) return false
    if (req.user.role === 'admin') return true
    if (req.user.role === 'editor' && operation !== 'delete') {
      const assigned: number[] = ((req.user as any).assignedSites ?? []).map(
        (s: any) => (typeof s === 'object' ? s.id : s),
      )
      if (assigned.length === 0) return false
      if (operation === 'create') {
        const siteId = Number(data?.site)
        return assigned.includes(siteId)
      }
      // For update: return a where-clause so Payload filters at the DB level
      return { site: { in: assigned } }
    }
    return false
  }

// Admin only — for Sites and Users management
export const adminOnly: Access = ({ req }) => req.user?.role === 'admin'

// Public create (contact form submissions), admin+editor read
export const publicCreate: Access = ({ req }) => {
  if (!req.user) return true // allow unauthenticated
  return true
}

export const adminOrEditorRead: Access = ({ req }) => {
  if (!req.user) return false
  return req.user.role === 'admin' || req.user.role === 'editor'
}
