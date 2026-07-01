import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  admin: {
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
  upload: true,
}
