import type { NextConfig } from 'next'

/**
 * PAGES_BASE_PATH set (e.g. "/wedding-website") → static preview build for GitHub Pages
 * (see scripts/build-pages.sh). Unset → the full site (Vercel): RSVP saving, Studio, image optimization.
 */
const pagesBase = process.env.PAGES_BASE_PATH
const isPages = pagesBase !== undefined

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  ...(isPages ? { output: 'export' as const, basePath: pagesBase, trailingSlash: true } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: pagesBase ?? '' },
  // The link-preview image reads our photo + fonts from disk; make sure hosts bundle them with that route
  outputFileTracingIncludes: {
    '/opengraph-image*': ['./public/photos/**/*', './app/fonts/og/**/*'],
  },
  images: {
    unoptimized: isPages, // static hosting has no image optimizer
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
