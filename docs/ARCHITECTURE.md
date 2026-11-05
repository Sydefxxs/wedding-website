# Architecture

## Folder structure (target)

```
wedding-website/
├── app/
│   ├── (site)/                 # Public site
│   │   ├── layout.tsx          # Nav, footer, Lenis, page transitions
│   │   ├── page.tsx            # Home
│   │   ├── [slug]/page.tsx     # Any CMS page (story, schedule, travel, faq…)
│   │   └── rsvp/page.tsx       # RSVP flow
│   ├── studio/[[...tool]]/     # Embedded Sanity Studio (editor)
│   └── api/revalidate/route.ts # Sanity webhook → instant updates
├── components/
│   ├── sections/               # Hero, Story, Schedule, Travel, Gallery, FAQ… (one per CMS section type)
│   ├── motion/                 # Reveal, Parallax, PinnedTimeline, PageTransition
│   └── ui/                     # Button, Input, Card, Accordion, Countdown
├── sanity/
│   ├── schemaTypes/            # Content models (see below)
│   ├── lib/                    # client, queries (GROQ), image builder
│   └── structure.ts            # Studio sidebar layout
├── lib/                        # ics calendar, utils
├── public/placeholders/        # Temp images (see PLACEHOLDER_IMAGES.md)
├── styles/tokens.css           # DESIGN.md → CSS variables
├── DESIGN.md
└── .claude/                    # Agents & skills
```

## Content model (Sanity)

| Type | Fields (main) |
|---|---|
| `siteSettings` (singleton) | names, date, location, monogram, nav links, RSVP deadline, OG image, password on/off |
| `page` | title, slug, SEO, `sections[]` (page builder) |
| Section blocks | `hero`, `intro`, `storyTimeline`, `eventList`, `travelInfo`, `hotelList`, `peopleGrid`, `gallery`, `registryLinks`, `faqList`, `ctaBanner`, `richText` |
| `event` | name, start/end, venue, address, map URL, attire, description, invite-only flag |
| `storyMoment` | date, title, text, image |
| `hotel` | name, distance, price, booking link, code, deadline, image |
| `person` | name, role, side, photo, note |
| `faq` | question, answer, order |
| `galleryImage` | image, caption, orientation |
| `registry` | name, URL, logo |
| `guest` | full name, household, invited events[], plus-one allowed |
| `rsvp` | guest ref, per-event attending, meal, dietary, song, message, submittedAt |

Because pages are a **section builder**, we can add, remove and reorder sections on any page from Studio without code.

## RSVP flow
1. Guest types their name → server action searches `guest` (fuzzy, min 3 chars, rate-limited). Never exposes the full list.
2. Shows their household and only events they're invited to.
3. Submit → server action validates (zod) and writes an `rsvp` doc with a server-only Sanity write token.
4. Confirmation screen + "add to calendar"; optional confirmation email (Resend).
5. We view/export RSVPs in Studio (custom list view + CSV export).

## Performance & privacy budget
- Lighthouse mobile ≥ 90; LCP < 2.5s; CLS < 0.1
- Hero image priority-loaded, AVIF/WebP via Sanity CDN, blur placeholders (LQIP)
- Animations GPU-only (transform/opacity); GSAP loaded only on pages that use it
- Optional site password via middleware; `noindex` until we decide
- Secrets only in Vercel env vars, never committed

## Environment variables
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=      # server-only, RSVP writes
SANITY_REVALIDATE_SECRET=
SITE_PASSWORD=               # optional
```
