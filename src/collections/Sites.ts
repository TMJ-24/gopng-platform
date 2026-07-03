import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '@/access'
import { revalidateAfterChange } from '@/hooks/revalidate'
import { provisionSiteRepo } from '@/hooks/provisionSiteRepo'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'domain',
    defaultColumns: ['name', 'domain', 'agencyType', 'status'],
    components: {
      beforeListTable: ['/components/admin/CollectionListHeader#CollectionListHeader'],
    },
  },
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [provisionSiteRepo, revalidateAfterChange(['sites'])],
  },
  fields: [
    {
      name: 'deployActions',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/RedeployButton#RedeployButton',
        },
      },
    },
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Auto-generated from name. Used in URLs.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },
    { name: 'domain', type: 'text', admin: { description: 'e.g. health.gov.pg' } },
    {
      name: 'agencyType',
      type: 'select',
      required: true,
      options: [
        { label: 'Ministry', value: 'ministry' },
        { label: 'Department', value: 'department' },
        { label: 'Authority', value: 'authority' },
        { label: 'Commission', value: 'commission' },
        { label: 'Statutory Body', value: 'statutory-body' },
        { label: 'Provincial Government', value: 'provincial' },
        { label: 'State-Owned Enterprise', value: 'soe' },
      ],
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Blue (GoPNG)', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
      admin: { description: 'Website template controlling homepage section layout.' },
    },
    {
      name: 'navigation',
      type: 'array',
      admin: { description: 'Custom nav links. Leave empty to use default menu. Add children to a link to show it as a dropdown mega-menu.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        {
          name: 'children',
          type: 'array',
          admin: { description: 'Optional sub-links shown in a dropdown under this item.' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
        { name: 'poBox', type: 'text', label: 'PO Box' },
      ],
    },

    // ── Auto-provisioned on create — do not edit manually ──────────
    {
      name: 'repoName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'GitHub repository name — set automatically when the site is created.',
        condition: (data) => Boolean(data?.repoName),
      },
    },
    {
      name: 'repoUrl',
      label: 'Repository URL',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data?.repoUrl),
      },
    },
    {
      name: 'deployStatus',
      type: 'select',
      defaultValue: 'none',
      admin: {
        readOnly: true,
        description: 'Current state of the static site deployment.',
        condition: (data) => Boolean(data?.repoName),
      },
      options: [
        { label: 'Not provisioned', value: 'none'     },
        { label: 'Building',        value: 'building'  },
        { label: 'Deployed',        value: 'deployed'  },
        { label: 'Failed',          value: 'failed'    },
      ],
    },
  ],
  timestamps: true,
}
