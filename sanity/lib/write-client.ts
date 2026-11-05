import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/** Server-only client with write access — used for guest lookup and RSVP writes. Never import in client code. */
export const writeClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
