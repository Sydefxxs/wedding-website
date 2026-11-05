/**
 * Browser-only photo upload used by the GitHub Pages preview (no server there).
 * scripts/build-pages.sh swaps this in for app/(site)/photos/actions.ts. Nothing is saved.
 */
export type UploadResult = { ok: true; demo?: boolean; hidden?: boolean } | { ok: false; error: string }

export async function uploadGuestPhoto(form: FormData): Promise<UploadResult> {
  await new Promise((r) => setTimeout(r, 500))
  const file = form.get('photo')
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Please choose a photo.' }
  return { ok: true, demo: true }
}
