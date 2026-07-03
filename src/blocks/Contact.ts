import type { Block } from 'payload'

export const Contact: Block = {
  slug: 'contact',
  labels: { singular: 'Contact', plural: 'Contact Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Get in Touch' },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'both',
      options: [
        { label: 'Form only', value: 'form' },
        { label: 'Info only', value: 'info' },
        { label: 'Form + Info', value: 'both' },
      ],
    },
  ],
}
