# Roadmap — Arath & Ruby · April 24, 2027

Each phase ends with something we can open and react to. Agents/skills referenced live in `.claude/` — see [`AI_WORKFLOW.md`](AI_WORKFLOW.md).

---

## Phase 0 — Plan & document ✅
- [x] Research top wedding websites → `docs/INSPIRATION.md`
- [x] Stack: Next.js + Sanity + GSAP → `docs/ARCHITECTURE.md`
- [x] Design direction → `DESIGN.md`
- [x] Image slot plan → `docs/PLACEHOLDER_IMAGES.md`
- [x] Project agents & skills → `.claude/`
- [x] Names (Arath & Ruby Garza) and date (April 24, 2027)

## Phase 1 — Foundation ✅
- [x] Next.js 16 + TypeScript + Tailwind 4 + ESLint
- [x] `DESIGN.md` tokens → CSS variables + Tailwind theme
- [x] Self-hosted fonts (Cormorant Garamond + Jost)
- [x] Layout: menu that turns solid on scroll (RSVP always visible), full-screen phone menu, footer
- [x] Lenis smooth scroll + reduced-motion fallback
- [x] Live preview on GitHub Pages → https://sydefxxs.github.io/wedding-website/ (auto-deploys on push)
- [x] Full site on Vercel (saved RSVPs, editor) — project `wedding-website`
- [ ] Custom domain

## Phase 2 — CMS (make it editable) 🟡
- [x] Embedded Studio at `/studio`, sidebar organized for us
- [x] Schemas: site settings, events, story, hotels, wedding party, FAQ, registry, gallery, custom pages, guests, RSVPs
- [x] "Still placeholder" list in the Studio
- [x] Webhook route for instant updates
- [x] `npm run seed` — loads all content + photos into Sanity
- [x] One-click GitHub Action "Load content into Sanity" (keys stay in GitHub secrets)
- [x] Studio **RSVPs** tab: counts per event, who hasn't replied, CSV download
- [x] Sanity project created (ID `8wf6040b`, dataset `production`), keys stored, content seeded
- [ ] Click-to-edit Visual Editing (Presentation tool)

## Phase 3 — Pages ✅
- [x] Home — hero, countdown, intro, the weekend, story collage, gallery strip, travel teaser
- [x] Our Story — timeline
- [x] Schedule — event cards, directions, add-to-calendar (Google / .ics)
- [x] Venue card with directions (travel & hotels removed — most guests are local)
- [x] Wedding Party · Gallery (+ viewer) · Registry · FAQ
- [x] Custom pages (example: `/things-to-do`)
- [x] Link-preview card with our save-the-date photo; favicon from our initials

## Phase 4 — The "wow" ✅
- [x] Hero: names reveal letter by letter, slow photo zoom; vertical photos get a tall side panel on desktop
- [x] Page transition curtain
- [x] Our Story: thread draws down the page, photos in parallax
- [x] Gallery strip pins and glides sideways (swipe row on phones)
- [x] Photo curtain reveals, monogram ring draw, live countdown
- [x] Reduced-motion versions of everything

## Phase 5 — RSVP 🟡
- [x] Guest finds invitation by full name (no list exposed, rate-limited)
- [x] Per-person, per-event answers, dietary needs, song request, note
- [x] Confirmation screen; validation; works in demo mode now
- [x] Guest list CSV import (`npm run import-guests`, preview first)
- [ ] Turn on saving to Sanity (happens automatically once Phase 2 is connected)
- [ ] Optional: confirmation email (Resend) · "edit my RSVP" link · CSV export of responses

## Phase 5b — Guest photo sharing 🟡
- [x] `/photos`: guests upload from their phones (shrunk in the browser), shared grid, viewer, download one or all (zip)
- [x] Editor controls: hide photos, approve-before-showing, optional upload code for table cards, open/close uploads
- [ ] Saving uploads (needs Sanity + Vercel — `docs/SETUP.md`)
- [ ] Print table cards with a QR code to `/photos` (+ the upload code if we use one)

## Phase 6 — Polish, privacy & launch
- [x] City, venue, times, dress code, kids, parking, RSVP deadline, contact email
- [ ] Remaining `[brackets]`: story, wedding party, registry
- [ ] Remaining photos: venue, wedding party (`swap-placeholder-image` skill)
- [ ] Ask Roy Esparza for web-size files (and OK to post with credit)
- [ ] Optional site password
- [ ] Accessibility + Lighthouse pass (`qa-reviewer` agent, `launch-checklist` skill)
- [ ] Custom domain
- [ ] Final proofread by both of us → send the link 🎉

---

## Still needed from us
- Photos of our parents (Mayra & Jose Garza, Linda & Felipe Morales)
- Padrinos: names, which padrinos they are, photos
- Our Story: the text and dates for each moment
- Registry: real Amazon link, honeymoon destination + fund link

