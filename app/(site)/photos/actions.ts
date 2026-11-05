'use server'

import { headers } from 'next/headers'
import { updateTag } from 'next/cache'
import { isSanityConfigured } from '@/sanity/env'
import { writeClient } from '@/sanity/lib/write-client'

export type UploadResult = { ok: true; demo?: boolean; hidden?: boolean } | { ok: false; error: string }

const MAX_BYTES = 9 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

// Per-server-instance limit: 60 photos per 10 minutes per visitor
const hits = new Map<string, { n: number; t: number }>()
async function tooMany() {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now })
    return false
  }
  return ++rec.n > 60
}

/** One photo per call (the page sends them one at a time so each shows progress). */
export async function uploadGuestPhoto(form: FormData): Promise<UploadResult> {
  const file = form.get('photo')
  const name = String(form.get('name') ?? '').trim().slice(0, 80)
  const caption = String(form.get('caption') ?? '').trim().slice(0, 200)
  const code = String(form.get('code') ?? '').trim()

  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Please choose a photo.' }
  if (!TYPES.includes(file.type)) return { ok: false, error: 'That file isn’t a photo we can use (JPG, PNG, WebP or HEIC).' }
  if (file.size > MAX_BYTES) return { ok: false, error: 'That photo is too large.' }

  if (!isSanityConfigured) return { ok: true, demo: true }
  if (await tooMany()) return { ok: false, error: 'That’s a lot of photos at once — give it a few minutes and try again.' }

  const settings = await writeClient.fetch<{ open?: boolean; code?: string; moderate?: boolean } | null>(
    `*[_id == "siteSettings"][0]{ "open": guestUploadsOpen, "code": guestUploadCode, "moderate": moderateGuestPhotos }`,
  )
  if (settings?.open === false) return { ok: false, error: 'Photo uploads are closed right now.' }
  const required = settings?.code?.trim()
  if (required && code.toLowerCase() !== required.toLowerCase()) return { ok: false, error: 'That upload code doesn’t match — check the card on your table.' }

  try {
    const asset = await writeClient.assets.upload('image', Buffer.from(await file.arrayBuffer()), {
      filename: file.name || 'photo.jpg',
      contentType: file.type,
    })
    const hidden = Boolean(settings?.moderate)
    await writeClient.create({
      _type: 'guestPhoto',
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      name: name || undefined,
      caption: caption || undefined,
      hidden,
      uploadedAt: new Date().toISOString(),
    })
    updateTag('guest-photos')
    return { ok: true, hidden }
  } catch (err) {
    console.error('[photos] upload failed', err)
    return { ok: false, error: 'Something went wrong uploading that photo — please try again.' }
  }
}
