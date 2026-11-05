# AI workflow — agents & skills

This repo ships with Claude agents (`.claude/agents/`) and skills (`.claude/skills/`) tuned for this site. Open the repo in Claude Code (or Claude with this repo attached) and they're picked up automatically.

## Agents (who does the work)

| Agent | Role | Use when |
|---|---|---|
| `design-director` | Look & feel, DESIGN.md, design reviews | Starting a page, changing colors, "this looks generic" |
| `frontend-builder` | Builds pages/sections in Next.js + Tailwind | Any UI implementation |
| `motion-designer` | GSAP/ScrollTrigger + Lenis "wow" | Hero, story timeline, gallery, page transitions, janky animation |
| `cms-architect` | Sanity schemas, Studio, RSVP + guest data | Making something editable, guest import, RSVP logic |
| `content-writer` | Guest-facing wording | Any copy, FAQ, RSVP messages |
| `qa-reviewer` | Read-only audit (a11y, perf, privacy, leftovers) | End of each phase, before launch |

## Skills (how a task is done)

| Skill | What it covers |
|---|---|
| `wedding-section` | Schema → query → component → motion → placeholder, for any section |
| `motion-pattern` | Library of reusable animation components + recipe |
| `add-cms-content-type` | New editable document types/fields + guest-data rules |
| `swap-placeholder-image` | Replace a temp photo properly (EXIF, hotspot, alt, unflag) |
| `wedding-copy` | Voice + rules for every kind of text on the site |
| `launch-checklist` | Everything that must pass before sending the link |

## Typical flow per phase
1. `design-director` proposes the layout →
2. `cms-architect` adds the fields →
3. `frontend-builder` builds it →
4. `motion-designer` adds the moment →
5. `content-writer` fills copy →
6. `qa-reviewer` checks it.

## Also useful (installed plugins)
`website-design:web-design-system`, `website-design:landing-page`, `website-design:web-review`, `frontend-design`, `design:ux-copy`, `design:accessibility-review`, `seo-aeo-geo-ultimate:seo-images`.

## Example prompts
- "Build the Schedule page" → uses `wedding-section`
- "Make the Our Story timeline pin and scroll like a film" → `motion-designer` + `motion-pattern`
- "Add a 'Things to Do' page we can edit" → `cms-architect` + `add-cms-content-type`
- "Swap hero-main with this photo" → `swap-placeholder-image`
- "Are we ready to launch?" → `qa-reviewer` + `launch-checklist`
