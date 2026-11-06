/** Shared by the RSVP form, the server action and the GitHub Pages demo. */

export type RsvpInput = {
  name: string
  family: string
  attending: boolean
  adults: number
  children: number
  plusOnes: number
  plusOneNames?: string
  guestNames?: string
  email?: string
  phone?: string
  dietary?: string
  song?: string
  message?: string
  /** honeypot — real people never fill this in */
  website?: string
}

export type RsvpResult = { ok: true; demo?: boolean } | { ok: false; error: string }

/** "Maria Lopez" → "The Lopez Family" */
export function familyFromName(name: string) {
  const last = name.trim().split(/\s+/).slice(1).pop()
  return last ? `The ${last[0].toUpperCase()}${last.slice(1)} Family` : ''
}

export const partySize = (r: Pick<RsvpInput, 'adults' | 'children' | 'plusOnes'>) => r.adults + r.children + r.plusOnes

/** Fills {family} {name} {count} {date} in the couple's editable messages. */
export function fillRsvpCopy(text: string, v: { family: string; name: string; count: number; date: string }) {
  const seats = v.count === 1 ? 'a seat' : `${v.count} seats`
  return text
    .replaceAll('{family}', v.family)
    .replaceAll('{name}', v.name.split(' ')[0] ?? v.name)
    .replaceAll('{count}', seats)
    .replaceAll('{date}', v.date)
}
