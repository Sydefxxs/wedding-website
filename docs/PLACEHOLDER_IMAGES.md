# Placeholder images

All photos right now are **temporary**. Each image "slot" has a fixed ID, so swapping is one upload — layout won't break.

## How placeholders work
- Placeholders live in `public/placeholders/` and are also seeded into Sanity, named by slot ID (e.g. `hero-main.jpg`).
- Sources: free warm-toned stock (Unsplash license) or solid-color blocks with the slot name printed on them, so it's obvious what still needs swapping.
- Every placeholder is tagged `placeholder: true` in Sanity → Studio shows a **"Still placeholder"** list so nothing slips through to launch.

## How to swap one (no code)
1. Open `/studio` → find the section (e.g. Home → Hero).
2. Click the image → **Upload** your photo.
3. Set the **hotspot** (the dot = part that must never be cropped, usually faces).
4. Fill in **alt text** (e.g. "Ana and Luis laughing on the beach at sunset").
5. Untick **placeholder** → Publish.

Or ask Claude: *"swap hero-main with this photo"* (uses the `swap-placeholder-image` skill).

## Slots

| Slot ID | Where | Aspect | Min size | Notes |
|---|---|---|---|---|
| `hero-main` | Home hero | 16:9 (mobile crops 9:16) | 2400×1350 | Most important photo. Faces centered or rule-of-thirds |
| `hero-video` *(optional)* | Home hero loop | 16:9 | 1080p, ≤ 8s, ≤ 4 MB | Muted MP4 + WebM |
| `intro-portrait` | Home intro | 4:5 | 1200×1500 | |
| `story-01` … `story-08` | Our Story timeline | 4:5 or 3:2 | 1400 wide | One per moment |
| `venue-ceremony` | Schedule | 3:2 | 1800×1200 | |
| `venue-reception` | Schedule | 3:2 | 1800×1200 | |
| `travel-city` | Travel & Stay header | 21:9 | 2400×1030 | City/landscape shot |
| `hotel-01` … `hotel-04` | Hotel cards | 4:3 | 1200×900 | Hotels usually supply these |
| `party-*` | Wedding Party | 1:1 | 800×800 | One per person |
| `gallery-*` | Gallery | mixed | 2000 long edge | 15–40 photos |
| `registry-banner` | Registry | 3:1 | 2400×800 | |
| `og-share` | Link preview in texts/social | 1.91:1 | 1200×630 | Names + date overlaid |
| `monogram` | Nav, footer, favicon | SVG | — | Our initials |

## Tips for our real photos
- Export JPG at high quality; Sanity auto-converts to AVIF/WebP and resizes.
- Keep a consistent edit/color grade across the set — it makes the site look designed.
- Horizontal shots for heroes, vertical for portraits/story.
