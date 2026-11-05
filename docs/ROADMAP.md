# Roadmap

Each phase ends with something we can open and react to. Tick boxes as we go.
Agents/skills referenced live in `.claude/` — see [`AI_WORKFLOW.md`](AI_WORKFLOW.md).

---

## Phase 0 — Plan & document ✅ *(this commit)*
- [x] Research top wedding websites → `docs/INSPIRATION.md`
- [x] Pick stack (Next.js + Sanity + GSAP) → `docs/ARCHITECTURE.md`
- [x] Draft design direction → `DESIGN.md`
- [x] Placeholder image plan → `docs/PLACEHOLDER_IMAGES.md`
- [x] Project agents & skills → `.claude/`
- [ ] **We fill in:** names, date, city/venue(s), colors or vibe we love, 3 sites we like *(see "Info we need" below)*

## Phase 1 — Foundation
*Agent: `frontend-builder` · Skill: `wedding-section`*
- [ ] Scaffold Next.js + TypeScript + Tailwind, ESLint/Prettier
- [ ] Put `DESIGN.md` tokens into Tailwind theme + CSS variables
- [ ] Load fonts with `next/font`
- [ ] Base layout: sticky nav (with RSVP button), footer, page shell
- [ ] Lenis smooth scroll + reduced-motion fallback
- [ ] Deploy to Vercel → first preview link
- **Done when:** a live link shows an empty but styled shell on phone + desktop

## Phase 2 — CMS (make it editable)
*Agent: `cms-architect` · Skill: `add-cms-content-type`*
- [ ] Create Sanity project, embed Studio at `/studio`
- [ ] Schemas: `siteSettings`, `page` (with section builder), `event`, `storyMoment`, `hotel`, `faq`, `person`, `galleryImage`, `registry`, `guest`, `rsvp`
- [ ] Seed with placeholder content + placeholder images
- [ ] Turn on Visual Editing / Presentation (click any text on the site → edit it)
- [ ] Webhook / on-demand revalidation so edits go live instantly
- **Done when:** we change the hero headline in Studio and see it on the site in seconds

## Phase 3 — Pages
*Agents: `frontend-builder`, `content-writer` · Skills: `wedding-section`, `wedding-copy`*
- [ ] Home — hero, names, date, countdown, intro, CTA
- [ ] Our Story — timeline
- [ ] Schedule — event cards with map links, attire, add-to-calendar (.ics)
- [ ] Travel & Stay — hotels, airports, things to do, embedded map
- [ ] Wedding Party
- [ ] Gallery
- [ ] Registry
- [ ] FAQ (accordion)
- **Done when:** every page has real structure + placeholder copy we can edit

## Phase 4 — The "wow" (motion & visuals)
*Agent: `motion-designer` · Skill: `motion-pattern`*
- [ ] Hero: slow Ken-Burns photo or muted video loop, names reveal letter-by-letter
- [ ] Animated page transitions (fade/curtain)
- [ ] Our Story: pinned scroll timeline, photos parallax in
- [ ] Gallery: horizontal-scroll strip on desktop, swipe on mobile, lightbox
- [ ] Monogram / signature SVG draw-on animation
- [ ] Micro-interactions: buttons, nav underline, countdown flip
- [ ] Every animation has a `prefers-reduced-motion` version
- **Done when:** it feels cinematic on a mid-range phone at 60fps

## Phase 5 — RSVP
*Agent: `cms-architect` · Skill: `add-cms-content-type`*
- [ ] Guest list import (CSV → Sanity `guest` docs, households/parties)
- [ ] Guest lookup by name (no public list exposed)
- [ ] Per-event attendance, meal choice, dietary notes, song request, message
- [ ] Confirmation screen + optional email confirmation
- [ ] RSVP deadline + "edit my RSVP" link
- [ ] Studio view to see/export responses
- **Done when:** a test guest can RSVP and we see it in Studio

## Phase 6 — Polish, privacy & launch
*Agent: `qa-reviewer` · Skill: `launch-checklist`*
- [ ] Swap placeholder photos for ours (`swap-placeholder-image`)
- [ ] Optional site password / `noindex` for privacy
- [ ] Accessibility pass (contrast, keyboard, alt text, focus)
- [ ] Performance: Lighthouse 90+ mobile, images AVIF/WebP, LCP < 2.5s
- [ ] Share preview: Open Graph image with our names & date
- [ ] Custom domain (e.g. `firstandsecond.com`)
- [ ] Final proofread by both of us
- **Done when:** we send the link to family 🎉

---

## Info we need from us
- Our names (as we want them shown) and wedding date
- Venue(s) + city, and events beyond the ceremony/reception
- A vibe or colors (or 3 websites / Pinterest boards we love)
- Hotel blocks, registry links (can come later)
- Domain name idea
