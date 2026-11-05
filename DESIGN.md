# DESIGN.md — "Editorial Romance" (draft v0.1)

> **Draft.** Chosen as a starting point because we haven't picked colors yet. It's based on patterns from the wedding-site research in `docs/INSPIRATION.md` (serif names, soft neutrals, big photography), not on a visual audit of specific sites. Swap the palette once we choose our wedding colors — every page reads these tokens, so a change here changes the whole site.

**Feeling:** a printed wedding magazine come to life — calm, luxurious, personal, with cinematic motion. Photos do the talking; type is large and confident; color is restrained.

---

## Color

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#F7F3EC` | `#161412` | Page background (warm ivory) |
| `--paper-2` | `#EFE8DC` | `#1F1C19` | Alternate section background, cards |
| `--ink` | `#1E1B18` | `#F2ECE2` | Primary text, headings |
| `--ink-2` | `#5B544C` | `#B7AEA2` | Secondary text, captions |
| `--line` | `#D9CFC0` | `#38322C` | Borders, dividers, hairlines |
| `--primary` | `#6B7A5E` | `#9DAE8E` | Buttons, links, active nav (sage/olive) |
| `--primary-ink` | `#FFFFFF` | `#161412` | Text on primary |
| `--accent` | `#B4765A` | `#D29A7E` | Sparingly: monogram, date, small flourishes (terracotta) |
| `--success` | `#4F7A55` | `#8DBF93` | RSVP confirmed |
| `--warning` | `#B4862F` | `#E0B867` | Deadline approaching |
| `--error` | `#A6403A` | `#E58A84` | Form errors |

Rules: one primary, one accent. Text ≥ 4.5:1 contrast; text over photos always sits on a gradient scrim (`rgba(0,0,0,.45)` → transparent). No gradient text, no purple, no glassmorphism.

## Typography

- **Display:** *Cormorant Garamond* (300/500, + italic) — names, headings, big numbers
- **Body/UI:** *Jost* (400/500) — paragraphs, nav, buttons, labels
- **Accent (optional, once per page max):** a signature script for "&" or a hand-signed sign-off

| Name | Size (mobile → desktop) | Line height | Use |
|---|---|---|---|
| `display` | 56 → 128px | 0.95 | Hero names |
| `h1` | 40 → 72px | 1.05 | Page titles |
| `h2` | 30 → 48px | 1.1 | Section titles |
| `h3` | 22 → 28px | 1.25 | Card titles, event names |
| `body-lg` | 18 → 20px | 1.6 | Intros |
| `body` | 16 → 17px | 1.65 | Paragraphs (max 65ch) |
| `small` | 14px | 1.5 | Captions, meta |
| `eyebrow` | 12–13px, tracking 0.2em, uppercase, Jost 500 | 1.4 | Labels above headings |

## Spacing & layout
- 8px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160
- Section padding: 96px mobile / 160px desktop
- Content width: 1200px max; text column 65ch; full-bleed photos allowed
- Layouts vary: asymmetric image/text splits, offset grids, full-bleed moments. **Not** every section centered.

## Shape & depth
- Radius: `0` for photos (editorial), `2px` inputs, `999px` pill buttons
- Shadows: none by default; one soft `0 20px 60px -20px rgba(30,27,24,.25)` for lifted cards/lightbox
- Hairline 1px `--line` dividers and frames instead of boxes

## Components
- **Button primary:** pill, `--primary` bg, Jost 500 uppercase tracked, 48px tall; hover darkens 8% + arrow nudges; focus 2px ring offset 3px
- **Button secondary:** pill outline `--ink`; hover fills
- **Quiet link:** underline that draws in on hover
- **Nav:** transparent over hero, turns `--paper` with hairline on scroll; RSVP button always visible; mobile = full-screen overlay menu with staggered links
- **Event card:** time (display numerals), name (h3), venue, attire chip, "Map" + "Add to calendar"
- **Inputs:** underline style, large label, clear error text below
- **Footer:** monogram, date, "Made with love" line

## Motion
- Ease: `cubic-bezier(.22,1,.36,1)` (expo-out); durations 400–900ms; stagger 60–90ms
- Reveal: fade + 24px rise, triggered once at 15% in view
- Images: subtle scale 1.08 → 1 as they enter; parallax max 10%
- Page transition: ivory curtain wipe, 600ms
- `prefers-reduced-motion`: opacity fades only, no parallax/pinning/smooth-scroll

## Imagery & icons
- Photography-led: full-bleed hero, mixed portrait/landscape in gallery, film-like warm grade
- Placeholders: warm-toned stock until we swap (see `docs/PLACEHOLDER_IMAGES.md`)
- Icons: **Phosphor (light weight)**, 20–24px, `--ink-2`. No emoji as icons.
- Optional: thin botanical line illustrations in `--accent` as section dividers
