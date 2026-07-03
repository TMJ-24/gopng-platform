import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

type SeedTemplate = {
  name: string
  slug: string
  category: string
  description: string
  defaultTheme: string
  sections: string[]
}

const TEMPLATE_SEED_DATA: SeedTemplate[] = [
  {
    name: 'Government Portal',
    slug: 'gov-portal',
    category: 'portal',
    description:
      'Full-featured national portal with search hero, services grid, live stats, news and agency directory.',
    defaultTheme: 'default',
    sections: ['hero', 'services', 'stats', 'news', 'directory', 'cta'],
  },
  {
    name: 'Ministry Website',
    slug: 'ministry-site',
    category: 'ministry',
    description: 'Professional ministry site with mandate section, policy news, and contact call-to-action.',
    defaultTheme: 'blue',
    sections: ['hero', 'about', 'services', 'news', 'cta'],
  },
  {
    name: 'Department Website',
    slug: 'department-site',
    category: 'department',
    description: 'Clean department site focused on citizen services, publications, and quick contact info.',
    defaultTheme: 'default',
    sections: ['hero', 'services', 'news', 'cta'],
  },
  {
    name: 'Provincial Government',
    slug: 'provincial-gov',
    category: 'provincial',
    description: 'Provincial portal showcasing local departments, community news, and regional services.',
    defaultTheme: 'green',
    sections: ['hero', 'services', 'news', 'directory', 'cta'],
  },
  {
    name: 'Commission Website',
    slug: 'commission-site',
    category: 'commission',
    description: 'Independent commission site with mandate, findings/reports, and public inquiry contact.',
    defaultTheme: 'blue',
    sections: ['hero', 'about', 'news', 'opendata', 'cta'],
  },
  {
    name: 'Statutory Body Website',
    slug: 'statutory-body-site',
    category: 'statutory-body',
    description: 'Regulatory/statutory body site emphasising services, compliance info, and directory.',
    defaultTheme: 'default',
    sections: ['hero', 'services', 'directory', 'news', 'cta'],
  },
  {
    name: 'State-Owned Enterprise Website',
    slug: 'soe-site',
    category: 'soe',
    description: 'Commercial-facing SOE site with services, stats/performance, and news.',
    defaultTheme: 'green',
    sections: ['hero', 'services', 'stats', 'news', 'cta'],
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const t of TEMPLATE_SEED_DATA) {
    const existing = await payload.find({
      collection: 'templates',
      where: { slug: { equals: t.slug } },
      limit: 1,
      req,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'templates',
      data: {
        name: t.name,
        slug: t.slug,
        category: t.category as any,
        description: t.description,
        defaultTheme: t.defaultTheme as any,
        isActive: true,
        sections: t.sections.map((type) => ({ type: type as any, enabled: true })),
      },
      req,
    })
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  for (const t of TEMPLATE_SEED_DATA) {
    const existing = await payload.find({
      collection: 'templates',
      where: { slug: { equals: t.slug } },
      limit: 1,
      req,
    })
    if (existing.docs[0]) {
      await payload.delete({ collection: 'templates', id: existing.docs[0].id, req })
    }
  }
}
