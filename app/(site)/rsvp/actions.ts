'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { isSanityConfigured } from '@/sanity/env'
import { writeClient } from '@/sanity/lib/write-client'
import { getContent } from '@/lib/content'
import { partySize, type RsvpInput, type RsvpResult } from '@/lib/rsvp'

const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase()

// Basic in-memory rate limit (per server instance) to stop spam.
const hits = new Map<string, { n: number; t: number }>()
async function limited() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now })
    return false
  }
  rec.n++
  return rec.n > 15
}

const text = (max: number) => z.string().trim().max(max).optional()
const count = z.number().int().min(0).max(30)

const Rsvp = z.object({
  name: z.string().trim().min(2).max(120),
  family: z.string().trim().min(2).max(120),
  attending: z.boolean(),
  adults: count,
  children: count,
  plusOnes: count,
  plusOneNames: text(500),
  guestNames: text(1000),
  email: z.union([z.literal(''), z.email()]).optional(),
  phone: text(40),
  dietary: text(1000),
  song: text(200),
  message: text(2000),
  website: z.string().optional(),
})

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  const parsed = Rsvp.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Something looks off in the form — please check it and try again.' }
  const d = parsed.data
  if (d.website) return { ok: true } // bot filled the hidden field; pretend it worked
  if (await limited()) return { ok: false, error: 'Too many tries — please wait a few minutes.' }

  const { settings } = await getContent()
  if (new Date() > new Date(settings.rsvpDeadline)) {
    return { ok: false, error: `RSVPs closed on ${settings.rsvpDeadlineLabel} — please reach out to us directly${settings.contactEmail ? ` at ${settings.contactEmail}` : ''}.` }
  }
  if (d.attending) {
    if (d.adults < 1) return { ok: false, error: 'Please include at least one adult (you!).' }
    if (!settings.rsvp.plusOnes && d.plusOnes > 0) return { ok: false, error: 'Plus ones aren’t available — please reach out to us.' }
    if (partySize(d) > settings.rsvp.maxParty) {
      return { ok: false, error: `That’s more than ${settings.rsvp.maxParty} people — please reach out to us and we’ll sort it out together.` }
    }
  }

  if (!isSanityConfigured) {
    console.info('[rsvp:demo] would save', JSON.stringify(d))
    return { ok: true, demo: true }
  }

  // If the couple keeps a guest list, link this reply to it (only used for "who hasn't replied yet").
  const n = norm(d.name)
  const guest = await writeClient
    .fetch<string | null>(`*[_type == "guest" && ($n in searchNames || count(members[lower(@) == $n]) > 0 || lower(household) == $f)][0]._id`, { n, f: norm(d.family) })
    .catch(() => null)

  await writeClient.create({
    _type: 'rsvp',
    ...(guest ? { guest: { _type: 'reference', _ref: guest } } : {}),
    name: d.name,
    household: d.family,
    attending: d.attending,
    adults: d.attending ? d.adults : 0,
    children: d.attending ? d.children : 0,
    plusOnes: d.attending ? d.plusOnes : 0,
    plusOneNames: (d.attending && d.plusOneNames) || undefined,
    guestNames: (d.attending && d.guestNames) || undefined,
    email: d.email || undefined,
    phone: d.phone || undefined,
    dietary: (d.attending && d.dietary) || undefined,
    song: (d.attending && d.song) || undefined,
    message: d.message || undefined,
    submittedAt: new Date().toISOString(),
  })
  return { ok: true }
}
