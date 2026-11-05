---
name: swap-placeholder-image
description: Replace a temporary placeholder photo on the wedding site with a real one — find the slot, optimize the file, upload to Sanity with hotspot and alt text, and clear its placeholder flag.
---

# Swap a placeholder image

1. **Find the slot.** Match the request to a slot ID in `docs/PLACEHOLDER_IMAGES.md` (e.g. "the big photo on the homepage" → `hero-main`). If unclear, list matching slots and ask.
2. **Check the file.** Compare against the slot's aspect ratio and min size. Warn (don't block) if it's too small, the wrong orientation, or faces would be cropped on mobile.
3. **Prepare.** Strip GPS/EXIF location data (`exiftool -gps:all= -overwrite_original`), keep color profile, export high-quality JPG. Don't resize down — Sanity's CDN handles sizes.
4. **Upload.** Upload to Sanity (`client.assets.upload('image', stream, { filename: '<slot-id>.jpg' })`) and patch the document field that uses the slot.
5. **Hotspot.** Set hotspot to the faces/subject (ask the couple if unsure).
6. **Alt text.** Write a specific description ("Ana and Luis dancing under string lights"), not "photo".
7. **Unflag.** Set `placeholder: false`. Update the slot row in `docs/PLACEHOLDER_IMAGES.md` to ✅.
8. **Verify** the page at 375px and 1440px — crop, scrim contrast over the photo, and LCP still fast.

Manual alternative for the couple: see "How to swap one" in `docs/PLACEHOLDER_IMAGES.md`.
