# Our Wedding Website 💍

A custom, editable, cinematic wedding website. Not a template — built to impress guests and to be easy for us to update ourselves.

> **Status:** Phase 0 — planning & documentation. Photos are **temporary placeholders** until we swap in our own (see [`docs/PLACEHOLDER_IMAGES.md`](docs/PLACEHOLDER_IMAGES.md)).

## What guests get

| Page | Purpose |
|---|---|
| **Home** | Full-screen hero photo/video, our names, date, countdown, RSVP button |
| **Our Story** | Scroll-driven timeline of how we met, with photos that animate in |
| **Schedule** | Every event (welcome party, ceremony, reception, brunch) with time, place, attire, map |
| **Travel & Stay** | Airports, drive times, hotel blocks with booking links, local tips |
| **Wedding Party** | Photos + short notes about the people standing with us |
| **Gallery** | Engagement photos in an immersive, swipeable layout |
| **Registry** | Links to our registries / honeymoon fund |
| **FAQ** | Kids, parking, dress code, plus-ones, weather — answered before they ask |
| **RSVP** | Guests find their name, RSVP per event, meal choice, dietary notes, song request |

## Why it's not static

Every page, photo, event, hotel, FAQ and guest lives in **Sanity CMS**. We edit from a visual dashboard at `/studio` (on phone or laptop) and the site updates instantly — no code, no redeploy.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Fast, SEO-friendly, server actions for RSVP |
| Styling | **Tailwind CSS** with design tokens from [`DESIGN.md`](DESIGN.md) | Consistent look, no random values |
| Content | **Sanity CMS** (embedded Studio + live Visual Editing) | Click-to-edit any text or photo |
| Motion | **GSAP + ScrollTrigger**, **Lenis** smooth scroll, **Framer Motion** page transitions | The "wow" — cinematic, but respects reduced-motion |
| Images | `next/image` + Sanity image CDN | Auto-resized, blurred placeholders, fast on phones |
| RSVP | Server action → Sanity `guest` / `rsvp` documents | Responses viewable/exportable in Studio |
| Hosting | **Vercel** (free tier) + custom domain | Preview link for every change |

Full details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Docs

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the build, broken into phases and steps (with checkboxes)
- [`DESIGN.md`](DESIGN.md) — colors, type, spacing, motion rules
- [`docs/INSPIRATION.md`](docs/INSPIRATION.md) — research on the best wedding sites and what we're borrowing
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — folder structure, CMS schemas, RSVP flow
- [`docs/PLACEHOLDER_IMAGES.md`](docs/PLACEHOLDER_IMAGES.md) — every image slot, its size, and how to swap it
- [`docs/CONTENT_EDITING.md`](docs/CONTENT_EDITING.md) — how we edit the site ourselves
- [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) — the Claude agents & skills in `.claude/` and when to use each

## Running locally (once Phase 1 is done)

```bash
npm install
cp .env.example .env.local   # add Sanity project ID + tokens
npm run dev                  # site at http://localhost:3000, editor at /studio
```
