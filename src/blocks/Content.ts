import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  labels: { singular: 'Content', plural: 'Content Blocks' },
  fields: [{ name: 'body', type: 'richText', required: true, localized: true }],
}
