import type { CollectionConfig } from 'payload'
import { adminOnly, contentAccess, publicRead } from '@/access'
import { revalidateAfterChange, siteTag } from '@/hooks/revalidate'
import { triggerSiteDeploy } from '@/hooks/triggerSiteDeploy'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'status', 'publishedDate'],
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
    afterChange: [revalidateAfterChange((doc) => ['news', siteTag(doc)]), triggerSiteDeploy],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return (typeof data.title === 'string' ? data.title : data.title?.en ?? '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ value, data, operation }) => {
            if (data?.status === 'published' && !value && operation === 'create') {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
