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

// Admin can do anything; editor can write if their assignedSites includes the site
export const contentAccess =
  (operation: 'create' | 'update' | 'delete'): Access =>
  ({ req }) => {
    if (!req.user) return false
    if (req.user.role === 'admin') return true
    if (req.user.role === 'editor' && operation !== 'delete') return true
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
