import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/lib/client'
import { isSanityConfigured } from '@/sanity/env'

export type GuestPhoto = {
  id: string
  url: string
  width: number
  height: number
  lqip?: string
  name?: string
  caption?: string
  uploadedAt?: string
}

export type UploadSettings = { open: boolean; requiresCode: boolean; saving: boolean }

/** Visible guest photos, newest first. Refreshed right after each upload (tag "guest-photos"). */
export async function getGuestPhotos(): Promise<GuestPhoto[]> {
  'use cache'
  cacheTag('guest-photos', 'content')
  cacheLife('minutes')
  if (!isSanityConfigured) return []
  return client
    .fetch<GuestPhoto[]>(
      `*[_type == "guestPhoto" && hidden != true && defined(image.asset)] | order(uploadedAt desc)[0...500]{
        "id": _id, name, caption, uploadedAt,
        "url": image.asset->url,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height,
        "lqip": image.asset->metadata.lqip
      }`,
    )
    .catch(() => [])
}

/** Public settings only — the upload code itself never leaves the server. */
export async function getUploadSettings(): Promise<UploadSettings> {
  'use cache'
  cacheTag('content')
  cacheLife('minutes')
  if (!isSanityConfigured) return { open: true, requiresCode: false, saving: false }
  const s = await client
    .fetch<{ open?: boolean; code?: string } | null>(`*[_id == "siteSettings"][0]{ "open": guestUploadsOpen, "code": guestUploadCode }`)
    .catch(() => null)
  return { open: s?.open !== false, requiresCode: Boolean(s?.code?.trim()), saving: true }
}
