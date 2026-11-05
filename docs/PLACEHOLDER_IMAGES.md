# Images — real photos & placeholders

Each image "slot" has a fixed place on the site, so swapping one never breaks the layout.

- **Real photos** live in `public/photos/` (listed in `content/photos.json`).
- **Temporary stand-ins** (soft-blur images with the slot name printed on them) live in `public/placeholders/` and are flagged `placeholder: true` → once Sanity is connected, Studio shows them under **"Still placeholder"** so nothing slips through to launch.

## Adding one of our photos
**In the Studio (no code):** open `/studio` → find the spot (e.g. Site Settings → Home page → Hero photo) → Upload → drag the **hotspot** dot onto our faces → write the description → untick "Still a placeholder?" → Publish.

**In code:** `npm run add-photo -- ~/Downloads/photo.jpg engagement-beach 0.5 0.4` — rotates, strips location data, sizes it, and records it in `content/photos.json` (the two numbers are the focal point: 0–1 across, 0–1 down). Then reference it in `content/placeholder.ts`. Or ask Claude: *"swap the Schedule ceremony photo with this one"* (`swap-placeholder-image` skill).

## Slots

| Slot | Where | Now | Best shape |
|---|---|---|---|
| Hero | Home, top | ✅ `engagement-dip-kiss` | Vertical → tall panel on desktop; horizontal → full-bleed |
| Link preview | Texts / social (names + date added automatically) | ✅ `engagement-save-the-date` | Any; faces + sign |
| Intro | Home, "Welcome" | ✅ `engagement-cheek-kiss` | 4:5 |
| Our Story (6) | Story timeline + home collage | ✅ engagement + proposal photos | 4:5 or 3:2 |
| Gallery | Home strip + Gallery page | ✅ all 10 photos | Any (shown uncropped) |
| Registry banner | Registry | ✅ `engagement-ring-embrace` (ring detail) | 3:1 crop |
| Venue (Santa Fe Event Center) | Schedule + home venue card | ⏳ placeholder | 3:2, 1800×1200 |
| Wedding party (8) | Wedding Party page | ⏳ placeholder | 4:5 portraits, one per person |
| Things to Do (2) | Example custom page | ⏳ placeholder | 4:3 |
| Monogram / favicon | Menu, footer, browser tab | ✅ generated from our initials | — |

## About our photos
- Engagement photos are by **Roy Esparza Photography** — the watermark is kept and he's credited on the Gallery page and footer. Ask him for web-size files and confirm he's happy with them being posted with credit.
- Location data (GPS) was removed from every photo added.
- Keep a consistent edit/color grade across new photos — it makes the site look designed.
