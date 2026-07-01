import type { CollectionConfig } from 'payload'
import { adminOnly, contentAccess, publicRead } from '@/access'
import { revalidateAfterChange, siteTag } from '@/hooks/revalidate'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'acronym', 'site', 'email'],
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  access: {
    read: publicRead,
    create: contentAccess('create'),
    update: contentAccess('update'),
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange((doc) => ['departments', siteTag(doc)])],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'acronym',
      type: 'text',
      admin: { description: 'e.g. DoH, DoE, DoF' },
    },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true, index: true },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    {
      name: 'website',
      type: 'text',
      admin: { description: 'e.g. https://health.gov.pg' },
    },
  ],
  timestamps: true,
}
