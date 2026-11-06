import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  // Read fresh data: the site caches pages itself, and the webhook refresh must not get a stale CDN copy
  useCdn: false,
  perspective: 'published',
})
