#!/usr/bin/env bash
# Static preview of the site for GitHub Pages → ./out
#   bash scripts/build-pages.sh            (uses PAGES_BASE_PATH, default /wedding-website)
# Static hosting has no server, so the preview leaves out the editor (/studio) and the
# Sanity webhook, and RSVP runs in demo mode in the browser. The full site deploys to Vercel.
set -euo pipefail
cd "$(dirname "$0")/.."

export PAGES_BASE_PATH="${PAGES_BASE_PATH:-/wedding-website}"
SERVER_ONLY=(app/api app/studio "app/(site)/rsvp/actions.ts" "app/(site)/photos/actions.ts" "app/(site)/icon.tsx" "app/(site)/opengraph-image.tsx")

if [ "${CI:-}" != "true" ]; then
  # Local run: put the server-only files back afterwards
  if ! git diff --quiet -- "${SERVER_ONLY[@]}"; then
    echo "Commit or stash your changes in: ${SERVER_ONLY[*]}" >&2
    exit 1
  fi
  trap 'git checkout -- "${SERVER_ONLY[@]}"; rm -f "app/(site)/icon.png" "app/(site)/opengraph-image.png"; rm -rf .next' EXIT
fi

rm -rf app/api app/studio .next out
cp preview/rsvp-actions.demo.ts "app/(site)/rsvp/actions.ts"
cp preview/photos-actions.demo.ts "app/(site)/photos/actions.ts"
# Generated images can't render on demand on a static host → use pre-made copies
# (refresh them from the full site: preview/icon.png, preview/opengraph-image.png)
rm -f "app/(site)/icon.tsx" "app/(site)/opengraph-image.tsx"
cp preview/icon.png "app/(site)/icon.png"
cp preview/opengraph-image.png "app/(site)/opengraph-image.png"

npx next build

# Static export writes icon/share images under one hashed name but links them under another → copy to the linked names
for kind in icon opengraph-image; do
  linked=$(grep -o "${kind}-[a-z0-9]*\.png" out/index.html | head -1 || true)
  built=$(ls out | grep -E "^${kind}-[a-z0-9]+\.png$" | head -1 || true)
  if [ -n "$linked" ] && [ -n "$built" ] && [ "$linked" != "$built" ]; then cp "out/$built" "out/$linked"; fi
done

touch out/.nojekyll
echo "✓ Static preview in ./out (base path ${PAGES_BASE_PATH})"
