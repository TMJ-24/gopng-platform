import type { CollectionConfig } from 'payload'
import { adminOnly, contentAccess, publicRead } from '@/access'
import { revalidateAfterChange, siteTag } from '@/hooks/revalidate'
import { triggerSiteDeploy } from '@/hooks/triggerSiteDeploy'
import { Hero } from '@/blocks/Hero'
import { Content } from '@/blocks/Content'
import { Gallery } from '@/blocks/Gallery'
import { Statistics } from '@/blocks/Statistics'
import { Downloads } from '@/blocks/Downloads'
import { QuickLinks } from '@/blocks/QuickLinks'
import { Contact } from '@/blocks/Contact'
import { LatestNews } from '@/blocks/LatestNews'

export const Pages: CollectionConfig = {
  slug: 'pages',
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
    afterChange: [revalidateAfterChange((doc) => ['pages', siteTag(doc)]), triggerSiteDeploy],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Auto-generated from title. Used in page URLs.' },
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
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true, index: true },
    {
      name: 'layout',
      type: 'blocks',
      admin: { description: 'Compose the page from reusable sections — drag to reorder.' },
      blocks: [Hero, Content, Gallery, Statistics, Downloads, QuickLinks, Contact, LatestNews],
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Legacy content field — only rendered on the frontend when Layout above is empty. Prefer Layout blocks for new pages.',
      },
    },
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
      admin: {
        condition: (data) => data?.status === 'published',
        description: 'Set automatically when published, or override manually.',
        date: { pickerAppearance: 'dayAndTime' },
      },
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
