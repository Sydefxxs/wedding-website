# Arath & Ruby Garza — Wedding Website 💍

**April 24, 2027.** A custom, cinematic, fully editable wedding site — built to impress our guests and easy for us to update ourselves.

> **Status:** Phases 0–4 built. Runs today on starter content + our engagement photos. Venue, hotel and wedding-party photos are still soft-blur placeholders.
>
> **Live preview:** https://sydefxxs.github.io/wedding-website/ — rebuilt automatically on every push to `main`. It's a static preview: RSVP runs in demo mode (try “Test Guest”, nothing is saved) and the editor isn't included. The full site (saved RSVPs, `/studio`, custom domain) deploys to Vercel — see [`docs/SETUP.md`](docs/SETUP.md).

## What guests get

| Page | What's there |
|---|---|
| **Home** | Our photo + names, live countdown, the weekend at a glance, story collage, a gallery strip that glides sideways as you scroll, travel teaser |
| **Our Story** | Timeline where a thread draws down the page, photos drift in parallax |
| **Schedule** | Every event with time, place, attire, directions, and add-to-calendar (Google / Apple / Outlook) |
| **Travel & Stay** | Airports, hotel blocks with codes and booking links, local tips |
| **Wedding Party** | Portrait grid |
| **Gallery** | Masonry grid + full-screen viewer (swipe, arrow keys, Esc) |
| **Registry** | Links to our registries / honeymoon fund |
| **FAQ** | Animated accordion |
| **RSVP** | Guests find their invitation by name, answer per person per event, dietary needs, song request, note |
| **Custom pages** | Make new pages (e.g. "Things to Do") from the editor, no code |

Plus: page-transition curtain, letter-by-letter title reveals, smooth scrolling, a link-preview card with our save-the-date photo, favicon from our initials — and every animation has a calm version for people who turn motion off.

## Editing (no code)
All words, photos, events, hotels, FAQ, people and guests live in **Sanity**. Open `/studio`, edit, hit Publish — the site updates in seconds. See [`docs/CONTENT_EDITING.md`](docs/CONTENT_EDITING.md).

## Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + TypeScript |
| Styling | Tailwind CSS 4 with tokens from [`DESIGN.md`](DESIGN.md) |
| Content | Sanity (embedded Studio at `/studio`) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll, CSS reveals |
| Images | `next/image` (AVIF/WebP, blur-up, focal points) |
| RSVP | Server actions → Sanity (guest list never reaches the browser) |
| Hosting | Vercel |

## Commands
```bash
npm run dev            # site at :3000, editor at /studio
npm run build          # production build
npm run lint && npm run typecheck
npm run add-photo -- <file.jpg> <name> [focusX focusY]   # add one of our photos (strips GPS)
bash scripts/build-pages.sh   # static GitHub Pages preview → ./out (CI does this on push)
npm run seed           # copy content + photos into Sanity
npm run import-guests -- guests.csv [--commit]
```

## Docs
- [`docs/SETUP.md`](docs/SETUP.md) — connect Sanity, import guests, deploy, domain
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phases and what's left
- [`DESIGN.md`](DESIGN.md) — colors, type, spacing, motion rules
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — structure, content model, RSVP flow
- [`docs/PLACEHOLDER_IMAGES.md`](docs/PLACEHOLDER_IMAGES.md) — every image slot and how to swap it
- [`docs/CONTENT_EDITING.md`](docs/CONTENT_EDITING.md) — editing the site ourselves
- [`docs/INSPIRATION.md`](docs/INSPIRATION.md) — research on the best wedding sites
- [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) — the Claude agents & skills in `.claude/`

Engagement photos by **Roy Esparza Photography**.
