import type { Block } from 'payload'

export const QuickLinks: Block = {
  slug: 'quick-links',
  labels: { singular: 'Quick Links', plural: 'Quick Links Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
