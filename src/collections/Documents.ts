import type { CollectionConfig } from 'payload'
import { adminOnly, contentAccess, publicRead } from '@/access'
import { revalidateAfterChange, siteTag } from '@/hooks/revalidate'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'site', 'createdAt'],
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
    afterChange: [revalidateAfterChange((doc) => ['documents', siteTag(doc)])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Policy', value: 'policy' },
        { label: 'Report', value: 'report' },
        { label: 'Form', value: 'form' },
        { label: 'Legislation', value: 'legislation' },
        { label: 'Budget', value: 'budget' },
        { label: 'Tender', value: 'tender' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true, index: true },
  ],
  timestamps: true,
}
