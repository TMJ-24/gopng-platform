import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access'

export const SECTION_TYPES = [
  { label: 'Hero (Search + CTA)',   value: 'hero' },
  { label: 'Citizen Services',      value: 'services' },
  { label: 'Stats Counter',         value: 'stats' },
  { label: 'Government News',       value: 'news' },
  { label: 'Agency Directory',      value: 'directory' },
  { label: 'Open Data',             value: 'opendata' },
  { label: 'About / Mission',       value: 'about' },
  { label: 'Contact CTA',           value: 'cta' },
]

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'name',
    group: 'Platform',
    defaultColumns: ['name', 'category', 'isActive', 'updatedAt'],
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug', type: 'text', unique: true, required: true,
      hooks: {
        beforeValidate: [({ value, data }) =>
          value ?? (data?.name as string)?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        ],
      },
    },
    { name: 'description', type: 'textarea' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'National Portal',              value: 'portal' },
        { label: 'Ministry Website',              value: 'ministry' },
        { label: 'Department Website',            value: 'department' },
        { label: 'Provincial Government',         value: 'provincial' },
        { label: 'Statutory Authority',           value: 'authority' },
        { label: 'Commission',                    value: 'commission' },
        { label: 'Statutory Body',                value: 'statutory-body' },
        { label: 'State-Owned Enterprise',        value: 'soe' },
      ],
    },
    {
      name: 'defaultTheme', type: 'select', defaultValue: 'default',
      options: [
        { label: 'Dark Grey (Default)', value: 'default' },
        { label: 'Blue (GoPNG)',        value: 'blue' },
        { label: 'Green',               value: 'green' },
        { label: 'Red',                 value: 'red' },
      ],
    },
    {
      name: 'sections', type: 'array',
      admin: {
        description: 'Homepage sections — drag to reorder, toggle to enable/disable, × to remove.',
        components: {
          Field: '/components/admin/SectionBuilderField#SectionBuilderField',
        },
      },
      fields: [
        { name: 'type', type: 'select', required: true, options: SECTION_TYPES },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'isDefault', type: 'checkbox', defaultValue: false,
      admin: { description: 'Use as the default template when none is selected for a site.' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
