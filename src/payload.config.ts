import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Sites } from './collections/Sites'
import { ContactSubmissions } from './collections/ContactSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Empty serverURL keeps config.csrf=[] so Safari (no Sec-Fetch-Site) can use cookie auth.
  // NEXT_PUBLIC_PAYLOAD_URL is still used client-side for API reference.
  serverURL: process.env.PAYLOAD_SERVER_URL || '',
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
  collections: [Users, Sites, ContactSubmissions],
  // Public sites (site-template repos) are static and POST contact-form submissions
  // cross-origin from ~100 growing agency domains. Real access control is enforced by
  // Payload's access functions regardless of CORS (ContactSubmissions.create is already
  // intentionally publicCreate) — CORS here is just the browser boundary, not the security
  // control, so an exact-origin allowlist would be maintenance overhead for no real gain.
  cors: '*',
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
      // Accept both DATABASE_URL (standard) and DATABASE_URI (older convention)
      // so the migration task definition works regardless of which name was set.
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || '',
    },
  }),
  // Only enable SMTP when a host is explicitly configured.
  // Skipping this in migration / build environments (no SMTP_HOST set)
  // prevents nodemailerAdapter.verify() from throwing ECONNREFUSED and
  // crashing Payload before any migration runs.
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || 'noreply@gov.pg',
          defaultFromName: process.env.SMTP_FROM_NAME || 'GoPNG Website Platform',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
})
