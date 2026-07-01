import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/media/**' },
    ],
    remotePatterns: [
      /* Local dev — Payload serves media via its API route */
      { protocol: 'http',  hostname: 'localhost', port: '3000', pathname: '/api/media/file/**' },
      { protocol: 'http',  hostname: 'localhost', port: '3000', pathname: '/media/**' },
      /* Production gov.pg subdomains */
      { protocol: 'https', hostname: '**.gov.pg',  pathname: '/api/media/file/**' },
      { protocol: 'https', hostname: '**.gov.pg',  pathname: '/media/**' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
