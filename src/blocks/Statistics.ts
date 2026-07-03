import type { Block } from 'payload'

export const Statistics: Block = {
  slug: 'statistics',
  labels: { singular: 'Statistics', plural: 'Statistics Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
