/**
 * Copies all starter content + our photos into Sanity, so the Studio opens fully filled in.
 * Safe to re-run: documents use fixed IDs and are replaced, not duplicated.
 *
 *   npm run seed                    # content + photos
 *   npm run seed -- --demo-guest    # also adds a "Test Guest" invitation for trying the RSVP
 *   npm run seed -- --dry-run       # show what would be written
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local (see docs/SETUP.md).
 */
import { createClient } from 'next-sanity'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { placeholderContent as C } from '../content/placeholder'
import type { Img } from '../lib/types'

const args = new Set(process.argv.slice(2))
const DRY = args.has('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || (!token && !DRY)) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local — see docs/SETUP.md')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2026-10-01', token, useCdn: false })
const uploaded = new Map<string, string>()
let uploads = 0

async function assetId(img: Img) {
  const hit = uploaded.get(img.src)
  if (hit) return hit
  if (DRY) {
    uploaded.set(img.src, `dry-${uploads++}`)
    return uploaded.get(img.src)!
  }
  const buf = await readFile(path.join(process.cwd(), 'public', img.src))
  const asset = await client.assets.upload('image', buf, { filename: path.basename(img.src) })
  uploads++
  uploaded.set(img.src, asset._id)
  process.stdout.write('.')
  return asset._id
}

async function photo(img?: Img) {
  if (!img) return undefined
  return {
    _type: 'photo',
    asset: { _type: 'reference', _ref: await assetId(img) },
    alt: img.alt,
    placeholder: Boolean(img.placeholder),
    ...(img.hotspot
      ? {
          hotspot: { _type: 'sanity.imageHotspot', x: img.hotspot.x, y: img.hotspot.y, width: 0.5, height: 0.5 },
          crop: { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 },
        }
      : {}),
  }
}

const key = (i: number) => `k${i}`

async function main() {
  const s = C.settings
  const docs: Record<string, unknown>[] = []

  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    partnerOne: s.partnerOne,
    partnerTwo: s.partnerTwo,
    lastName: s.lastName,
    date: s.date,
    dateLabel: s.dateLabel,
    location: s.location,
    tagline: s.tagline,
    rsvpDeadline: s.rsvpDeadline,
    rsvpDeadlineLabel: s.rsvpDeadlineLabel,
    rsvpHeading: s.rsvp.heading,
    rsvpIntro: s.rsvp.intro,
    rsvpYesHeading: s.rsvp.yesHeading,
    rsvpYesMessage: s.rsvp.yesMessage,
    rsvpNoHeading: s.rsvp.noHeading,
    rsvpNoMessage: s.rsvp.noMessage,
    rsvpMaxParty: s.rsvp.maxParty,
    rsvpPlusOnes: s.rsvp.plusOnes,
    hashtag: s.hashtag,
    contactEmail: s.contactEmail,
    heroImage: await photo(s.heroImage),
    shareImage: await photo(s.shareImage),
    photoCredit: s.photoCredit,
    introEyebrow: s.intro.eyebrow,
    introHeading: s.intro.heading,
    introBody: s.intro.body,
    introImage: await photo(s.intro.image),
    registryHeading: C.registry.heading,
    registryBody: C.registry.body,
    registryImage: await photo(C.registry.image),
    nav: s.nav.map((n, i) => ({ _key: key(i), _type: 'navLink', ...n })),
    footerNote: s.footerNote,
    guestUploadsOpen: true,
    moderateGuestPhotos: false,
  })

  for (const e of C.events) {
    docs.push({
      _id: `event-${e.id}`, _type: 'event', name: e.name, start: e.start, end: e.end, dayLabel: e.dayLabel, timeLabel: e.timeLabel,
      venue: e.venue, address: e.address, mapUrl: e.mapUrl, attire: e.attire, description: e.description, image: await photo(e.image),
    })
  }
  for (const [i, m] of C.story.entries()) {
    docs.push({ _id: `story-${m.id}`, _type: 'storyMoment', dateLabel: m.dateLabel, title: m.title, body: m.body, image: await photo(m.image), order: (i + 1) * 10 })
  }
  for (const [i, p] of C.people.entries()) {
    docs.push({ _id: `person-${p.id}`, _type: 'person', name: p.name, role: p.role, note: p.note, group: p.group, image: await photo(p.image), order: (i + 1) * 10 })
  }
  for (const [i, f] of C.faqs.entries()) {
    docs.push({ _id: `faq-${f.id}`, _type: 'faq', question: f.question, answer: f.answer, order: (i + 1) * 10 })
  }
  for (const [i, r] of C.registry.links.entries()) {
    docs.push({ _id: `registry-${r.id}`, _type: 'registryLink', name: r.name, url: r.url, note: r.note, order: (i + 1) * 10 })
  }
  for (const [i, g] of C.gallery.entries()) {
    docs.push({ _id: `gallery-${g.id}`, _type: 'galleryImage', caption: g.caption, image: await photo(g), order: (i + 1) * 10 })
  }
  for (const pg of C.pages) {
    const sections = []
    for (const [i, sec] of pg.sections.entries()) {
      sections.push(sec._type === 'imageText' ? { ...sec, _key: key(i), image: await photo(sec.image) } : { ...sec, _key: key(i) })
    }
    docs.push({ _id: `page-${pg.slug}`, _type: 'page', title: pg.title, eyebrow: pg.eyebrow, slug: { _type: 'slug', current: pg.slug }, sections })
  }
  if (args.has('--demo-guest')) {
    docs.push({
      _id: 'guest-demo', _type: 'guest', household: 'Test Guest', members: ['Test Guest'], searchNames: ['test guest'],
      events: C.events.map((e, i) => ({ _key: key(i), _type: 'reference', _ref: `event-${e.id}` })),
    })
  }

  const counts = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type as string] = (acc[d._type as string] ?? 0) + 1), acc), {})
  console.log(`\n${DRY ? '[dry run] would write' : 'Writing'} ${docs.length} documents:`, counts, `| ${uploads} images`)
  if (DRY) return

  const tx = client.transaction()
  docs.forEach((d) => tx.createOrReplace(d as { _id: string; _type: string }))
  await tx.commit()
  console.log(`✓ Seeded ${dataset}. Open /studio to see everything.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
