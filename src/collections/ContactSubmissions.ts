import type { CollectionConfig } from 'payload'
import { adminOrEditorRead, publicCreate } from '@/access'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'site', 'status', 'createdAt'],
    description: 'Messages submitted via the contact form on each site.',
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  access: {
    read: adminOrEditorRead,
    create: publicCreate,
    update: adminOrEditorRead,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
    },
  ],
  timestamps: true,
}
