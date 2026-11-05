---
name: launch-checklist
description: Run the pre-launch check for the wedding site — placeholders gone, RSVP end-to-end test, privacy, accessibility, performance, link previews and domain — and report what still blocks sending the link to guests.
---

# Launch checklist

Run with the `qa-reviewer` agent. Report each item ✅ / ❌ with the fix.

## Content
- [ ] Zero `placeholder: true` images (Studio → "Still placeholder")
- [ ] No `[bracket]` placeholder copy or lorem ipsum (`grep -rn "\[" sanity/seed` + Studio search)
- [ ] Names, date, times (with correct time zone), addresses, map links double-checked by both of us
- [ ] Hotel codes/deadlines, registry links work

## RSVP
- [ ] Test guest: find name → RSVP each event → confirmation → shows in Studio
- [ ] Wrong/partial name gives friendly error; full list is never revealed
- [ ] Edit-RSVP works; deadline message shows after the deadline
- [ ] Test guests deleted after testing

## Privacy & security
- [ ] Write token absent from client bundle
- [ ] Password / `noindex` set as we chose
- [ ] Photo EXIF GPS stripped

## Quality
- [ ] Lighthouse mobile ≥ 90 on Home, Schedule, RSVP
- [ ] Keyboard + screen-reader pass on nav, gallery lightbox, FAQ, RSVP form
- [ ] Reduced-motion mode looks complete
- [ ] Tested on real iPhone + Android, Safari + Chrome

## Sharing
- [ ] Custom domain + HTTPS
- [ ] OG image (`og-share`) previews correctly in iMessage/WhatsApp/Facebook
- [ ] Favicon / monogram
- [ ] Short, easy-to-type URL printed on save-the-dates
