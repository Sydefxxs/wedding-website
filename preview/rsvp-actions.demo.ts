/**
 * Browser-only RSVP used by the GitHub Pages preview (static hosting has no server).
 * scripts/build-pages.sh swaps this in for app/(site)/rsvp/actions.ts. Nothing is saved.
 * Same exports/shape as the real server actions, so RsvpForm works unchanged.
 */
import { placeholderContent, placeholderGuests } from '@/content/placeholder'

export type Invitation = {
  id: string
  household: string
  members: string[]
  events: { id: string; name: string; dayLabel: string; timeLabel: string }[]
}

export type RsvpInput = {
  invitationId: string
  household: string
  responses: { member: string; eventId: string; eventName: string; attending: boolean }[]
  email?: string
  dietary?: string
  song?: string
  message?: string
}

const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase()
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function findInvitation(rawName: string): Promise<{ ok: true; invitation: Invitation } | { ok: false; error: string }> {
  await pause(450)
  const name = norm(rawName ?? '')
  if (name.length < 3 || !name.includes(' ')) return { ok: false, error: 'Please enter your first and last name, as written on your invitation.' }
  const g = placeholderGuests.find((g) => g.members.some((m) => norm(m) === name))
  if (!g) return { ok: false, error: 'We couldn’t find that name. (Preview: try “Test Guest”.)' }
  const events = placeholderContent.events
    .filter((e) => g.events.includes(e.id))
    .map(({ id, name, dayLabel, timeLabel }) => ({ id, name, dayLabel, timeLabel }))
  return { ok: true, invitation: { id: g.id, household: g.household, members: g.members, events } }
}

export async function submitRsvp(input: RsvpInput): Promise<{ ok: true; demo?: boolean } | { ok: false; error: string }> {
  await pause(700)
  if (!input?.responses?.length) return { ok: false, error: 'Please choose yes or no for everyone, for each event.' }
  return { ok: true, demo: true }
}
