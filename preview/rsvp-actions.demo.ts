/**
 * Browser-only RSVP used by the GitHub Pages preview (static hosting has no server).
 * scripts/build-pages.sh swaps this in for app/(site)/rsvp/actions.ts. Nothing is saved.
 * Same exports as the real server action, so RsvpForm works unchanged.
 */
import type { RsvpInput, RsvpResult } from '@/lib/rsvp'

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  await pause(700)
  if (!input?.name?.trim()) return { ok: false, error: 'Please tell us your name.' }
  return { ok: true, demo: true }
}
