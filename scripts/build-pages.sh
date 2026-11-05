#!/usr/bin/env bash
# Static preview of the site for GitHub Pages → ./out
#   bash scripts/build-pages.sh            (uses PAGES_BASE_PATH, default /wedding-website)
# Static hosting has no server, so the preview leaves out the editor (/studio) and the
# Sanity webhook, and RSVP runs in demo mode in the browser. The full site deploys to Vercel.
set -euo pipefail
cd "$(dirname "$0")/.."

export PAGES_BASE_PATH="${PAGES_BASE_PATH:-/wedding-website}"
SERVER_ONLY=(app/api app/studio "app/(site)/rsvp/actions.ts" "app/(site)/icon.tsx" "app/(site)/opengraph-image.tsx")

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
# Generated images can't render on demand on a static host → use pre-made copies
# (refresh them from the full site: preview/icon.png, preview/opengraph-image.png)
rm -f "app/(site)/icon.tsx" "app/(site)/opengraph-image.tsx"
cp preview/icon.png "app/(site)/icon.png"
cp preview/opengraph-image.png "app/(site)/opengraph-image.png"

npx next build

touch out/.nojekyll
echo "✓ Static preview in ./out (base path ${PAGES_BASE_PATH})"
