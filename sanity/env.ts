export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-10-01'

/** False until a Sanity project is connected — the site then runs on placeholder content. */
export const isSanityConfigured = projectId.length > 0
