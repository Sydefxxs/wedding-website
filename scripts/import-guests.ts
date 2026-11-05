/**
 * Import the guest list from a CSV into Sanity (one row = one invitation/household).
 * Template: docs/guest-list-template.csv
 *
 *   npm run import-guests -- guests.csv            # preview only (nothing is written)
 *   npm run import-guests -- guests.csv --commit   # write to Sanity
 *
 * Columns: household, members, events
 *   members: names separated by ";"  e.g.  Ana Lopez; Luis Lopez
 *   events:  event IDs separated by ";" (welcome; ceremony; reception; brunch) — empty = invited to everything
 */
import { createClient } from 'next-sanity'
import { readFile } from 'node:fs/promises'

const [file, ...flags] = process.argv.slice(2)
const COMMIT = flags.includes('--commit')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN
if (!file) {
  console.error('Usage: npm run import-guests -- <guests.csv> [--commit]')
  process.exit(1)
}

const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, ' ').toLowerCase()
const slug = (s: string) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

/** Minimal CSV parser (handles quoted fields with commas). */
function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = [], cell = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some((x) => x.trim())) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell)
  if (row.some((x) => x.trim())) rows.push(row)
  return rows
}

async function main() {
  const [header, ...lines] = parseCsv(await readFile(file, 'utf8'))
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name)
  const [hi, mi, ei] = [col('household'), col('members'), col('events')]
  if (hi < 0 || mi < 0) throw new Error('CSV needs at least "household" and "members" columns')

  const client = projectId ? createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-10-01', token, useCdn: false }) : null
  const eventIds: string[] = client ? await client.fetch(`*[_type == "event"]._id`) : []

  const seen = new Map<string, string>()
  const docs = lines.map((cells, n) => {
    const household = cells[hi]?.trim()
    const members = (cells[mi] ?? '').split(';').map((m) => m.trim()).filter(Boolean)
    const wanted = ei >= 0 ? (cells[ei] ?? '').split(';').map((e) => e.trim()).filter(Boolean) : []
    if (!household || !members.length) throw new Error(`Row ${n + 2}: household and at least one member are required`)
    for (const m of members) {
      const k = norm(m)
      if (seen.has(k)) console.warn(`⚠ "${m}" appears on two invitations (${seen.get(k)} and ${household}) — guests could see the wrong one`)
      seen.set(k, household)
    }
    const refs = (wanted.length ? wanted.map((w) => (w.startsWith('event-') ? w : `event-${w}`)) : eventIds).filter((id) => {
      if (eventIds.length && !eventIds.includes(id)) {
        console.warn(`⚠ Row ${n + 2}: unknown event "${id}" — skipped`)
        return false
      }
      return true
    })
    return {
      _id: `guest-${slug(household)}`,
      _type: 'guest',
      household,
      members,
      searchNames: members.map(norm),
      events: refs.map((id, i) => ({ _key: `e${i}`, _type: 'reference', _ref: id })),
    }
  })

  console.log(`${docs.length} invitations, ${docs.reduce((a, d) => a + d.members.length, 0)} guests`)
  docs.slice(0, 5).forEach((d) => console.log(` • ${d.household}: ${d.members.join(', ')} → ${d.events.length} events`))
  if (docs.length > 5) console.log(` • …and ${docs.length - 5} more`)

  if (!COMMIT) return console.log('\nPreview only. Re-run with --commit to write to Sanity.')
  if (!client || !token) throw new Error('Missing Sanity project ID / write token in .env.local')
  const tx = client.transaction()
  docs.forEach((d) => tx.createOrReplace(d))
  await tx.commit()
  console.log('✓ Guest list imported.')
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
