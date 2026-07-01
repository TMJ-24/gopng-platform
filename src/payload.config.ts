import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Sites } from './collections/Sites'
import { Pages } from './collections/Pages'
import { News } from './collections/News'
import { Departments } from './collections/Departments'
import { Documents } from './collections/Documents'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Templates } from './collections/Templates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || '',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — GoPNG Platform',
    },
    components: {
      Nav: '/components/admin/AdminNav#AdminNav',
      graphics: {
        Logo: '/components/admin/AdminLogo#AdminLogo',
        Icon: '/components/admin/AdminIcon#AdminIcon',
      },
      beforeDashboard: [
        '/components/admin/CollectionCards#DashboardCollectionCards',
        '/components/admin/LocaleReset#LocaleReset',
      ],
      beforeLogin: ['/components/admin/PasswordToggle#PasswordToggle'],
      providers: ['/components/admin/AdminGlobalStyles#AdminGlobalStyles'],
      views: {
        siteBuilder: {
          Component: '/components/admin/SiteBuilderView#SiteBuilderView',
          path: '/site-builder',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Sites, Pages, News, Departments, Documents, ContactSubmissions, Templates],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Tok Pisin', code: 'tpi' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || 'noreply@gov.pg',
    defaultFromName: process.env.SMTP_FROM_NAME || 'GoPNG Website Platform',
    transportOptions: {
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins: [],
})
