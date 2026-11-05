'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { isSanityConfigured } from '@/sanity/env'
import { writeClient } from '@/sanity/lib/write-client'
import { placeholderContent, placeholderGuests } from '@/content/placeholder'

export type Invitation = {
  id: string
  household: string
  members: string[]
  events: { id: string; name: string; dayLabel: string; timeLabel: string }[]
}

type FindResult = { ok: true; invitation: Invitation } | { ok: false; error: string }

const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase()

// Basic in-memory rate limit (per server instance) to stop guest-list guessing.
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
  return rec.n > 25
}

export async function findInvitation(rawName: string): Promise<FindResult> {
  const name = norm(rawName ?? '')
  if (name.length < 3 || !name.includes(' ')) return { ok: false, error: 'Please enter your first and last name, as written on your invitation.' }
  if (await limited()) return { ok: false, error: 'Too many tries — please wait a few minutes, or text us and we’ll help.' }

  if (!isSanityConfigured) {
    const g = placeholderGuests.find((g) => g.members.some((m) => norm(m) === name))
    if (!g) return { ok: false, error: 'We couldn’t find that name. Try it exactly as it’s written on your invitation — or text us. (Demo: try “Test Guest”.)' }
    const events = placeholderContent.events.filter((e) => g.events.includes(e.id)).map(({ id, name, dayLabel, timeLabel }) => ({ id, name, dayLabel, timeLabel }))
    return { ok: true, invitation: { id: g.id, household: g.household, members: g.members, events } }
  }

  const g = await writeClient.fetch<Invitation | null>(
    // searchNames (set by the CSV import) matches names typed without accents; members covers guests added by hand
    `*[_type == "guest" && ($name in searchNames || count(members[lower(@) == $name]) > 0)][0]{
      "id": _id, household, members,
      "events": events[]->{ "id": _id, name, dayLabel, timeLabel } | order(start asc)
    }`,
    { name },
  )
  if (!g) return { ok: false, error: 'We couldn’t find that name. Try it exactly as it’s written on your invitation — or text us.' }
  return { ok: true, invitation: { ...g, events: g.events ?? [] } }
}

const Rsvp = z.object({
  invitationId: z.string().min(1),
  household: z.string().min(1),
  responses: z.array(z.object({ member: z.string().min(1).max(120), eventId: z.string().min(1), eventName: z.string().max(120), attending: z.boolean() })).min(1).max(200),
  email: z.union([z.literal(''), z.email()]).optional(),
  dietary: z.string().max(1000).optional(),
  song: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
})

export type RsvpInput = z.infer<typeof Rsvp>

export async function submitRsvp(input: RsvpInput): Promise<{ ok: true; demo?: boolean } | { ok: false; error: string }> {
  const parsed = Rsvp.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Something looks off in the form — please check it and try again.' }
  if (await limited()) return { ok: false, error: 'Too many tries — please wait a few minutes.' }
  const d = parsed.data

  if (new Date() > new Date(placeholderContent.settings.rsvpDeadline) && !isSanityConfigured) {
    return { ok: false, error: 'RSVPs have closed — please text us directly.' }
  }

  if (!isSanityConfigured) {
    console.info('[rsvp:demo] would save', JSON.stringify(d))
    return { ok: true, demo: true }
  }

  // Verify the invitation exists and the events submitted are ones this household is invited to.
  const g = await writeClient.fetch<{ events: string[] } | null>(`*[_type == "guest" && _id == $id][0]{ "events": events[]._ref }`, { id: d.invitationId })
  if (!g || d.responses.some((r) => !g.events?.includes(r.eventId))) return { ok: false, error: 'We couldn’t match this RSVP to your invitation. Please search your name again.' }

  await writeClient.create({
    _type: 'rsvp',
    guest: { _type: 'reference', _ref: d.invitationId },
    household: d.household,
    responses: d.responses.map((r, i) => ({ _key: `r${i}`, ...r })),
    email: d.email || undefined,
    dietary: d.dietary || undefined,
    song: d.song || undefined,
    message: d.message || undefined,
    submittedAt: new Date().toISOString(),
  })
  return { ok: true }
}
