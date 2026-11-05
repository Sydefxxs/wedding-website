# CLAUDE.md — project rules for AI assistants

This is a custom wedding website: Next.js (App Router, TS) + Tailwind + Sanity CMS + GSAP/Lenis/Framer Motion, hosted on Vercel. Goal: **impress guests** and stay **editable by the couple without code**.

## Always
- Read `DESIGN.md` before touching UI. Use tokens (CSS vars / Tailwind theme), never raw hex or px values.
- Content comes from Sanity. Don't hard-code copy, names, dates, events or images in components — add a schema field instead.
- Images: `next/image` + Sanity image URL builder, with `alt`, `sizes`, hotspot, and LQIP blur. Placeholder slots are listed in `docs/PLACEHOLDER_IMAGES.md`.
- Every animation needs a `prefers-reduced-motion` fallback and must animate only `transform`/`opacity`.
- Mobile first. Most guests open the link from a text message.
- Accessibility: semantic HTML, visible focus, 4.5:1 contrast, keyboard-usable menus/lightbox/forms.
- Secrets live in env vars only. The Sanity write token is server-only.
- Keep `docs/ROADMAP.md` checkboxes up to date when a step is finished.

## Never
- Expose the full guest list to the client.
- Add purple gradients, glassmorphism, gradient text, emoji icons, or three identical centered cards.
- Copy another couple's photos, copy, or whole design.

## Agents & skills
See `docs/AI_WORKFLOW.md`. Agents: `.claude/agents/`. Skills: `.claude/skills/`.

## Commands (after Phase 1)
- `npm run dev` — site + studio
- `npm run build && npm run start` — production check
- `npm run lint` / `npm run typecheck`
