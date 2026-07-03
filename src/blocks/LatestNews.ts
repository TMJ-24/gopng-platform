import type { Block } from 'payload'

export const LatestNews: Block = {
  slug: 'latest-news',
  labels: { singular: 'Latest News', plural: 'Latest News Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Latest News' },
    { name: 'count', type: 'number', defaultValue: 3, min: 1, max: 6 },
  ],
}
