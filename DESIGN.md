# DESIGN.md — "Ruby & Gold" (v1.0)

> Matches the wedding itself: **white, with red accents and gold details** (gold like the place settings and centerpieces). Every page reads these tokens (`app/globals.css`), so a change here changes the whole site. If we pick an exact red from the flowers or linens, swap `--primary` / `--wine`.

**Feeling:** a printed wedding invitation come to life — white and airy, formal like their black-and-white engagement photos, with red where you'd find roses and gold where you'd find gilding. Photos do the talking; type is large and confident.

---

## Color

| Token | Value | Role |
|---|---|---|
| `--paper` | `#FFFDFA` | Page background (warm white) |
| `--paper-2` | `#F7F1E7` | Alternate sections, cards (champagne cream) |
| `--ink` | `#1B1517` | Text, headings; dark sections (hero panel, gallery strip) |
| `--ink-2` | `#5E5459` | Secondary text, captions |
| `--line` | `#E6DCCD` | Hairlines, borders |
| `--primary` | `#8F1D2C` | **Ruby red** — buttons, RSVP, links, italic highlight words, story dates |
| `--primary-hover` | `#741522` | Hover/pressed red |
| `--primary-ink` | `#FFFFFF` | Text on red |
| `--accent` | `#806128` | **Antique gold** — small labels (eyebrows) on light backgrounds |
| `--gold` | `#A9843F` | **Gold** — monogram ring, page dividers, story thread, icons, ornaments |
| `--gold-light` | `#D9BC7A` | Gold on dark backgrounds (hero, gallery strip, footer) |
| `--wine` | `#4A0F18` | Deep red band — footer, favicon, link-preview card |
| `--success` / `--warning` / `--error` | `#3F7A4F` / `#A06F12` / `#B3261E` | Form states |

Rules:
- White leads; red is an accent (one or two touches per screen); gold is for linework and small details — never big gold fills.
- Contrast: red on white 8.8:1, antique gold on white 5.7:1 (OK for small text), `--gold` is 3.5:1 → only for large type, lines and icons. Text over photos sits on a scrim.
- Red never sits directly on near-black (too low contrast) — use `--gold-light` on dark backgrounds.
- No gradient text, no glassmorphism, no glitter textures.

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
- **Button primary:** ruby-red pill, Jost 500 uppercase tracked, 48px tall; hover darkens + arrow nudges; focus 2px ring offset 3px
- **Button secondary:** pill outline `--ink`; hover fills. **Light:** white outline for dark/red backgrounds
- **Quiet link:** underline that draws in on hover
- **Headings:** one italic word or phrase in ruby red ("Where to be, *and when.*"); gold-light italics on dark sections
- **Monogram:** initials in a thin gold ring, red ampersand (gold on dark)
- **Nav:** transparent over hero, turns `--paper` with hairline on scroll; red RSVP pill always visible; mobile = full-screen overlay menu with staggered links
- **Page header:** antique-gold eyebrow, large title, gold hairline that draws across
- **Event card:** time (display numerals), name (h3), venue, attire, "Directions" + "Add to calendar"
- **Inputs:** underline style, large label, clear error text below; RSVP choices are pills that fill red when chosen
- **Footer:** deep wine band — gold eyebrow and italics, gold monogram ring, white RSVP outline button

## Motion
- Ease: `cubic-bezier(.22,1,.36,1)` (expo-out); durations 400–900ms; stagger 60–90ms
- Reveal: fade + 24px rise, triggered once at 15% in view
- Images: subtle scale 1.08 → 1 as they enter; parallax max 10%
- Page transition: champagne curtain wipe, 900ms
- `prefers-reduced-motion`: opacity fades only, no parallax/pinning/smooth-scroll

## Imagery & icons
- Photography-led: vertical hero photo as a tall panel on desktop, full-bleed on phones; gallery shown uncropped
- Placeholders: soft-blur stand-ins in ivory / champagne / ruby tones until we swap (see `docs/PLACEHOLDER_IMAGES.md`)
- Icons: **Phosphor (light weight)**, 20–24px, `--ink-2` or `--gold`. No emoji as icons.
- Optional later: thin gold line ornaments (roses, a laurel) as section dividers, matched to the invitations
