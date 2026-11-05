# DESIGN.md — "Noir & Rose" (v2.0)

> **Dark and elegant** — chosen by Arath & Ruby over the light version. Black-tie like their engagement photos (black suit, white dress), **gold** for the details (like the place settings and centerpieces), and **rose red only as a touch** — like a single rose, never a red page. Every page reads these tokens (`app/globals.css`), so a change here changes the whole site.

**Feeling:** an evening reception — candlelit, cinematic, intimate. Photos glow against near-black; type is large, ivory and confident.

---

## Color

| Token | Value | Role |
|---|---|---|
| `--paper` | `#0E0C0D` | Page background (warm near-black) |
| `--paper-2` | `#161214` | Alternate sections, cards, image loading |
| `--night` | `#080707` | Deepest black — hero panel, gallery strip, footer |
| `--ink` | `#F4EDE4` | Ivory — main text, headings |
| `--ink-2` | `#B5AAA3` | Secondary text, captions (8.6:1) |
| `--line` | `#2E2729` | Hairlines, borders |
| `--primary` | `#C9A961` | **Gold** — buttons (dark text), links, focus rings, story dates |
| `--primary-hover` | `#DCC188` | Hover gold |
| `--primary-ink` | `#0E0C0D` | Text on gold |
| `--accent` / `--gold` | `#C9A961` | Gold labels (eyebrows), monogram ring, dividers, story thread, icons |
| `--gold-light` | `#E2CB92` | Brighter gold on the deepest black and over photos |
| `--rose` | `#D14B5F` | **Rose red** — the "&" in our names, the monogram "&", one italic word per section. Nothing else. |
| `--success` / `--warning` / `--error` | `#7FBF8E` / `#E0B354` / `#EF7B7B` | Form states (light enough for dark backgrounds) |

Rules:
- Dark leads; gold carries the details; rose red appears at most once or twice per screen.
- Contrast on `--paper`: ivory 16:1, gold 8.5:1, rose 4.5:1 — rose is fine for large italics and the ampersand; never for body text or buttons.
- Sections alternate `--paper` / `--paper-2` / `--night` so scrolling has rhythm instead of one flat black.
- No gradient text, no glassmorphism, no glitter textures, no big red areas.

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
- **Button primary:** gold pill with dark text, Jost 500 uppercase tracked, 48px tall; hover brightens + arrow nudges; focus 2px ring offset 3px
- **Button secondary:** ivory outline pill; hover fills ivory. **Light:** white outline for photos and the deepest black
- **Quiet link:** underline that draws in on hover
- **Headings:** one italic word or phrase per section in rose red on the home page ("Where to be, *and when.*"); gold italics elsewhere
- **Monogram:** initials in a thin gold ring, rose ampersand
- **Nav:** transparent over hero, turns translucent black with hairline on scroll; gold RSVP pill always visible; mobile = full-screen overlay menu with staggered links
- **Page header:** gold eyebrow, large ivory title, gold hairline that draws across
- **Event card:** time (display numerals), name (h3), venue, attire, "Directions" + "Add to calendar"
- **Inputs:** underline style, large label, clear error text below; RSVP choices are pills that fill gold when chosen
- **Footer:** deepest-black band — gold eyebrow and italics, gold monogram ring with rose ampersand, white RSVP outline button

## Motion
- Ease: `cubic-bezier(.22,1,.36,1)` (expo-out); durations 400–900ms; stagger 60–90ms
- Reveal: fade + 24px rise, triggered once at 15% in view
- Images: subtle scale 1.08 → 1 as they enter; parallax max 10%
- Page transition: dark curtain wipe, 900ms (the wrapper keeps no transform afterwards — a leftover transform breaks pinned sections)
- `prefers-reduced-motion`: opacity fades only, no parallax/pinning/smooth-scroll

## Imagery & icons
- Photography-led: vertical hero photo as a tall panel on desktop, full-bleed on phones; gallery shown uncropped
- Placeholders: soft-blur stand-ins in champagne / rose / candlelight tones until we swap (see `docs/PLACEHOLDER_IMAGES.md`)
- Icons: **Phosphor (light weight)**, 20–24px, `--ink-2` or `--gold`. No emoji as icons.
- Optional later: thin gold line ornaments (roses, a laurel) as section dividers, matched to the invitations
