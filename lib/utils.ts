export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const objectPosition = (h?: { x: number; y: number }) =>
  h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : '50% 50%'

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export function googleCalendarUrl(e: { name: string; start: string; end?: string; venue: string; address: string; description: string }, couple: string) {
  const end = e.end ?? new Date(new Date(e.start).getTime() + 2 * 3600_000).toISOString()
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${couple} — ${e.name}`,
    dates: `${icsDate(e.start)}/${icsDate(end)}`,
    location: `${e.venue}, ${e.address}`,
    details: e.description,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

export function icsDataUrl(e: { id: string; name: string; start: string; end?: string; venue: string; address: string; description: string }, couple: string) {
  const end = e.end ?? new Date(new Date(e.start).getTime() + 2 * 3600_000).toISOString()
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding//EN', 'BEGIN:VEVENT',
    `UID:${e.id}@wedding`, `DTSTAMP:${icsDate(e.start)}`, `DTSTART:${icsDate(e.start)}`, `DTEND:${icsDate(end)}`,
    `SUMMARY:${esc(`${couple} — ${e.name}`)}`, `LOCATION:${esc(`${e.venue}, ${e.address}`)}`, `DESCRIPTION:${esc(e.description)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
