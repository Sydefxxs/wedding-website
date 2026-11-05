---
name: add-cms-content-type
description: Add or change editable content in Sanity for the wedding site — new document types (events, hotels, FAQ, guests), new fields, Studio structure, GROQ queries and revalidation — so the couple can edit it without code.
---

# Add editable content (Sanity)

## Document type vs section
- **Document** (`type: 'document'`) = a reusable thing listed in Studio: event, hotel, person, faq, guest, rsvp.
- **Section** (`type: 'object'`) = a block placed on a page → use the `wedding-section` skill instead.

## Steps
1. Create `sanity/schemaTypes/documents/<name>.ts` with `defineType`/`defineField`.
   - Every field: human `title`, `description` explaining where it shows on the site, `validation`.
   - Add `orderings` and a `preview` (title + subtitle + media).
   - Dates: `datetime` with the venue's time zone noted in `description`.
2. Register in `sanity/schemaTypes/index.ts`.
3. Add it to the Studio sidebar in `sanity/structure.ts` (correct group, friendly icon from `@phosphor-icons/react` or `@sanity/icons`).
4. Write the GROQ query in `sanity/lib/queries.ts`; fetch with `sanityFetch({ query, tags: ['<name>'] })`.
5. Revalidation: make sure the webhook payload's `_type` maps to the tag in `app/api/revalidate/route.ts`.
6. Seed placeholder docs in `sanity/seed/<name>.ndjson` (use `[brackets]` for unknown facts).
7. Update the content model table in `docs/ARCHITECTURE.md` and the "Common edits" table in `docs/CONTENT_EDITING.md`.

## Sensitive data (guests, RSVPs)
- Mark the type in structure under a "Private" group.
- Never query from a client component. Access only in server actions/route handlers with the server token.
- Validate inputs with zod; trim + normalize names for lookup.
- For imports: `scripts/import-guests.ts --dry-run` first, show a diff, then run for real only after the couple confirms.
