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

// Admin only — for Sites and Users management
export const adminOnly: Access = ({ req }) => req.user?.role === 'admin'

// Admin can update any site; editor can update only sites in their own assignedSites
export const editorOwnSiteOrAdmin: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (req.user.role === 'editor') {
    const assigned: number[] = ((req.user as any).assignedSites ?? []).map(
      (s: any) => (typeof s === 'object' ? s.id : s),
    )
    if (assigned.length === 0) return false
    return { id: { in: assigned } }
  }
  return false
}

// Public create (contact form submissions), admin+editor read
export const publicCreate: Access = ({ req }) => {
  if (!req.user) return true // allow unauthenticated
  return true
}

export const adminOrEditorRead: Access = ({ req }) => {
  if (!req.user) return false
  return req.user.role === 'admin' || req.user.role === 'editor'
}
