import type { CollectionConfig } from 'payload'
import { adminOnly, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'assignedSites'],
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  access: {
    read: isAdminOrSelf,
    create: adminOnly,
    update: isAdminOrSelf,
    delete: adminOnly,
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
    {
      name: 'assignedSites',
      type: 'relationship',
      relationTo: 'sites',
      hasMany: true,
      admin: {
        description: 'Sites this editor can manage. Admins have access to all sites.',
        condition: (data) => data?.role === 'editor',
      },
    },
  ],
}
