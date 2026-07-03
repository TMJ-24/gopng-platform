import type { Block } from 'payload'

export const Downloads: Block = {
  slug: 'downloads',
  labels: { singular: 'Downloads', plural: 'Downloads Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
