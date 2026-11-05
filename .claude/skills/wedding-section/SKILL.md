---
name: wedding-section
description: Build or change a section of the wedding site (hero, story, schedule, travel, gallery, FAQ, etc.) end to end — Sanity schema, GROQ query, React component, motion and placeholder image — following DESIGN.md.
---

# Build a wedding site section

A "section" is a block the couple can add/reorder on any page in Studio. Each one has four parts that must stay in sync.

## Steps

1. **Define the job.** One sentence: what does a guest get from this section? Check `docs/INSPIRATION.md` for patterns.
2. **Schema** — `sanity/schemaTypes/sections/<name>.ts`
   - `defineType({ name: '<name>', type: 'object', ... })` with friendly `title` + `description` on every field.
   - Images: `{ type: 'image', options: { hotspot: true }, fields: [alt (required), placeholder (boolean)] }`.
   - Add a `preview` so it reads nicely in the page builder.
   - Register it in `sanity/schemaTypes/index.ts` and in the `page.sections[]` `of` array.
3. **Query** — add a projection to `sanity/lib/queries.ts` under the sections `_type == "<name>" => {...}` switch. Expand image assets with `asset->{ _id, metadata { lqip, dimensions } }`.
4. **Component** — `components/sections/<Name>.tsx`
   - Typed props from the query. Server Component unless interactive.
   - Tokens only. Layout should differ from adjacent sections (asymmetric splits, full-bleed, offset grids).
   - Empty data → return `null`.
   - Register in `components/sections/index.tsx` map (`_type` → component).
5. **Motion** — wrap content in `components/motion/*` (Reveal, Parallax…). See `motion-pattern` skill. Reduced-motion fallback required.
6. **Placeholder content** — add seed data in `sanity/seed/` with placeholder image slot IDs from `docs/PLACEHOLDER_IMAGES.md` (add a new slot row there if needed).
7. **Verify** — 375 / 768 / 1440 widths, keyboard pass, reduced-motion on, `npm run lint && npm run typecheck && npm run build`.
8. **Docs** — tick the box in `docs/ROADMAP.md`.

## Checklist before done
- [ ] No hard-coded copy, dates, names or image URLs
- [ ] All images have alt + sizes + blur
- [ ] Text over photos has a scrim and passes 4.5:1
- [ ] Works with 0, 1 and many items
- [ ] Editable from Studio Presentation view (click-to-edit works)
