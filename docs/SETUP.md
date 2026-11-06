# Turning on the back end (saved RSVPs, photo uploads, editor)

Everything is built — these steps just create the free accounts and connect them. They need your logins, so you click them; about 15 minutes. Do them in order.

## 1. Sanity — where content, RSVPs and guest photos are stored
1. Go to **sanity.io/manage** → sign up / log in (use Google or GitHub).
2. **Create new project** → name it `Arath & Ruby Wedding` → dataset **production** → *Public* is fine.
3. Copy the **Project ID** (a short code like `ab12cd34`) — send it to Claude, it's not secret.
4. In the project: **API → Tokens → Add API token** → name `website` → permission **Editor** → copy the token (it's only shown once). **Keep this one private — don't paste it in chat.**

## 2. GitHub — store the keys and load the content
1. Go to **github.com/Sydefxxs/wedding-website → Settings → Secrets and variables → Actions**.
2. **Secrets** tab → *New repository secret* → name `SANITY_API_WRITE_TOKEN`, value = the token.
3. **Variables** tab → *New repository variable* → name `SANITY_PROJECT_ID`, value = the Project ID.
4. **Actions** tab → **Load content into Sanity** → *Run workflow*. When it turns green, every page, photo, event and FAQ is in Sanity.

## 3. Vercel — the real website (the GitHub Pages one stays as a preview)
1. Go to **vercel.com** → *Sign up with GitHub*.
2. **Add New → Project** → import `Sydefxxs/wedding-website`.
3. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | the Project ID |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `SANITY_API_WRITE_TOKEN` | the token |
   | `SANITY_REVALIDATE_SECRET` | any long made-up password, e.g. `rosesandgold-2027-xyz` |

4. **Deploy**. You get a link like `wedding-website-xxxx.vercel.app`.

## 4. Let the editor run on that link
In **sanity.io/manage → your project → API → CORS origins → Add**: your Vercel link (e.g. `https://wedding-website-xxxx.vercel.app`), tick **Allow credentials**. Later add your domain the same way.

Now open **your-link/studio**, log in with the same Sanity account — that's the editor.

## 5. Instant updates (optional but nice)
**sanity.io/manage → API → Webhooks → Create webhook**:
- URL: `https://your-link/api/revalidate`
- Dataset: production · Trigger on: Create, Update, Delete
- HTTP method: POST · Secret: the same `SANITY_REVALIDATE_SECRET`

Without this, edits still show up — just within about an hour instead of seconds.

## 6. Guest list
Fill in `docs/guest-list-template.csv` (one row per invitation, names separated by `;`) and send it to Claude, or add invitations by hand in the Studio under **Private → Guest list**. Guests find themselves on the RSVP page by typing their full name.

---

### Where things are once it's on
| What | Where |
|---|---|
| Edit any text or photo | `/studio` → the matching section |
| See RSVPs + download a spreadsheet | `/studio` → **RSVPs** tab at the top |
| Guest photos (hide any) | `/studio` → **Guest photos** |
| Approval / upload code / close uploads | `/studio` → Site Settings → **Guest photos** |

### Privacy defaults
- Search engines are told not to list the site.
- The guest list never reaches the browser; lookups, RSVPs and uploads run on the server.
- Photos lose their location data before they're stored.

### For developers
`npm run dev` (needs `.env.local` with the same variables) · `npm run seed` · `npm run import-guests -- file.csv [--commit]`.
