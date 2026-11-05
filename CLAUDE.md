# CLAUDE.md — project rules for AI assistants

Wedding website for **Arath & Ruby Garza — April 24, 2027**. Next.js 16 (App Router, Cache Components, TS) + Tailwind 4 + Sanity + GSAP/ScrollTrigger + Lenis, hosted on Vercel. Goal: **impress guests** and stay **editable by the couple without code**.

**Read `AGENTS.md` first** — this Next.js version has breaking changes; check `node_modules/next/dist/docs/` before using an API you're unsure of.

## How content flows
- `lib/content.ts` → `getContent()` (cached, tag `content`) reads Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, otherwise the starter content in `content/placeholder.ts`. Missing Sanity fields fall back to the starter values.
- Real photos: `public/photos/` + `content/photos.json` (add with `npm run add-photo`). Temporary stand-ins: `public/placeholders/` (flagged `placeholder: true`).
- Sanity webhook → `app/api/revalidate` → `revalidateTag('content', 'max')`.
- Two deploy targets: **GitHub Pages preview** (static export via `scripts/build-pages.sh`, run by `.github/workflows/pages.yml` on push — strips `app/api`, `app/studio`, swaps in `preview/rsvp-actions.demo.ts` and the PNGs in `preview/`) and the **full site on Vercel**. Any new server-only route or action must be handled in `build-pages.sh`, and local image paths must go through `Photo` (it adds the basePath).

## Always
- Read `DESIGN.md` before touching UI. Use tokens (CSS vars / Tailwind theme), never raw hex or px values.
- Don't hard-code copy, names, dates, events or images in components — add a field (type in `lib/types.ts`, schema in `sanity/schemaTypes`, mapping in `lib/content.ts`, starter value in `content/placeholder.ts`, seed in `scripts/seed-sanity.ts`).
- Images go through `components/ui/Photo.tsx` (`next/image`, `alt`, `sizes`, hotspot → object-position, blur-up).
- Photos of the couple: strip location data (`npm run add-photo` does it) and keep the photographer's watermark/credit (Roy Esparza Photography).
- Every animation needs a `prefers-reduced-motion` fallback and must animate only `transform`/`opacity`/`clip-path`.
- Mobile first. Most guests open the link from a text message.
- Accessibility: semantic HTML, visible focus, 4.5:1 contrast, keyboard-usable menus/lightbox/forms.
- Secrets live in env vars only. The Sanity write token is server-only (`sanity/lib/write-client.ts`).
- Keep `docs/ROADMAP.md` checkboxes up to date when a step is finished.

## Never
- Expose the guest list to the client (lookups run in `app/(site)/rsvp/actions.ts`).
- Invent facts: unknown details stay in `[brackets]`.
- Add purple gradients, glassmorphism, gradient text, emoji icons, or three identical centered cards.
- Copy another couple's photos, copy, or whole design.

## Agents & skills
See `docs/AI_WORKFLOW.md`. Agents: `.claude/agents/`. Skills: `.claude/skills/`.

## Commands
- `npm run dev` — site + studio (`/studio`)
- `npm run build && npm run start` — production check
- `npm run lint` / `npm run typecheck`
- `npm run add-photo -- <file> <name> [focusX focusY]`
- `npm run seed` / `npm run import-guests -- <csv> [--commit]` (see `docs/SETUP.md`)
