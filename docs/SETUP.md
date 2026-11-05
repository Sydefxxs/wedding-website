# Setup — from this repo to a live, editable site

The site already runs without any accounts (on the starter content in `content/placeholder.ts`). These steps connect the editor (Sanity) and put it online (Vercel). About 20 minutes, all free tiers.

## 1. Run it on your computer
```bash
npm install
npm run dev          # http://localhost:3000
```

## 2. Create the Sanity project (the editor)
1. Go to **sanity.io/manage** → sign in (Google/GitHub) → **Create new project** → name it "Arath & Ruby Wedding", dataset `production`.
2. Copy the **Project ID**.
3. **API → Tokens → Add API token** → name "website", permission **Editor** → copy it (shown once).
4. **API → CORS origins → Add**: `http://localhost:3000` (allow credentials) — later also your live domain.
5. Create `.env.local` in the project folder (never commit it):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=the-token
   SANITY_REVALIDATE_SECRET=any-long-random-string
   ```
6. Load everything in: `npm run seed -- --demo-guest` → uploads all photos and content, plus a "Test Guest" invitation.
7. Restart `npm run dev` and open **http://localhost:3000/studio**. Everything you see on the site is now editable there.

## 3. Add the guest list
1. Fill in `docs/guest-list-template.csv` (one row per invitation; separate names with `;`).
2. `npm run import-guests -- docs/guest-list-template.csv` → preview
3. `npm run import-guests -- docs/guest-list-template.csv --commit` → save
4. Guests then find themselves on `/rsvp` by typing their full name. RSVPs appear in Studio → **Private → RSVPs**.

## 4. Put it online (Vercel)
1. **vercel.com** → sign in with GitHub → **Add New → Project** → import `Sydefxxs/wedding-website`.
2. Add the same environment variables as `.env.local` (Settings → Environment Variables), plus `NEXT_PUBLIC_SITE_URL=https://your-domain.com`.
3. Deploy. Every push to `main` redeploys; every branch gets a preview link.
4. In Sanity → **API → CORS origins**, add your Vercel URL / domain.

## 5. Instant updates when you hit Publish
Sanity → **API → Webhooks → Create**:
- URL: `https://your-domain.com/api/revalidate`
- Dataset: production · Trigger on: create, update, delete
- Secret: the same `SANITY_REVALIDATE_SECRET`
- HTTP method: POST, API version: v2025-02-19 (or newer)

## 6. Custom domain
Vercel → Project → **Settings → Domains** → add e.g. `arathandruby.com` and follow the DNS steps.

## Privacy defaults
- Search engines are told not to index the site (`robots: noindex` in `app/(site)/layout.tsx`).
- The guest list is never sent to the browser; lookups and RSVPs run on the server with the write token.
- Photos added with `npm run add-photo` have their location data removed.
